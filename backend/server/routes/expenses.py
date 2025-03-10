from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from ..supabase_client import supabase_client
from .users import get_current_user


router = APIRouter()

class Expense(BaseModel):
    id: Optional[str] = None
    amount: float
    category: str
    date: datetime
    user_id: Optional[str] = None
    business: Optional[str] = None

@router.get("/api/expenses/view", response_model=List[Expense])
async def get_expenses(current_user = Depends(get_current_user)):
    """
    Fetch expenses for the authenticated user.
    """
    result = (
        supabase_client
        .table("expenses")
        .select("*")
        .filter("user_id", "eq", current_user.id)
        .execute()
    )
    if not result.data:
        # You can return an empty list instead of raising 404 if you prefer:
        # return []
        raise HTTPException(status_code=404, detail="Expenses not found")
    return [Expense(**expense) for expense in result.data]

@router.post("/api/expenses/create", response_model=Expense)
async def create_expense(expense: Expense, current_user = Depends(get_current_user)):
    """
    Create a new expense record for the authenticated user.
    """
    # Attach the user ID to the expense
    expense.user_id = current_user.id

    # Convert the Pydantic model to a dict
    expense_data = expense.model_dump()
    expense_data.pop("id", None)  # Remove ID before inserting to avoid conflicts

    # Ensure date is in ISO format
    expense_data["date"] = expense.date.isoformat()

    # Insert into Supabase
    result = supabase_client.table("expenses").insert(expense_data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create expense")

    # Return the newly created record
    return result.data[0]

@router.put("/api/expenses/update/{expense_id}", response_model=Expense)
async def update_expense(expense_id: str, expense: Expense, current_user = Depends(get_current_user)):
    """
    Update an existing expense record. 
    (Optionally, filter by user_id to ensure users can only update their own expenses.)
    """
    # Convert to dict
    update_data = expense.model_dump()

    # Example (RECOMMENDED): Only update if user_id matches the current user
    result = (
        supabase_client
        .table("expenses")
        .update(update_data)
        .eq("id", expense_id)
        .eq("user_id", current_user.id)  # ensures user can update only their own expense
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to update expense")
    return result.data[0]

@router.delete("/api/expenses/delete/{expense_id}")
async def delete_expense(expense_id: str, current_user = Depends(get_current_user)):
    """
    Delete an expense record belonging to the authenticated user.
    """
    result = (
        supabase_client
        .table("expenses")
        .delete()
        .eq("id", expense_id)
        .eq("user_id", current_user.id)  # ensures user can delete only their own expense
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to delete expense")
    return {"message": "Expense deleted"}