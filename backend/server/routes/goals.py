from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from uuid import uuid4

router = APIRouter()

class Goal(BaseModel):
    id: Optional[str] = None 
    title: str
    target_amount: float
    current_amount: float
    actionable_amount: float
    frequency: str
    deadline: datetime
    user_id: int

@router.get("/goals/", response_model=List[Goal])
async def get_goals():
    # TODO: Implement database connection
    return []

@router.post("/goals/", response_model=Goal)
async def create_goal(goal: Goal):
    goal.id = str(uuid4())  # Generate a unique string ID
    print(f"Created goal: {goal.dict()}") 
    return goal

@router.put("/goals/{goal_id}", response_model=Goal)
async def update_goal(goal_id: str, goal: Goal):
    try:
        print(f"Updating goal {goal_id} with data: {goal}")
        goal.id = goal_id
        return goal
    except Exception as e:
        print(f"Error updating goal: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/goals/{goal_id}")
async def delete_goal(goal_id: str):
    try:
        print(f"Deleting goal {goal_id}")
        return {"message": "Goal deleted"}
    except Exception as e:
        print(f"Error deleting goal: {e}")
        raise HTTPException(status_code=400, detail=str(e))