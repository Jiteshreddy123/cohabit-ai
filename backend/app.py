from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from routes import health_router, auth_router, session_router, student_router
from utils.exceptions import AppError

# ── App Initialization ────────────────────────────────────────
app = FastAPI(
    title="CoHabit-AI API",
    description="Backend API for CoHabit-AI student roommate allocation system.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS Middleware ───────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local development and testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Centralized Exception Handlers ────────────────────────────
@app.exception_handler(AppError)
def app_error_handler(request: Request, exc: AppError):
    """Handler for custom application-specific exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )

@app.exception_handler(RequestValidationError)
def validation_error_handler(request: Request, exc: RequestValidationError):
    """Handler for standard FastAPI request schema validation errors."""
    errors = []
    for err in exc.errors():
        loc = " -> ".join(str(x) for x in err.get("loc", []))
        msg = err.get("msg", "Validation error")
        errors.append(f"{loc}: {msg}")
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "; ".join(errors)}
    )

@app.exception_handler(Exception)
def general_exception_handler(request: Request, exc: Exception):
    """Catch-all handler for unhandled internal exceptions to prevent leaking stack traces."""
    # Log the actual exception locally for debugging
    print(f"Unhandled Exception: {str(exc)}")
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please contact support."}
    )

# ── Include Routers ───────────────────────────────────────────
# Mounted without prefixes to match requested Day 2 endpoints exactly:
# GET /health, POST /login, GET /allocation-sessions, etc.
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(session_router)
app.include_router(student_router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Cohabit-AI API",
        "docs": "/docs"
    }