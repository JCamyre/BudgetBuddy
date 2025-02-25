import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from server.main import app
from server.routes.suggestions import BudgetQuestionnaire, GoalQuestionnaire
import json
from unittest.mock import patch, AsyncMock

client = TestClient(app)

@pytest.fixture
def sample_budget_questionnaire():
    return {
        "financial_situation": "I make $5000 per month",
        "spending_habits": "I tend to spend a lot on dining out",
        "financial_goals": "I want to save for a house down payment",
        "lifestyle_preferences": "I enjoy an active lifestyle",
        "financial_concerns": "I want to reduce my dining expenses"
    }

@pytest.fixture
def sample_goal_questionnaire():
    return {
        "current_situation": "I have $10000 in savings",
        "future_aspirations": "I want to buy a house in 5 years",
        "risk_comfort": "Moderate risk tolerance",
        "timeline_description": "Looking to achieve goals within 5 years",
        "constraints": "Need to pay student loans"
    }

@pytest.fixture
def mock_llm_budget_response():
    return json.dumps({
        "budget_name": "Basic Monthly Budget",
        "spending_limit": 3000.00,
        "duration": "monthly"
    })

@pytest.fixture
def mock_llm_goals_response():
    return json.dumps([
        "Save $60,000 for house down payment in 5 years",
        "Build emergency fund of $15,000",
        "Pay off student loans within 3 years"
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
async def test_suggest_goals_success(sample_goal_questionnaire, mock_llm_goals_response):
    with patch('server.routes.suggestions.get_llm_response', new_callable=AsyncMock) as mock_get_llm:
        mock_get_llm.return_value = mock_llm_goals_response
        
        response = client.post("/suggest-goals/", json=sample_goal_questionnaire)
        
        assert response.status_code == 200
        goals = response.json()
        assert isinstance(goals, list)
        assert len(goals) == 3
        assert "house down payment" in goals[0].lower()
        assert "emergency fund" in goals[1].lower()
        assert "student loans" in goals[2].lower()

@pytest.mark.asyncio
async def test_suggest_goals_invalid_llm_response():
    with patch('server.routes.suggestions.get_llm_response', new_callable=AsyncMock) as mock_get_llm:
        mock_get_llm.return_value = "Invalid JSON response"
        
        response = client.post("/suggest-goals/", json=sample_goal_questionnaire())
        
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
    
    response = client.post("/suggest-goals/", json=invalid_questionnaire)
    assert response.status_code == 422  # Validation error
