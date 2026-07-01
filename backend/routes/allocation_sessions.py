from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from schemas.allocation_session import AllocationSessionCreate, AllocationSessionResponse
from schemas.college import CollegeResponse
import services.allocation_session_service as session_service
from routes.auth import get_current_college

router = APIRouter(prefix="/allocation-sessions", tags=["Allocation Sessions"])

@router.post(
    "",
    response_model=AllocationSessionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new Allocation Session",
    description="Creates a new student allocation session under the logged-in college account."
)
def create_session(
    session_in: AllocationSessionCreate,
    db: Session = Depends(get_db),
    current_college: CollegeResponse = Depends(get_current_college)
):
    # Enforce that college_id matches the currently authenticated college for security
    session_in.college_id = current_college.id
    return session_service.create_allocation_session(db, session_in)

@router.get(
    "",
    response_model=list[AllocationSessionResponse],
    summary="Get all Allocation Sessions",
    description="Retrieves a list of all allocation sessions associated with the logged-in college."
)
def get_sessions(
    db: Session = Depends(get_db),
    current_college: CollegeResponse = Depends(get_current_college)
):
    return session_service.get_allocation_sessions(db, college_id=current_college.id)
