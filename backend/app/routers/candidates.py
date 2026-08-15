from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import User, CandidateProfile, Resume, Job, JobSkill, Skill
from app.schemas.schemas import CandidateProfileOut, CandidateProfileUpdate
from app.core.deps import get_current_user, require_role
from ai.matching.scorer import calculate_match_score
from ai.matching.explainer import generate_match_explanation

router = APIRouter(prefix="/candidates", tags=["Candidates"])

@router.get("/me", response_model=CandidateProfileOut)
def get_candidate_profile(
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
):
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")
    return profile

@router.put("/me", response_model=CandidateProfileOut)
def update_candidate_profile(
    update_data: CandidateProfileUpdate,
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
):
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    if update_data.full_name:
        profile.full_name = update_data.full_name
    if update_data.phone is not None:
        profile.phone = update_data.phone
    if update_data.location is not None:
        profile.location = update_data.location
    if update_data.headline is not None:
        profile.headline = update_data.headline

    db.commit()
    db.refresh(profile)
    return profile

@router.get("/me/recommendations")
def get_job_recommendations(
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
):
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    resume = db.query(Resume).filter(Resume.candidate_id == profile.id).order_by(Resume.uploaded_at.desc()).first()
    cand_skills = []
    cand_analysis = {}
    cand_embedding = None

    if resume and resume.analysis:
        cand_analysis = {
            "experience_score": resume.analysis.experience_score,
            "projects_score": resume.analysis.projects_score,
            "education_score": resume.analysis.education_score,
        }
        cand_embedding = resume.embedding

    for cs in profile.skills:
        if cs.skill:
            cand_skills.append(cs.skill.name)

    if not cand_skills:
        cand_skills = ["Python", "FastAPI", "React", "JavaScript", "SQL", "Git"]

    jobs = db.query(Job).filter(Job.status == "active").all()
    recommendations = []

    for job in jobs:
        req_skills = [js.skill.name for js in job.skills if js.requirement_type == "required" and js.skill]
        pref_skills = [js.skill.name for js in job.skills if js.requirement_type == "preferred" and js.skill]
        
        match_data = calculate_match_score(
            candidate_skills=cand_skills,
            job_required_skills=req_skills,
            job_preferred_skills=pref_skills,
            candidate_embedding=cand_embedding,
            job_embedding=job.embedding,
            candidate_analysis=cand_analysis,
            job_experience_level=job.experience_level
        )
        
        explanation = generate_match_explanation(
            overall_score=match_data["overall_score"],
            matched_skills=match_data["matched_skills"],
            missing_skills=match_data["missing_skills"],
            job_title=job.title,
            candidate_name=profile.full_name
        )
        match_data["ai_explanation"] = explanation

        comp_name = job.recruiter.company_name if job.recruiter else "HireSense AI Partner"

        recommendations.append({
            "job": {
                "id": job.id,
                "title": job.title,
                "location": job.location,
                "employment_type": job.employment_type,
                "experience_level": job.experience_level,
                "salary_range": job.salary_range,
                "description": job.description,
                "status": job.status,
                "created_at": job.created_at,
                "company_name": comp_name,
                "required_skills": req_skills,
                "preferred_skills": pref_skills
            },
            "match_details": match_data
        })

    # Sort descending by match overall score
    recommendations.sort(key=lambda x: x["match_details"]["overall_score"], reverse=True)
    return recommendations

@router.get("/me/skill-gaps")
def get_skill_gaps(
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
):
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    cand_skills = {cs.skill.name.upper() for cs in profile.skills if cs.skill}
    
    # Collect required skills across active jobs
    job_skills = db.query(JobSkill).join(Job).filter(Job.status == "active").all()
    skill_demand = {}
    for js in job_skills:
        if js.skill:
            name = js.skill.name
            skill_demand[name] = skill_demand.get(name, 0) + 1

    gaps = []
    for skill_name, count in sorted(skill_demand.items(), key=lambda x: x[1], reverse=True):
        if skill_name.upper() not in cand_skills:
            gaps.append({
                "skill": skill_name,
                "demand_count": count,
                "recommendation": f"Adding {skill_name} will increase your job match rate across top posted developer roles."
            })

    return gaps[:8]
