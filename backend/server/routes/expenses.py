from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
import pydantic_core
from postgrest.exceptions import APIError
from datetime import datetime
from ..supabase_client import supabase_client
import os
from ..routes.users import get_current_user
from supabase import create_client as open_sb, PostgrestAPIResponse as APIResponse

import json

import utils.auth as bb_auth

router = APIRouter()


class Expense(BaseModel):
    id: int
    amount: float
    category: str
    business_name: str
    date: datetime
    user_id: int


@router.get("/api/expenses/", response_model=List[Expense])
async def get_expenses(current_user: dict = Depends(get_current_user)):
    result = supabase_client.table("expenses").select("*").eq("user_id", current_user.id).execute()

    return result.data

@router.get("/expenses/{expense_id}", response_model=Expense)
async def get_expense(expense_id: int):
    # TODO: Implement database connection
    raise HTTPException(status_code=404, detail="Expense not found")

@router.post("/expenses/", response_model=Expense)
async def create_expense(expense: Expense):
    # TODO: Implement database connection
    return expense

@router.put("/expenses/{expense_id}", response_model=Expense)
async def update_expense(expense_id: int, expense: Expense):
    # TODO: Implement database connection
    return expense

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