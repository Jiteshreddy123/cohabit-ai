"""Traits ORM model — maps to the 'traits' table."""

from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class Traits(Base):
    __tablename__ = "traits"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(
        Integer,
        ForeignKey("student.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,  # One trait profile per student
    )
    sleep_time = Column(String(100))
    wake_time = Column(String(100))
    study_style = Column(String(255))
    noise_tolerance = Column(Float, nullable=False)
    cleanliness = Column(Float, nullable=False)
    social_level = Column(Float, nullable=False)
    flexible_preferences = Column(Text)
    non_negotiable_preferences = Column(Text)
    personality_summary = Column(Text)

    # ── Relationships ─────────────────────────────────────────
    student = relationship("Student", back_populates="traits")
