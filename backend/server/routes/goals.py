from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
import pydantic_core
from postgrest.exceptions import APIError
from datetime import datetime
from supabase import create_client as open_sb, PostgrestAPIResponse as APIResponse

import os
import json

import utils.auth as bb_auth

router = APIRouter()


class Goal(BaseModel):
    id: int
    target_amount: float
    current_amount: float
    title: str
    description: str
    deadline: datetime
    user_id: int


@router.post("/api/goals/create", response_model=bool)
async def create_goal(body: dict):
    """
    Add a new goal to the database of goals. Returns a boolean indicating whether or not the action
    succeeded.

    Example request body:

        {
            "session_id": 12345678,
            "new_goal": {
                "id": 4321,
                "title": "Example Goal",
                "description": "description of an example goal",
                "target_amount": 2500,
                "current_amount": 1000,
                "deadline": 1740716128876,
                "user_id": 123
            }
        }

    Note: This method requires a session id. If the session id is invalid, or the goal which is to
    be added has a user id not matching the provided session id, the command will fail.
    """
    session_id: int = body["session_id"]
    new_goal: str = json.dumps(body["new_goal"])
    try:
        new_goal = Goal.model_validate_json(new_goal)
    except pydantic_core._pydantic_core.ValidationError as err:
        raise HTTPException(status_code=400, detail=err.errors())
    if new_goal.user_id != bb_auth.get_user_from_session(session_id):
        raise HTTPException(status_code=403, detail="Invalid session ID")
    supabase = open_sb(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    try:
        result = supabase.table("goals").insert(json.loads(new_goal.json())).execute()
        return len(result.data) > 0
    except APIError as err:
        return False


@router.post("/api/goals/view", response_model=List[Goal])
async def get_goals(body: dict):
    """
    Retrive the goals in the database for the current user.

    Example request body:

        {
            "session_id": 12345678
        }

    Note: This method requires a session id. If the session id is invalid, the command will fail.
    """
    session_id: int = body["session_id"]
    user_id = bb_auth.get_user_from_session(session_id)
    if user_id == -1:
        raise HTTPException(status_code=403, detail="Invalid session ID")
    supabase = open_sb(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    try:
        result = supabase.table("goals").select("*").eq("user_id", user_id).execute()
        return [Goal.model_validate_json(json.dumps(obj)) for obj in result.data]
    except APIError as err:
        return []


@router.post("/api/goals/delete", response_model=bool)
async def delete_goal(body: dict):
    """
    Deletes the selected goal from the database. Returns a boolean indicating whether or not the
    action succeeded.

    Example request body:

        {
            "session_id": 12345678,
            "goal_id": 4321
        }

    Note: This method requires a session id. If the session id is invalid or does not, the command will fail.
    """
    session_id: int = body["session_id"]
    goal_id: int = body["goal_id"]
    user_id = bb_auth.get_user_from_session(session_id)
    if user_id == -1:
        raise HTTPException(status_code=403, detail="Invalid session ID")
    supabase = open_sb(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    result = (
        supabase.table("goals")
        .delete()
        .eq("user_id", user_id)
        .eq("id", goal_id)
        .execute()
    )
    return len(result.data) > 0
