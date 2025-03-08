from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from datetime import datetime
from supabase import create_client as open_sb
import os
import utils.auth as bb_auth

router = APIRouter()

class GoalCreate(BaseModel):
    title: str
    target_amount: float
    current_amount: float
    actionable_amount: float
    frequency: str
    deadline: datetime

class GoalResponse(GoalCreate):
    id: int
    user_id: int

@router.post("/api/goals/create", response_model=GoalResponse)
async def create_goal(body: dict):
    """
    Create a new goal for the authenticated user
    Request body: {
        "session_id": string,
        "new_goal": {
            "title": string,
            "target_amount": number,
            "current_amount": number,
            "actionable_amount": number,
            "frequency": string,
            "deadline": ISO8601 string
        }
    }
    """
    try:
        session_id = int(body["session_id"])
        user_id = bb_auth.get_user_from_session(session_id)
        
        if user_id == -1:
            raise HTTPException(status_code=403, detail="Invalid session ID")

        # Validate input data
        goal_data = body["new_goal"]
        goal_data["deadline"] = datetime.fromisoformat(goal_data["deadline"])
        goal_data["user_id"] = user_id

        supabase = open_sb(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
        
        # Insert into database
        result = supabase.table("goals").insert(goal_data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create goal")
            
        return result.data[0]

    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid date format") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.post("/api/goals/view", response_model=List[GoalResponse])
async def get_goals(body: dict):
    """
    Get all goals for the authenticated user
    Request body: {"session_id": string}
    """
    try:
        session_id = int(body["session_id"])
        user_id = bb_auth.get_user_from_session(session_id)
        
        if user_id == -1:
            raise HTTPException(status_code=403, detail="Invalid session ID")

        supabase = open_sb(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
        result = supabase.table("goals").select("*").eq("user_id", user_id).execute()
        
        return [GoalResponse(**goal) for goal in result.data]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.post("/api/goals/delete", response_model=bool)
async def delete_goal(body: dict):
    """
    Delete a specific goal
    Request body: {
        "session_id": string,
        "goal_id": int
    }
    """
    try:
        session_id = int(body["session_id"])
        goal_id = int(body["goal_id"])
        user_id = bb_auth.get_user_from_session(session_id)
        
        if user_id == -1:
            raise HTTPException(status_code=403, detail="Invalid session ID")

        supabase = open_sb(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
        result = supabase.table("goals").delete().eq("id", goal_id).eq("user_id", user_id).execute()
        
        return len(result.data) > 0

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e