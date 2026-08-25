from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    user_id: str
    email: str
    role: str
    name: Optional[str] = None

class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None

class RefreshTokenInput(BaseModel):
    refresh_token: str


# Auth Schemas
class SendOtpRequest(BaseModel):
    email: str
    purpose: Optional[str] = "login"  # "login", "register", "google_login", "2fa"
    role: Optional[str] = "candidate"
    full_name: Optional[str] = None

class VerifyOtpRequest(BaseModel):
    email: str
    otp_code: str
    role: Optional[str] = "candidate"
    full_name: Optional[str] = None
    company_name: Optional[str] = None

class GoogleAuthRequest(BaseModel):
    email: str
    role: Optional[str] = "candidate"
    full_name: Optional[str] = None
    google_id: Optional[str] = None
    avatar_url: Optional[str] = None
    credential: Optional[str] = None

class OtpResponse(BaseModel):
    success: bool
    message: str
    email: str
    preview_code: Optional[str] = None  # Returned for instant dev/demo test preview

class UserRegister(BaseModel):
    email: str
    password: str
    role: str  # "candidate" or "recruiter"
    full_name: Optional[str] = None
    company_name: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: str
    email: str
    role: str
    is_active: bool
    created_at: datetime
    profile: Optional[Any] = None

    class Config:
        from_attributes = True
        orm_mode = True

# Candidate Schemas
class CandidateProfileOut(BaseModel):
    id: str
    user_id: str
    full_name: str
    phone: Optional[str] = None
    location: Optional[str] = None
    headline: Optional[str] = None
    profile_completion_pct: int
    created_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True

class CandidateProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    headline: Optional[str] = None

# Recruiter Schemas
class RecruiterProfileOut(BaseModel):
    id: str
    user_id: str
    company_name: str
    company_website: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True

class RecruiterProfileUpdate(BaseModel):
    company_name: Optional[str] = None
    company_website: Optional[str] = None

# Skill Schemas
class SkillOut(BaseModel):
    id: str
    name: str
    category: str

    class Config:
        from_attributes = True
        orm_mode = True

# Resume & AI Analysis Schemas
class AIAnalysisOut(BaseModel):
    id: str
    overall_score: int
    ats_score: int
    skills_score: int
    experience_score: int
    projects_score: int
    education_score: int
    formatting_score: int
    suggestions: Optional[List[str]] = None
    extracted_education: Optional[List[dict]] = None
    extracted_experience: Optional[List[dict]] = None
    extracted_projects: Optional[List[dict]] = None
    extracted_certifications: Optional[List[dict]] = None

    class Config:
        from_attributes = True
        orm_mode = True

class ResumeOut(BaseModel):
    id: str
    candidate_id: str
    file_name: str
    file_type: str
    status: str
    uploaded_at: datetime
    raw_text: Optional[str] = None
    analysis: Optional[AIAnalysisOut] = None

    class Config:
        from_attributes = True
        orm_mode = True

# Job Schemas
class JobCreate(BaseModel):
    title: str
    location: Optional[str] = "Remote"
    employment_type: Optional[str] = "Full-time"
    experience_level: Optional[str] = "Mid-Level"
    salary_range: Optional[str] = "$90,000 - $120,000"
    description: str
    required_skills: List[str] = []
    preferred_skills: List[str] = []

class JobOut(BaseModel):
    id: str
    recruiter_id: str
    title: str
    location: str
    employment_type: str
    experience_level: str
    salary_range: Optional[str]
    description: str
    responsibilities: Optional[List[str]]
    status: str
    created_at: datetime
    company_name: Optional[str] = None
    skills: Optional[List[dict]] = None
    applicant_count: Optional[int] = 0

    class Config:
        from_attributes = True
        orm_mode = True

# Match Schemas
class MatchBreakdown(BaseModel):
    overall_score: int
    skills_score: int
    experience_score: int
    projects_score: int
    education_score: int
    certifications_score: int
    matched_skills: List[str]
    missing_skills: List[str]
    ai_explanation: str

class MatchScoreOut(BaseModel):
    job: JobOut
    match_details: MatchBreakdown

# Application Schemas
class ApplicationCreate(BaseModel):
    job_id: str

class ApplicationStatusUpdate(BaseModel):
    status: str  # applied | under_review | shortlisted | interview | offer | rejected

class ApplicationOut(BaseModel):
    id: str
    job_id: str
    candidate_id: str
    status: str
    applied_at: datetime
    job: Optional[JobOut] = None
    candidate_name: Optional[str] = None
    candidate_headline: Optional[str] = None
    match_score: Optional[MatchBreakdown] = None

    class Config:
        from_attributes = True
        orm_mode = True
