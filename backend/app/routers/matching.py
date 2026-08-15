from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import User, CandidateProfile, Job, Resume
from app.core.deps import get_current_user
from ai.matching.scorer import calculate_match_score
from ai.matching.explainer import generate_match_explanation

router = APIRouter(prefix="/matching", tags=["Matching"])

@router.get("/breakdown/{candidate_id}/{job_id}")
def get_match_breakdown(
    candidate_id: str,
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    candidate = db.query(CandidateProfile).filter(CandidateProfile.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    resume = db.query(Resume).filter(Resume.candidate_id == candidate.id).order_by(Resume.uploaded_at.desc()).first()
    cand_skills = [cs.skill.name for cs in candidate.skills if cs.skill]
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
        candidate_name=candidate.full_name
    )
    match_res["ai_explanation"] = explanation

    return {
        "candidate": {
            "id": candidate.id,
            "full_name": candidate.full_name,
            "headline": candidate.headline,
            "location": candidate.location
        },
        "job": {
            "id": job.id,
            "title": job.title,
            "company_name": job.recruiter.company_name if job.recruiter else "HireSense Partner"
        },
        "match_details": match_res
    }
