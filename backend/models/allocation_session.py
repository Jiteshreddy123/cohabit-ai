"""AllocationSession ORM model — maps to the 'allocation_sessions' table."""

from sqlalchemy import Column, Integer, String, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship

from database import Base


class AllocationSession(Base):
    __tablename__ = "allocation_sessions"

    id = Column(Integer, primary_key=True, index=True)
    college_id = Column(Integer, ForeignKey("college.id"), nullable=False)
    title = Column(String(255))
    academic_year = Column(String(50), nullable=False)
    room_capacity = Column(Integer, nullable=False)
    session_status = Column(String(20), nullable=False, server_default="Draft")

    # ── Check Constraints ─────────────────────────────────────
    __table_args__ = (
        CheckConstraint(
            "session_status IN ('Draft', 'Active', 'Completed')",
            name="check_session_status",
        ),
    )

    # ── Relationships ─────────────────────────────────────────
    college = relationship("College", back_populates="allocation_sessions")
    students = relationship(
        "Student", back_populates="allocation_session", lazy="select"
    )
    recommendations = relationship(
        "Recommendation", back_populates="allocation_session", lazy="select"
    )
