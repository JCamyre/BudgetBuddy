from .expenses import router as expenses_router
from .goals import router as goals_router
from .suggestions import router as suggestions_router

__all__ = ["expenses_router", "goals_router", "suggestions_router"]
