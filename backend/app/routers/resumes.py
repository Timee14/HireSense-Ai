from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session, joinedload
from app.db.session import get_db
from app.models.models import User, CandidateProfile, Resume, AIAnalysis, Skill, CandidateSkill
from app.schemas.schemas import ResumeOut, AIAnalysisOut
from app.core.deps import get_current_user, require_role
from ai.extraction.resume_parser import parse_resume_file
from ai.extraction.info_extractor import extract_structured_resume
from ai.embeddings.embedder import generate_embedding

router = APIRouter(prefix="/resumes", tags=["Resumes"])

@router.post("/upload", response_model=ResumeOut)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
):
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    try:
        content = await file.read()
        filename = file.filename or "resume.pdf"
        raw_text = parse_resume_file(content, filename)

        # Generate AI analysis and embedding
        analysis_data = extract_structured_resume(raw_text)
        embedding_vector = generate_embedding(raw_text)

        # Delete previous resumes for this candidate to ensure fresh parsing
        old_resumes = db.query(Resume).filter(Resume.candidate_id == profile.id).all()
        for old_r in old_resumes:
            db.query(AIAnalysis).filter(AIAnalysis.resume_id == old_r.id).delete()
            db.delete(old_r)
        db.commit()

        # Save Resume
        resume = Resume(
            candidate_id=profile.id,
            file_name=filename,
            file_type=filename.split(".")[-1].lower() if "." in filename else "pdf",
            raw_text=raw_text,
            status="complete",
            embedding=embedding_vector
        )
        db.add(resume)
        db.commit()
        db.refresh(resume)

        # Save AI Analysis
        ai_analysis = AIAnalysis(
            resume_id=resume.id,
            overall_score=analysis_data["overall_score"],
            ats_score=analysis_data["ats_score"],
            skills_score=analysis_data["skills_score"],
            experience_score=analysis_data["experience_score"],
            projects_score=analysis_data["projects_score"],
            education_score=analysis_data["education_score"],
            formatting_score=analysis_data["formatting_score"],
            suggestions=analysis_data["suggestions"],
            extracted_education=analysis_data["extracted_education"],
            extracted_experience=analysis_data["extracted_experience"],
            extracted_projects=analysis_data["extracted_projects"],
            extracted_certifications=analysis_data["extracted_certifications"]
        )
        db.add(ai_analysis)

        # Attach extracted skills to candidate profile
        for skill_name in analysis_data["extracted_skills"]:
            sk = db.query(Skill).filter(Skill.name == skill_name).first()
            if not sk:
                sk = Skill(name=skill_name, category="Technical")
                db.add(sk)
                db.commit()
                db.refresh(sk)

            existing_cs = db.query(CandidateSkill).filter(
                CandidateSkill.candidate_id == profile.id,
                CandidateSkill.skill_id == sk.id
            ).first()

            if not existing_cs:
                cs = CandidateSkill(candidate_id=profile.id, skill_id=sk.id, proficiency="intermediate", source="resume")
                db.add(cs)

        # Update candidate profile completion
        profile.profile_completion_pct = min(100, profile.profile_completion_pct + 30)

        db.commit()
        
        # Re-fetch resume with joined AI analysis
        fetched_resume = db.query(Resume).options(joinedload(Resume.analysis)).filter(Resume.id == resume.id).first()
        return fetched_resume

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Resume PDF processing failed: {str(e)}")

@router.get("/me", response_model=ResumeOut)
def get_my_resume(
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
):
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    resume = db.query(Resume).options(joinedload(Resume.analysis)).filter(Resume.candidate_id == profile.id).order_by(Resume.uploaded_at.desc()).first()
    if not resume:
        raise HTTPException(status_code=404, detail="No resume uploaded yet")

    return resume
