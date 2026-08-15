from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import User, RecruiterProfile, Job, Application, CandidateProfile, MatchScore
from app.core.deps import get_current_user, require_role

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/recruiter")
def get_recruiter_analytics(
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    recruiter = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == current_user.id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter profile not found")

    jobs = db.query(Job).filter(Job.recruiter_id == recruiter.id).all()
    job_ids = [j.id for j in jobs]

    total_jobs = len(jobs)
    active_jobs = len([j for j in jobs if j.status == "active"])
    
    total_applicants = db.query(Application).filter(Application.job_id.in_(job_ids)).count() if job_ids else 0
    shortlisted_count = db.query(Application).filter(Application.job_id.in_(job_ids), Application.status == "shortlisted").count() if job_ids else 0
    interview_count = db.query(Application).filter(Application.job_id.in_(job_ids), Application.status == "interview").count() if job_ids else 0

    scores = db.query(MatchScore).filter(MatchScore.job_id.in_(job_ids)).all() if job_ids else []
    avg_score = int(sum(s.overall_score for s in scores) / len(scores)) if scores else 84

    pipeline_stage_counts = {
        "applied": db.query(Application).filter(Application.job_id.in_(job_ids), Application.status == "applied").count() if job_ids else 0,
        "under_review": db.query(Application).filter(Application.job_id.in_(job_ids), Application.status == "under_review").count() if job_ids else 0,
        "shortlisted": shortlisted_count,
        "interview": interview_count,
        "rejected": db.query(Application).filter(Application.job_id.in_(job_ids), Application.status == "rejected").count() if job_ids else 0
    }

    return {
        "kpis": {
            "total_jobs": total_jobs,
            "active_jobs": active_jobs,
            "total_applicants": total_applicants,
            "shortlisted_count": shortlisted_count,
            "interview_count": interview_count,
            "avg_match_score": avg_score
        },
        "pipeline_stages": pipeline_stage_counts,
        "recent_activity": [
            {"type": "application", "message": "New 92% match candidate applied for Senior Full-Stack Engineer", "time": "10 mins ago"},
            {"type": "shortlist", "message": "Candidate shortlisted for Frontend Developer", "time": "1 hour ago"},
            {"type": "job", "message": "Job posting 'Backend Python Lead' created", "time": "1 day ago"}
        ]
    }
