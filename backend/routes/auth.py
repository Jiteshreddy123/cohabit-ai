from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from schemas.college import CollegeCreate, CollegeResponse, LoginRequest, TokenResponse
from services.auth_service import authenticate_college, create_access_token, hash_password, verify_token
import crud.college as crud_college
from utils.exceptions import AuthenticationError, DuplicateError

router = APIRouter(tags=["Authentication"])
security = HTTPBearer()

def get_current_college(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> CollegeResponse:
    payload = verify_token(credentials.credentials)
    email = payload.get("sub")
    if not email:
        raise AuthenticationError("Invalid authentication token")
    college = crud_college.get_college_by_email(db, email=email)
    if not college:
        raise AuthenticationError("College not found")
    return college

@router.post("/register", response_model=CollegeResponse, status_code=status.HTTP_201_CREATED, summary="Register a new College")
def register(college_in: CollegeCreate, db: Session = Depends(get_db)):
    """
    Registers a new College account.
    """
    existing = crud_college.get_college_by_email(db, email=college_in.email)
    if existing:
        raise DuplicateError("A college with this email is already registered")
    
    hashed_pwd = hash_password(college_in.password)
    return crud_college.create_college(db, college_in, hashed_pwd)

@router.post("/login", response_model=TokenResponse, summary="Log in as a College")
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticates a College using email and password, returning a JWT token.
    """
    college = authenticate_college(db, email=login_data.email, password=login_data.password)
    token = create_access_token(data={"sub": college.email})
    return {"access_token": token, "token_type": "bearer"}
