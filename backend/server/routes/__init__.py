from .expenses import router as expenses_router
from .goals import router as goals_router
from .tracking import router as tracking_router
from .users import router as users_router
from .budgets import router as budgets_router
from .suggestions import router as suggestions_router

__all__ = [
    "expenses_router",
    "goals_router",
    "suggestions_router",
    "budgets_router",
    "users_router",
    "tracking_router",
]
