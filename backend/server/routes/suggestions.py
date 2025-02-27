from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Literal
import httpx
import json
from dotenv import load_dotenv
import os
import together
from ..schemas import Budget, BudgetQuestionnaire, GoalQuestionnaire
load_dotenv()

router = APIRouter()

together_client = together.Client()

# Temp until Aryan's PR is merged

async def get_llm_response(messages):
    """Get response from DeepSeek model via Together."""
    response = together_client.chat.completions.create(
        model="deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
        messages=messages
    )
    return response.choices[0].message.content

@router.post("/suggest-budget/", response_model=Budget)
async def suggest_budget(questionnaire: BudgetQuestionnaire):
    """Suggest a budget based on user's financial situation using LLM."""
    try:
        messages = [
            {
                "role": "system",
                "content": """You are a knowledgeable financial advisor. Analyze the user's financial situation 
                and suggest a monthly budget. 
                OUTPUT INSTRUCTIONS, FOLLOW THEM EXACTLY. DO NOT VEER OFF FROM FORMAT. DO NOT INCLUDE ANY OTHER TEXT OR EXPLANATIONS:
                Your response must be a valid JSON string in this exact format:
                {"spending_limit": 1234.56, "duration": "monthly", "budget_name": "Basic Budget"}
                """
            },
            {
                "role": "user",
                "content": f"""
                Financial Situation: {questionnaire.financial_situation}
                Spending Habits: {questionnaire.spending_habits}
                Financial Goals: {questionnaire.financial_goals}
                Lifestyle Preferences: {questionnaire.lifestyle_preferences}
                Financial Concerns: {questionnaire.financial_concerns}
                """
            }
        ]
        
        llm_response = await get_llm_response(messages)
        
        # Strip any potential whitespace or extra characters
        llm_response = llm_response.strip()
        
        llm_response = llm_response.split("</think>")[1]
        
        # Add error handling for JSON parsing
        try:
            budget_suggestion = json.loads(llm_response)
        except json.JSONDecodeError as json_error:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse LLM response as JSON. Response: {llm_response}"
            )
        
        # Validate required fields
        required_fields = ["budget_name", "spending_limit", "duration"]
        missing_fields = [field for field in required_fields if field not in budget_suggestion]
        if missing_fields:
            raise HTTPException(
                status_code=500,
                detail=f"LLM response missing required fields: {missing_fields}"
            )
        
        return Budget(
            name=budget_suggestion["budget_name"],
            spending_limit=budget_suggestion["spending_limit"],
            duration=budget_suggestion["duration"],
            user_id=None # TODO: Add user_id
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/suggest-goals/", response_model=List[str])
async def suggest_goals(questionnaire: GoalQuestionnaire):
    """Suggest financial goals based on user's situation using LLM."""
    try:
        messages = [
            {
                "role": "system",
                "content": """You are a knowledgeable financial advisor. Analyze the user's financial situation 
                and suggest 2-4 specific, actionable financial goals. Return them as a JSON array of strings.
                OUTPUT INSTRUCTIONS, FOLLOW THEM EXACTLY. DO NOT VEER OFF FROM FORMAT. DO NOT INCLUDE ANY OTHER TEXT OR EXPLANATIONS:
                Your response must be a valid JSON string in this exact format:
                DO NOT INCLUDE ANY OTHER TEXT OR EXPLANATIONS:
                ["Goal 1", "Goal 2", "Goal 3"]
                """
            },
            {
                "role": "user",
                "content": f"""
                Current Situation: {questionnaire.current_situation}
                Future Aspirations: {questionnaire.future_aspirations}
                Risk Comfort: {questionnaire.risk_comfort}
                Timeline: {questionnaire.timeline_description}
                Constraints: {questionnaire.constraints}
                """
            }
        ]
        
        
        
        llm_response = await get_llm_response(messages)
        
        llm_response = llm_response.split("</think>")[1]
        
        # Add error handling for JSON parsing
        try:
            budget_suggestion = json.loads(llm_response)
        except json.JSONDecodeError as json_error:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse LLM response as JSON. Response: {llm_response}"
            )
            
        return budget_suggestion
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
