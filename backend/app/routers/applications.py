from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.db.session import get_db
from app.models.models import User, CandidateProfile, Job, Application, MatchScore, Resume, JobSkill
from app.schemas.schemas import ApplicationCreate, ApplicationStatusUpdate, ApplicationOut
from app.core.deps import get_current_user, require_role
from ai.matching.scorer import calculate_match_score
from ai.matching.explainer import generate_match_explanation

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.post("", response_model=ApplicationOut)
def apply_to_job(
    app_in: ApplicationCreate,
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
):
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    job = db.query(Job).filter(Job.id == app_in.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    existing = db.query(Application).filter(
        Application.candidate_id == profile.id,
        Application.job_id == job.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied to this position")

    # Create Application
    application = Application(
        candidate_id=profile.id,
        job_id=job.id,
        status="applied"
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    # Compute & save MatchScore
    resume = db.query(Resume).filter(Resume.candidate_id == profile.id).order_by(Resume.uploaded_at.desc()).first()
    cand_skills = [cs.skill.name for cs in profile.skills if cs.skill]
    if not cand_skills:
        cand_skills = ["Python", "FastAPI", "React", "JavaScript", "SQL"]

    cand_analysis = {}
    cand_embedding = None
    if resume and resume.analysis:
        cand_analysis = {
            "experience_score": resume.analysis.experience_score,
            "projects_score": resume.analysis.projects_score,
            "education_score": resume.analysis.education_score,
        }
        cand_embedding = resume.embedding

    req_skills = [js.skill.name for js in job.skills if js.requirement_type == "required" and js.skill]
    pref_skills = [js.skill.name for js in job.skills if js.requirement_type == "preferred" and js.skill]

    match_res = calculate_match_score(
        candidate_skills=cand_skills,
        job_required_skills=req_skills,
        job_preferred_skills=pref_skills,
        candidate_embedding=cand_embedding,
        job_embedding=job.embedding,
        candidate_analysis=cand_analysis,
        job_experience_level=job.experience_level
    )

    explanation = generate_match_explanation(
        overall_score=match_res["overall_score"],
        matched_skills=match_res["matched_skills"],
        missing_skills=match_res["missing_skills"],
        job_title=job.title,
        candidate_name=profile.full_name
    )

    match_record = MatchScore(
        application_id=application.id,
        job_id=job.id,
        candidate_id=profile.id,
        overall_score=match_res["overall_score"],
        skills_score=match_res["skills_score"],
        experience_score=match_res["experience_score"],
        projects_score=match_res["projects_score"],
        education_score=match_res["education_score"],
        certifications_score=match_res["certifications_score"],
        matched_skills=match_res["matched_skills"],
        missing_skills=match_res["missing_skills"],
        ai_explanation=explanation
    )
    db.add(match_record)
    db.commit()

    return {
        "id": application.id,
        "job_id": job.id,
        "candidate_id": profile.id,
        "status": application.status,
        "applied_at": application.applied_at,
        "candidate_name": profile.full_name,
        "candidate_headline": profile.headline
    }

@router.get("/candidate/my-applications")
def get_my_applications(
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
):
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    apps = db.query(Application).filter(Application.candidate_id == profile.id).order_by(Application.applied_at.desc()).all()
    results = []
    for app in apps:
        job = app.job
        comp_name = job.recruiter.company_name if job and job.recruiter else "HireSense Partner"
        ms = app.match_score
        match_breakdown = None
        if ms:
            match_breakdown = {
                "overall_score": ms.overall_score,
                "skills_score": ms.skills_score,
                "experience_score": ms.experience_score,
                "projects_score": ms.projects_score,
                "education_score": ms.education_score,
                "certifications_score": ms.certifications_score,
                "matched_skills": ms.matched_skills or [],
                "missing_skills": ms.missing_skills or [],
                "ai_explanation": ms.ai_explanation or ""
            }

        results.append({
            "id": app.id,
            "job_id": app.job_id,
            "candidate_id": app.candidate_id,
            "status": app.status,
            "applied_at": app.applied_at,
            "job": {
                "id": job.id,
                "title": job.title,
                "location": job.location,
                "company_name": comp_name,
                "salary_range": job.salary_range
            } if job else None,
            "match_score": match_breakdown
        })
    return results

@router.get("/job/{job_id}")
def get_job_applicants(
    job_id: str,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    apps = db.query(Application).filter(Application.job_id == job_id).all()
    results = []
    for app in apps:
        cand = app.candidate
        ms = app.match_score
        match_breakdown = None
        if ms:
            match_breakdown = {
                "overall_score": ms.overall_score,
                "skills_score": ms.skills_score,
                "experience_score": ms.experience_score,
                "projects_score": ms.projects_score,
                "education_score": ms.education_score,
                "certifications_score": ms.certifications_score,
                "matched_skills": ms.matched_skills or [],
                "missing_skills": ms.missing_skills or [],
                "ai_explanation": ms.ai_explanation or ""
            }

        results.append({
            "id": app.id,
            "job_id": app.job_id,
            "candidate_id": app.candidate_id,
            "status": app.status,
            "applied_at": app.applied_at,
            "candidate_name": cand.full_name if cand else "Candidate",
            "candidate_headline": cand.headline if cand else "Developer",
            "match_score": match_breakdown
        })

    # Sort descending by match overall score
    results.sort(key=lambda x: (x["match_score"]["overall_score"] if x["match_score"] else 0), reverse=True)
    return results

@router.patch("/{application_id}/status")
def update_application_status(
    application_id: str,
    status_update: ApplicationStatusUpdate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    app.status = status_update.status
    app.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(app)
    return {"id": app.id, "status": app.status, "updated_at": app.updated_at}
