from pydantic import BaseModel, Field, field_validator
from typing import Optional
import re

class AllocationSessionBase(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    academic_year: str = Field(..., description="Academic year format e.g. 2024-2025")
    room_capacity: int = Field(..., gt=0, description="Room capacity must be greater than 0")

    @field_validator("academic_year")
    @classmethod
    def validate_academic_year(cls, v: str) -> str:
        # Match formats like 2024-2025 or 2024-25 or 2024
        pattern = r"^\d{4}(-\d{2,4})?$"
        if not re.match(pattern, v):
            raise ValueError("Academic year must be in format YYYY or YYYY-YY or YYYY-YYYY")
        return v

class AllocationSessionCreate(AllocationSessionBase):
    college_id: int

class AllocationSessionResponse(AllocationSessionBase):
    id: int
    college_id: int
    session_status: str

    class Config:
        from_attributes = True
