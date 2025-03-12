from fastapi import APIRouter, HTTPException, Depends
from typing import List
from pydantic import BaseModel
from datetime import datetime
from supabase import create_client as open_sb
import os
import utils.auth as bb_auth
from ..schemas import GoalCreate, GoalResponse, GoalUpdate
from .users import get_current_user

supabase_client = open_sb(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

router = APIRouter()


@router.post("/api/goals/create", response_model=GoalResponse)
async def create_goal(body: dict, current_user: dict = Depends(get_current_user)):
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
        user_id = current_user.id

        # Validate input data
        goal_data = body["new_goal"]
        goal_data["deadline"] = datetime.fromisoformat(goal_data["deadline"]).isoformat()
        goal_data["user_id"] = user_id

        # Insert into database
        result = supabase_client.table("goals").insert(goal_data).execute()

        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create goal")
            
        return result.data[0]

    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid date format") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get("/api/goals/view")
async def get_goals(current_user: dict = Depends(get_current_user)):
    """
    Get all goals for the authenticated user
    Request body: {"session_id": string}
    """
    try:
        user_id = current_user.id
        result = supabase_client.table("goals").select("*").eq("user_id", user_id).execute()
        
        return [GoalResponse(**goal) for goal in result.data]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.delete("/api/goals/delete/{goal_id}")
async def delete_goal(goal_id: str, current_user: dict = Depends(get_current_user)):
    """
    Delete a specific goal
    Request body: {
        "session_id": string,
        "goal_id": int
    }
    """
    try:
        goal_data = supabase_client.table("goals").select("*").eq("id", goal_id).execute()

        if not goal_data.data:
            raise HTTPException(status_code=404, detail="Goal not found")

        user_data = (
            supabase_client.table("goals")
            .select("*")
            .eq("id", goal_id)
            .eq("user_id", current_user.id)
            .execute()
            .data[0]
            if supabase_client.table("goals").select("*").eq("id", goal_id).eq("user_id", current_user.id).execute().data
            else None
        )

        if not user_data:
            raise HTTPException(status_code=404, detail="User not authorized to delete this goal")

        delete_response = supabase_client.table("goals").delete().eq("id", goal_id).execute()

        # Check if the delete was successful
        if not delete_response.data:
            raise HTTPException(status_code=delete_response.status_code, detail="Failed to delete the goal")

        goal_name = delete_response.data[0]["title"]
        return {"message": f"Goal '{goal_name}' deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.put("/api/goals/update/{goal_id}")
async def update_goal(
    goal_id: str, 
    updated_goal: GoalUpdate,
    current_user: dict = Depends(get_current_user)
):
    try:
        # 1. Check if the goal exists
        existing = supabase_client.table("goals").select("*").eq("id", goal_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Goal not found")

        # 2. Check if the current user is authorized to update this goal
        user_data = supabase_client.table("goals").select("*").eq("id", goal_id).eq("user_id", current_user.id).execute().data
        if not user_data:
            raise HTTPException(status_code=403, detail="User not authorized to update this goal")

        # 3. Convert deadline to ISO format
        iso_deadline = datetime.fromisoformat(updated_goal.deadline).isoformat()

        update_data = {
            "title": updated_goal.title,
            "target_amount": updated_goal.target_amount,
            "current_amount": updated_goal.current_amount,
            "actionable_amount": updated_goal.actionable_amount,
            "frequency": updated_goal.frequency,
            "deadline": iso_deadline
        }

        response = supabase_client.table("goals").update(update_data).eq("id", goal_id).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to update goal")

        return response.data[0]

    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid date format") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
