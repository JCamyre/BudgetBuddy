import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from server.main import app
from server.routes.suggestions import BudgetQuestionnaire, GoalQuestionnaire
import json
from judgeval import JudgmentClient
from judgeval.scorers import AnswerCorrectnessScorer, AnswerRelevancyScorer
from judgeval.data import Example
from unittest.mock import patch, AsyncMock
from server.routes.suggestions import suggest_goals

client = TestClient(app)

@pytest.fixture
def sample_budget_questionnaire():
    return BudgetQuestionnaire(
        financial_situation="I make $5000 per month",
        spending_habits="I tend to spend a lot on dining out",
        financial_goals="I want to save for a house down payment",
        lifestyle_preferences="I enjoy an active lifestyle",
        financial_concerns="I want to reduce my dining expenses"
    )

@pytest.fixture
def sample_goal_questionnaire():
    return GoalQuestionnaire(
        current_situation="I have $10000 in savings",
        future_aspirations="I want to buy a house in 5 years",
        risk_comfort="Moderate risk tolerance",
        timeline_description="Looking to achieve goals within 5 years",
        constraints="Need to pay student loans"
    )

@pytest.fixture
def mock_llm_budget_response():
    return json.dumps({
        "budget_name": "Basic Monthly Budget",
        "spending_limit": 3000.00,
        "duration": "monthly"
    })

@pytest.fixture
def golden_llm_goals_response():
    return json.dumps([
        'Create a dedicated savings plan for a home down payment, aiming to save an additional $10,000 to $20,000 over the next 5 years', 'Pay off high-interest student loans aggressively to free up monthly cash flow for savings and investments', 'Invest $5,000 to $10,000 of your current savings in a diversified portfolio with moderate risk to grow your wealth over the next 5 years', 'Improve your credit score by paying all bills on time and reducing debt-to-income ratio to qualify for better mortgage rates'
    ])

@pytest.mark.asyncio
async def test_suggest_budget_success(sample_budget_questionnaire, mock_llm_budget_response):
    with patch('server.routes.suggestions.get_llm_response', new_callable=AsyncMock) as mock_get_llm:
        mock_get_llm.return_value = mock_llm_budget_response
        
        response = client.post("/suggest-budget/", json=sample_budget_questionnaire)
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Basic Monthly Budget"
        assert data["spending_limit"] == 3000.00
        assert data["duration"] == "monthly"
        assert "user_id" in data

@pytest.mark.asyncio
async def test_suggest_budget_invalid_llm_response():
    with patch('server.routes.suggestions.get_llm_response', new_callable=AsyncMock) as mock_get_llm:
        mock_get_llm.return_value = "Invalid JSON response"
        
        response = client.post("/suggest-budget/", json=sample_budget_questionnaire())
        
        assert response.status_code == 500
        assert "Failed to parse LLM response as JSON" in response.json()["detail"]

@pytest.mark.asyncio
async def test_suggest_goals_success(sample_goal_questionnaire, golden_llm_goals_response):
    # Actually call the endpoint to get a dynamic LLM response.
    response = await suggest_goals(sample_goal_questionnaire)
    
    assert isinstance(response, list)
    
    client: JudgmentClient = JudgmentClient()
    answer_correctness_scorer = AnswerCorrectnessScorer(threshold=0.5)
    answer_relevancy_scorer = AnswerRelevancyScorer(threshold=0.8)
    
    example = Example(input=sample_goal_questionnaire, actual_output=response, expected_output=golden_llm_goals_response)
    
    client.assert_test(
        examples=[example],
        scorers=[answer_correctness_scorer, answer_relevancy_scorer],
        model="gpt-4o-mini",
        project_name="test-suggest-goals",
        override=True
    )
        
        

@pytest.mark.asyncio
async def test_suggest_goals_invalid_llm_response():
    with patch('server.routes.suggestions.get_llm_response', new_callable=AsyncMock) as mock_get_llm:
        mock_get_llm.return_value = "Invalid JSON response"
        
        response = client.post("/api/suggest-goals/", json=sample_goal_questionnaire())
        
        assert response.status_code == 500
        assert "Failed to parse LLM response" in response.json()["detail"]

def test_budget_questionnaire_validation():
    invalid_questionnaire = {
        "financial_situation": "",  # Empty string should be invalid
        "spending_habits": "Some habits",
        "financial_goals": "Some goals",
        "lifestyle_preferences": "Some preferences",
        "financial_concerns": "Some concerns"
    }
    
    response = client.post("/suggest-budget/", json=invalid_questionnaire)
    assert response.status_code == 422  # Validation error

def test_goal_questionnaire_validation():
    invalid_questionnaire = {
        "current_situation": "",  # Empty string should be invalid
        "future_aspirations": "Some aspirations",
        "risk_comfort": "Low risk",
        "timeline_description": "5 years",
        "constraints": "None"
    }
    
    response = client.post("/api/suggest-goals/", json=invalid_questionnaire)
    assert response.status_code == 422  # Validation error

