from sqlalchemy.orm import Session
from schemas.allocation_session import AllocationSessionCreate
from models.allocation_session import AllocationSession
import crud.allocation_session as crud_session
import crud.college as crud_college
from utils.exceptions import NotFoundError, ValidationError

def create_allocation_session(db: Session, session: AllocationSessionCreate) -> AllocationSession:
    # Validate college exists
    college = crud_college.get_college_by_id(db, college_id=session.college_id)
    if not college:
        raise NotFoundError(f"College with ID {session.college_id} does not exist")
    
    # Validation constraints
    if session.room_capacity <= 0:
        raise ValidationError("Room capacity must be a positive integer")
    
    return crud_session.create_session(db, session)

def get_allocation_sessions(db: Session, college_id: int | None = None) -> list[AllocationSession]:
    return crud_session.get_sessions(db, college_id=college_id)

def get_allocation_session_by_id(db: Session, session_id: int) -> AllocationSession:
    session = crud_session.get_session_by_id(db, session_id=session_id)
    if not session:
        raise NotFoundError(f"Allocation session with ID {session_id} not found")
    return session
