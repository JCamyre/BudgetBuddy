from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Literal

router = APIRouter()

# Temp until Aryan's PR is merged
class Budget(BaseModel):
    """Model representing a user."""

    id: Optional[str] = None
    name: str
    spending_limit: float
    duration: Literal['weekly', 'monthly', 'yearly']
    user_id: Optional[str] = None

class BudgetQuestionnaire(BaseModel):
    monthly_income: float
    fixed_expenses: float
    location: str  # City or region
    household_size: int

class GoalQuestionnaire(BaseModel):
    current_savings: float
    monthly_income: float
    risk_tolerance: Literal['low', 'medium', 'high']
    primary_goal: Literal['emergency_fund', 'retirement', 'house_down_payment', 'debt_payoff']
    target_timeline_months: int

@router.post("/suggest-budget", response_model=Budget)
async def suggest_budget(questionnaire: BudgetQuestionnaire):
    """Suggest a budget based on user's financial situation."""
    try:
        # Calculate disposable income
        disposable_income = questionnaire.monthly_income - questionnaire.fixed_expenses
        
        # Simple budget suggestion logic
        # Recommend saving 20% of disposable income
        recommended_spending = disposable_income * 0.8
        
        # Create budget suggestion
        budget = Budget(
            name="Suggested Monthly Budget",
            spending_limit=recommended_spending,
            duration="monthly",
            user_id=None  # This can be set later if needed
        )
        
        return budget
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/suggest-goals", response_model=List[str])
async def suggest_goals(questionnaire: GoalQuestionnaire):
    """Suggest financial goals based on user's situation."""
    suggestions = []
    
    # Emergency fund goal
    if questionnaire.primary_goal == "emergency_fund":
        monthly_expenses = questionnaire.monthly_income * 0.7  # Estimated expenses
        target_emergency_fund = monthly_expenses * 6  # 6 months of expenses
        suggestions.append(f"Build emergency fund of ${target_emergency_fund:,.2f}")
    
    # Retirement goal
    elif questionnaire.primary_goal == "retirement":
        yearly_contribution = questionnaire.monthly_income * 0.15 * 12
        suggestions.append(f"Aim to contribute ${yearly_contribution:,.2f} annually to retirement")
    
    # House down payment
    elif questionnaire.primary_goal == "house_down_payment":
        # Assume average house price of $300,000 and 20% down payment
        down_payment = 300000 * 0.2
        monthly_saving = down_payment / questionnaire.target_timeline_months
        suggestions.append(f"Save ${monthly_saving:,.2f} monthly for house down payment")
    
    # Debt payoff
    elif questionnaire.primary_goal == "debt_payoff":
        monthly_allocation = questionnaire.monthly_income * 0.25
        suggestions.append(f"Allocate ${monthly_allocation:,.2f} monthly to debt repayment")
    
    return suggestions
