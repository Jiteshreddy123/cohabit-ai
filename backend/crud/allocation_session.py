from sqlalchemy.orm import Session
from models.allocation_session import AllocationSession
from schemas.allocation_session import AllocationSessionCreate

def create_session(db: Session, session: AllocationSessionCreate) -> AllocationSession:
    db_session = AllocationSession(
        college_id=session.college_id,
        title=session.title,
        academic_year=session.academic_year,
        room_capacity=session.room_capacity,
        session_status="Draft"
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def get_sessions(db: Session, college_id: int | None = None) -> list[AllocationSession]:
    query = db.query(AllocationSession)
    if college_id is not None:
        query = query.filter(AllocationSession.college_id == college_id)
    return query.all()

def get_session_by_id(db: Session, session_id: int) -> AllocationSession | None:
    return db.query(AllocationSession).filter(AllocationSession.id == session_id).first()
