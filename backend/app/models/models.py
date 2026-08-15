import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Integer, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # "candidate" or "recruiter"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    candidate_profile = relationship("CandidateProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    recruiter_profile = relationship("RecruiterProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, unique=True)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    location = Column(String(255), nullable=True)
    headline = Column(String(255), nullable=True)
    profile_completion_pct = Column(Integer, default=50)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="candidate_profile")
    resumes = relationship("Resume", back_populates="candidate", cascade="all, delete-orphan")
    skills = relationship("CandidateSkill", back_populates="candidate", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="candidate", cascade="all, delete-orphan")


class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, unique=True)
    company_name = Column(String(255), nullable=False)
    company_website = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="recruiter_profile")
    jobs = relationship("Job", back_populates="recruiter", cascade="all, delete-orphan")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    candidate_id = Column(String(36), ForeignKey("candidate_profiles.id"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=True)
    file_type = Column(String(50), default="pdf")
    raw_text = Column(Text, nullable=True)
    status = Column(String(50), default="uploaded")  # uploaded | processing | complete | failed
    embedding = Column(JSON, nullable=True)  # Store vector array as JSON for portability
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    candidate = relationship("CandidateProfile", back_populates="resumes")
    analysis = relationship("AIAnalysis", back_populates="resume", uselist=False, cascade="all, delete-orphan")


class AIAnalysis(Base):
    __tablename__ = "ai_analysis"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    resume_id = Column(String(36), ForeignKey("resumes.id"), nullable=False, unique=True)
    overall_score = Column(Integer, default=0)
    ats_score = Column(Integer, default=0)
    skills_score = Column(Integer, default=0)
    experience_score = Column(Integer, default=0)
    projects_score = Column(Integer, default=0)
    education_score = Column(Integer, default=0)
    formatting_score = Column(Integer, default=0)
    suggestions = Column(JSON, nullable=True)
    extracted_education = Column(JSON, nullable=True)
    extracted_experience = Column(JSON, nullable=True)
    extracted_projects = Column(JSON, nullable=True)
    extracted_certifications = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    resume = relationship("Resume", back_populates="analysis")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), unique=True, nullable=False, index=True)
    category = Column(String(100), default="Technical")


class CandidateSkill(Base):
    __tablename__ = "candidate_skills"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    candidate_id = Column(String(36), ForeignKey("candidate_profiles.id"), nullable=False)
    skill_id = Column(String(36), ForeignKey("skills.id"), nullable=False)
    proficiency = Column(String(50), default="intermediate")  # beginner | intermediate | advanced
    source = Column(String(50), default="resume")  # resume | manual

    candidate = relationship("CandidateProfile", back_populates="skills")
    skill = relationship("Skill")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    recruiter_id = Column(String(36), ForeignKey("recruiter_profiles.id"), nullable=False)
    title = Column(String(255), nullable=False)
    location = Column(String(255), default="Remote")
    employment_type = Column(String(50), default="Full-time")  # Full-time | Part-time | Contract
    experience_level = Column(String(50), default="Mid-Level")  # Entry | Mid-Level | Senior | Lead
    salary_range = Column(String(100), nullable=True)
    description = Column(Text, nullable=False)
    responsibilities = Column(JSON, nullable=True)
    embedding = Column(JSON, nullable=True)
    status = Column(String(50), default="active")  # draft | active | closed
    created_at = Column(DateTime, default=datetime.utcnow)

    recruiter = relationship("RecruiterProfile", back_populates="jobs")
    skills = relationship("JobSkill", back_populates="job", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")


class JobSkill(Base):
    __tablename__ = "job_skills"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    job_id = Column(String(36), ForeignKey("jobs.id"), nullable=False)
    skill_id = Column(String(36), ForeignKey("skills.id"), nullable=False)
    requirement_type = Column(String(50), default="required")  # required | preferred

    job = relationship("Job", back_populates="skills")
    skill = relationship("Skill")


class Application(Base):
    __tablename__ = "applications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    candidate_id = Column(String(36), ForeignKey("candidate_profiles.id"), nullable=False)
    job_id = Column(String(36), ForeignKey("jobs.id"), nullable=False)
    status = Column(String(50), default="applied")  # applied | under_review | shortlisted | interview | offer | rejected
    applied_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    candidate = relationship("CandidateProfile", back_populates="applications")
    job = relationship("Job", back_populates="applications")
    match_score = relationship("MatchScore", back_populates="application", uselist=False, cascade="all, delete-orphan")


class MatchScore(Base):
    __tablename__ = "match_scores"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    application_id = Column(String(36), ForeignKey("applications.id"), nullable=True)
    job_id = Column(String(36), ForeignKey("jobs.id"), nullable=False)
    candidate_id = Column(String(36), ForeignKey("candidate_profiles.id"), nullable=False)
    overall_score = Column(Integer, default=0)
    skills_score = Column(Integer, default=0)
    experience_score = Column(Integer, default=0)
    projects_score = Column(Integer, default=0)
    education_score = Column(Integer, default=0)
    certifications_score = Column(Integer, default=0)
    matched_skills = Column(JSON, nullable=True)
    missing_skills = Column(JSON, nullable=True)
    ai_explanation = Column(Text, nullable=True)
    computed_at = Column(DateTime, default=datetime.utcnow)

    application = relationship("Application", back_populates="match_score")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    type = Column(String(50), default="info")
    message = Column(String(500), nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    application_id = Column(String(36), ForeignKey("applications.id"), nullable=False)
    candidate_id = Column(String(36), ForeignKey("candidate_profiles.id"), nullable=False)
    job_id = Column(String(36), ForeignKey("jobs.id"), nullable=False)
    scheduled_at = Column(DateTime, nullable=False)
    location_or_link = Column(String(255), default="Google Meet")
    notes = Column(Text, nullable=True)
    status = Column(String(50), default="scheduled")  # scheduled | completed | cancelled
    created_at = Column(DateTime, default=datetime.utcnow)

    application = relationship("Application")
    candidate = relationship("CandidateProfile")
    job = relationship("Job")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(100), nullable=True)
    entity_id = Column(String(36), nullable=True)
    details = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

