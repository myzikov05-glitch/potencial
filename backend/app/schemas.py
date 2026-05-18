from datetime import datetime

from pydantic import BaseModel, Field, field_validator


class LeadCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=5, max_length=200)
    team_name: str = Field(min_length=2, max_length=160)
    team_size: int = Field(ge=1, le=50)
    message: str = Field(default="", max_length=2000)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        if "@" not in value or "." not in value.split("@")[-1]:
            raise ValueError("invalid email")
        return value.strip().lower()


class LeadResponse(BaseModel):
    id: str
    created_at: datetime
    status: str


class LeadRecord(LeadResponse):
    name: str
    email: str
    team_name: str
    team_size: int
    message: str


class AdminUser(BaseModel):
    username: str
    role: str


class LoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=120)
    password: str = Field(min_length=1, max_length=120)


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: AdminUser


class AIStatus(BaseModel):
    enabled: bool
    mode: str
    summary: str
    planned_modules: list[str]


class Roadmap(BaseModel):
    current: list[str]
    next: list[str]


class PlatformOverview(BaseModel):
    product_stage: str
    integrations: list[str]
    ai_status: AIStatus
    roadmap: Roadmap
