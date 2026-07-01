from pydantic import BaseModel, EmailStr, Field

class CollegeBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr

class CollegeCreate(CollegeBase):
    password: str = Field(..., min_length=6)

class CollegeResponse(CollegeBase):
    id: int

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
