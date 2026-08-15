from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.models import Skill
from app.schemas.schemas import SkillOut

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.get("", response_model=List[SkillOut])
def get_skills(query: str = Query("", description="Skill search query"), db: Session = Depends(get_db)):
    if query:
        return db.query(Skill).filter(Skill.name.ilike(f"%{query}%")).limit(15).all()
    return db.query(Skill).limit(30).all()
