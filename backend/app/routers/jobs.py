from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.models import User, RecruiterProfile, Job, JobSkill, Skill, Application
from app.schemas.schemas import JobCreate, JobOut
from app.core.deps import get_current_user, require_role
from ai.extraction.info_extractor import extract_structured_job
from ai.embeddings.embedder import generate_embedding

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.post("", response_model=JobOut)
def create_job(
    job_in: JobCreate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    recruiter = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == current_user.id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter profile not found")

    # Extract responsibilities and skills via AI helper
    ai_extracted = extract_structured_job(job_in.description)
    req_skills = job_in.required_skills or ai_extracted["required_skills"]
    pref_skills = job_in.preferred_skills or ai_extracted["preferred_skills"]

    embedding_vector = generate_embedding(f"{job_in.title} {job_in.description}")

    job = Job(
        recruiter_id=recruiter.id,
        title=job_in.title,
        location=job_in.location or "Remote",
        employment_type=job_in.employment_type or "Full-time",
        experience_level=job_in.experience_level or "Mid-Level",
        salary_range=job_in.salary_range or "$90,000 - $120,000",
        description=job_in.description,
        responsibilities=ai_extracted["responsibilities"],
        embedding=embedding_vector,
        status="active"
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    # Attach required skills
    for s_name in req_skills:
        sk = db.query(Skill).filter(Skill.name == s_name).first()
        if not sk:
            sk = Skill(name=s_name, category="Technical")
            db.add(sk)
            db.commit()
            db.refresh(sk)

        js = JobSkill(job_id=job.id, skill_id=sk.id, requirement_type="required")
        db.add(js)

    # Attach preferred skills
    for s_name in pref_skills:
        sk = db.query(Skill).filter(Skill.name == s_name).first()
        if not sk:
            sk = Skill(name=s_name, category="Technical")
            db.add(sk)
            db.commit()
            db.refresh(sk)

        js = JobSkill(job_id=job.id, skill_id=sk.id, requirement_type="preferred")
        db.add(js)

    db.commit()

    return {
        "id": job.id,
        "recruiter_id": job.recruiter_id,
        "title": job.title,
        "location": job.location,
        "employment_type": job.employment_type,
        "experience_level": job.experience_level,
        "salary_range": job.salary_range,
        "description": job.description,
        "responsibilities": job.responsibilities,
        "status": job.status,
        "created_at": job.created_at,
        "company_name": recruiter.company_name,
        "applicant_count": 0
    }

@router.get("", response_model=List[JobOut])
def list_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).filter(Job.status == "active").all()
    results = []
    for job in jobs:
        comp_name = job.recruiter.company_name if job.recruiter else "HireSense AI Partner"
        app_count = db.query(Application).filter(Application.job_id == job.id).count()
        results.append({
            "id": job.id,
            "recruiter_id": job.recruiter_id,
            "title": job.title,
            "location": job.location,
            "employment_type": job.employment_type,
            "experience_level": job.experience_level,
            "salary_range": job.salary_range,
            "description": job.description,
            "responsibilities": job.responsibilities,
            "status": job.status,
            "created_at": job.created_at,
            "company_name": comp_name,
            "applicant_count": app_count
        })
    return results

@router.get("/recruiter/my-jobs", response_model=List[JobOut])
def get_recruiter_jobs(
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    recruiter = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == current_user.id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter profile not found")

    jobs = db.query(Job).filter(Job.recruiter_id == recruiter.id).order_by(Job.created_at.desc()).all()
    results = []
    for job in jobs:
        app_count = db.query(Application).filter(Application.job_id == job.id).count()
        results.append({
            "id": job.id,
            "recruiter_id": job.recruiter_id,
            "title": job.title,
            "location": job.location,
            "employment_type": job.employment_type,
            "experience_level": job.experience_level,
            "salary_range": job.salary_range,
            "description": job.description,
            "responsibilities": job.responsibilities,
            "status": job.status,
            "created_at": job.created_at,
            "company_name": recruiter.company_name,
            "applicant_count": app_count
        })
    return results

@router.post("/{job_id}/analyze-ai")
def analyze_job_ai(
    job_id: str,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    extracted = extract_structured_job(f"{job.title}\n{job.description}")
    embedding_vector = generate_embedding(f"{job.title} {job.description}")
    job.embedding = embedding_vector
    job.responsibilities = extracted.get("responsibilities", job.responsibilities)
    db.commit()

    return {
        "job_id": job.id,
        "title": job.title,
        "required_skills": extracted.get("required_skills", []),
        "preferred_skills": extracted.get("preferred_skills", []),
        "responsibilities": extracted.get("responsibilities", []),
        "experience_requirements": extracted.get("experience_level", job.experience_level),
        "embedding_generated": True
    }

