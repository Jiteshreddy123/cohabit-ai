"""College ORM model — maps to the 'college' table."""

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class College(Base):
    __tablename__ = "college"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)

    # ── Relationships ─────────────────────────────────────────
    allocation_sessions = relationship(
        "AllocationSession", back_populates="college", lazy="select"
    )
    students = relationship(
        "Student", back_populates="college", lazy="select"
    )
