from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from schemas.college import CollegeCreate, CollegeResponse, LoginRequest, TokenResponse
from schemas.student import StudentLoginRequest, StudentResponse
from services.auth_service import authenticate_college, authenticate_student, create_access_token, hash_password, verify_token
import crud.college as crud_college
import crud.student as crud_student
from utils.exceptions import AuthenticationError, DuplicateError

router = APIRouter(tags=["Authentication"])
security = HTTPBearer()

def get_current_college(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> CollegeResponse:
    payload = verify_token(credentials.credentials)
    if payload.get("role") != "admin":
        raise AuthenticationError("Admin privileges required")
    email = payload.get("sub")
    if not email:
        raise AuthenticationError("Invalid authentication token")
    college = crud_college.get_college_by_email(db, email=email)
    if not college:
        raise AuthenticationError("College not found")
    return college

def get_current_student(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> StudentResponse:
    payload = verify_token(credentials.credentials)
    if payload.get("role") != "student":
        raise AuthenticationError("Student privileges required")
    student_id = payload.get("sub")
    if not student_id:
        raise AuthenticationError("Invalid authentication token")
    student = crud_student.get_student_by_id(db, student_id=int(student_id))
    if not student:
        raise AuthenticationError("Student not found")
    return student

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
    token = create_access_token(data={"sub": college.email, "role": "admin"})
    return {"access_token": token, "token_type": "bearer", "college_code": college.college_code}

@router.post("/student/login", response_model=TokenResponse, summary="Log in as a Student")
def student_login(login_data: StudentLoginRequest, db: Session = Depends(get_db)):
    """
    Authenticates a Student returning a JWT token.
    """
    student = authenticate_student(db, college_code=login_data.college_code, email=login_data.email, password=login_data.password)
    token = create_access_token(data={"sub": str(student.id), "role": "student"})
    return {"access_token": token, "token_type": "bearer", "student_id": student.id}
