from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from supabase import create_client
import os
from ..routes.users import get_current_user

router = APIRouter()

class Expense(BaseModel):
    id: Optional[int] = None
    amount: float
    category: str
    # description: str
    date: datetime
    user_id: int

@router.get("/api/expenses/", response_model=List[Expense])
async def get_expenses(current_user: dict = Depends(get_current_user)):
    supabase = create_client(
        url=os.getenv("SUPABASE_URL"),
        key=os.getenv("SUPABASE_KEY")
    )
    
    result = supabase.table("expenses").select("*").filter("user_id", "eq", current_user.id).execute()

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