from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
import pydantic_core
from postgrest.exceptions import APIError
from datetime import datetime
from utils.supabase_client import supabase_client
from .users import get_current_user
from uuid import UUID

import os
from supabase import create_client as open_sb, PostgrestAPIResponse as APIResponse

import json

import utils.auth as bb_auth

router = APIRouter()



class Expense(BaseModel):
    id: UUID
    amount: float
    category: str
    business_name: str
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

@router.get("/api/expenses/", response_model=List[Expense])
async def get_expenses(current_user: dict = Depends(get_current_user)):
    result = supabase_client.table("expenses").select("*").eq("user_id", current_user.id).execute()

    return result.data

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
@router.delete("/expenses/{expense_id}")
async def delete_expense(expense_id: int):
    # TODO: Implement database connection
    return {"message": "Expense deleted"} 

@router.post("/api/expenses/create", response_model=bool)
async def create_expense(body: dict):
    """
    Add a new expense to the database of expenses. Returns a boolean indicating whether or not the action
    succeeded.

    Example request body:

        {
            "session_id": 12345678,
            "new_expense": {
                "id": 4321,
                "category": "food",
                "description": "description of an example expense",
                "amount": 4.99,
                "date": 1740716128876,
                "user_id": 123
            }
        }

    Note: This method requires a session id. If the session id is invalid, or the expense which is to
    be added has a user id not matching the provided session id, the command will fail.
    """
    session_id: int = body["session_id"]
    new_expense: str = json.dumps(body["new_expense"])
    try:
        new_expense = Expense.model_validate_json(new_expense)
    except pydantic_core._pydantic_core.ValidationError as err:
        raise HTTPException(status_code=400, detail=err.errors())
    if new_expense.user_id != bb_auth.get_user_from_session(session_id):
        raise HTTPException(status_code=403, detail="Invalid session ID")
    supabase = open_sb(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    try:
        result = (
            supabase.table("expenses").insert(json.loads(new_expense.json())).execute()
        )
        return len(result.data) > 0
    except APIError as err:
        return False


@router.post("/api/expenses/view", response_model=List[Expense])
async def get_expenses(body: dict):
    """
    Retrive the expenses in the database for the current user.

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
        result = supabase.table("expenses").select("*").eq("user_id", user_id).execute()
        return [Expense.model_validate_json(json.dumps(obj)) for obj in result.data]
    except APIError as err:
        return []


@router.post("/api/expenses/delete", response_model=bool)
async def delete_expense(body: dict):
    """
    Deletes the selected expense from the database. Returns a boolean indicating whether or not the
    action succeeded.

    Example request body:

        {
            "session_id": 12345678,
            "expense_id": 4321
        }

    Note: This method requires a session id. If the session id is invalid or does not, the command will fail.
    """
    session_id: int = body["session_id"]
    expense_id: int = body["expense_id"]
    user_id = bb_auth.get_user_from_session(session_id)
    if user_id == -1:
        raise HTTPException(status_code=403, detail="Invalid session ID")
    supabase = open_sb(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    result = (
        supabase.table("expenses")
        .delete()
        .eq("user_id", user_id)
        .eq("id", expense_id)
        .execute()
    )
    return len(result.data) > 0
