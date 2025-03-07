from pydantic import BaseModel, EmailStr
from typing import Optional, Literal
from datetime import datetime
class Budget(BaseModel):
    """Model representing a budget."""

    id: Optional[str] = None
    name: str
    spending_limit: float
    duration: Literal['weekly', 'monthly', 'yearly']
    user_id: Optional[str] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    """Model representing a user."""

    id: Optional[str] = None
    email: EmailStr
    full_name: str
    created_at: Optional[datetime] = None

class BudgetQuestionnaire(BaseModel):
    financial_situation: str  # Open-ended description of current financial situation
    spending_habits: str  # Description of typical spending patterns
    financial_goals: str  # Short and long term financial objectives
    lifestyle_preferences: str  # Description of lifestyle and priorities
    financial_concerns: str  # Any specific financial worries or challenges

class GoalQuestionnaire(BaseModel):
    current_situation: str  # Description of current financial position
    future_aspirations: str  # Long-term life and financial aspirations
    risk_comfort: str  # Description of comfort level with financial risk
    timeline_description: str  # When they want to achieve their goals
    constraints: str  # Any limitations or obligations affecting their goals
