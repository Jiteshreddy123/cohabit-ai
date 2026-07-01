from routes.health import router as health_router
from routes.auth import router as auth_router, get_current_college
from routes.allocation_sessions import router as session_router
from routes.students import router as student_router

__all__ = [
    "health_router",
    "auth_router",
    "session_router",
    "student_router",
    "get_current_college",
]
