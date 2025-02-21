from fastapi import APIRouter, HTTPException, Depends
from supabase import create_client
import os
from .users import get_current_user  # Assuming you have a way to get the current user
from typing import Optional, Literal
from pydantic import BaseModel

router = APIRouter()

class Budget(BaseModel):
    """Model representing a user."""

    id: Optional[str] = None
    name: str
    spending_limit: float
    duration: Literal['weekly', 'monthly', 'yearly']
    user_id: Optional[str] = None

@router.post("/api/budgets/create", response_model=Budget)
async def create_budget(budget: Budget, current_user: dict = Depends(get_current_user)):
    """
    Create a new budget.

    Args:
        budget (Budget): The budget data to create.
        current_user (User): The current authenticated user.

    Returns:
        Budget: The created budget object.
    """

    supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    print("Current User:", current_user)  
    budget.user_id = current_user.id  

    response = supabase.table("budgets").insert(budget.dict(exclude={"id"})).execute()
    print(response.data)

    if not response.data:
        raise HTTPException(status_code=response.status_code, detail=response.data)

    return response.data[0]

@router.get("/api/budgets/view")
async def view_budgets(current_user: dict = Depends(get_current_user)):
    """
    View all budgets for the current user.

    Args:
        current_user (User): The current authenticated user.

    Returns:
        List[Budget]: The list of budgets for the current user.
    """
    supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    
    data = supabase.table("budgets").select("*").eq("user_id", current_user.id).execute()
    
    return data.data

@router.delete("/api/budgets/delete/{budget_id}")
async def delete_budget(budget_id: str):
    """
    Delete a budget by its ID.

    Args:
        budget_id (str): The ID of the budget to delete.
        current_user (User): The current authenticated user.

    Returns:
        dict: A message indicating successful deletion.
    """
    supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    
    data = supabase.table("budgets").delete().eq("id", budget_id).execute()
    print(data)
    if not data.data:
        raise HTTPException(status_code=400, detail="Budget not found")

    return {"message": "Budget deleted successfully"}
