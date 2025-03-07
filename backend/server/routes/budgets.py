from fastapi import APIRouter, HTTPException, Depends
import os
from .users import get_current_user  # Assuming you have a way to get the current user
from typing import Optional, Literal
from pydantic import BaseModel
from utils.supabase_client import supabase_client
from server.schemas import Budget
router = APIRouter()


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

    budget.user_id = current_user.id  

    response = supabase_client.table("budgets").insert(budget.dict(exclude={"id"})).execute()

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
    
    data = supabase_client.table("budgets").select("*").eq("user_id", current_user.id).execute()
    
    return data.data

@router.delete("/api/budgets/delete/{budget_id}")
async def delete_budget(budget_id: str, current_user: dict = Depends(get_current_user)):
    """
    Delete a budget by its ID.

    Args:
        budget_id (str): The ID of the budget to delete.
        current_user (User): The current authenticated user.

    Returns:
        dict: A message indicating successful deletion.
    """
    budget_data = supabase_client.table("budgets").select("*").eq("id", budget_id).execute()

    if not budget_data.data:
        raise HTTPException(status_code=404, detail="Budget not found")

    user_data = supabase_client.table("budgets").select("*").eq("id", budget_id).eq("user_id", current_user.id).execute().data[0] if supabase_client.table("budgets").select("*").eq("id", budget_id).eq("user_id", current_user.id).execute().data else None
    if not user_data:
        raise HTTPException(status_code=404, detail="User not authorized to delete this budget")

    delete_response = supabase_client.table("budgets").delete().eq("id", budget_id).execute()
    
    # Check if the delete was successful
    if not delete_response.data:
        raise HTTPException(status_code=delete_response.status_code, detail="Failed to delete the budget")

    budget_name = delete_response.data[0]["name"]
    return {"message": f"Budget '{budget_name}' deleted successfully"}
