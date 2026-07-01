from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Literal

class StudentBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    roll_number: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    branch: str = Field(..., min_length=1, max_length=100)
    year_of_study: int = Field(..., ge=1, le=5)
    gender: Literal["Male", "Female", "Other"]

class StudentCreate(StudentBase):
    college_id: int
    allocation_session_id: int

class StudentResponse(StudentBase):
    id: int
    college_id: int
    allocation_session_id: int

    class Config:
        from_attributes = True
