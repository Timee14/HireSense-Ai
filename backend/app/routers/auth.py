from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import User, CandidateProfile, RecruiterProfile
from app.schemas.schemas import UserRegister, UserLogin, Token, UserOut, RefreshTokenInput
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token
from app.core.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        role=user_in.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    name = user_in.full_name or user_in.email.split("@")[0].capitalize()
    if user_in.role == "candidate":
        cand = CandidateProfile(
            user_id=user.id,
            full_name=name,
            headline="Software Developer",
            profile_completion_pct=60
        )
        db.add(cand)
    else:
        rec = RecruiterProfile(
            user_id=user.id,
            company_name=user_in.company_name or "Tech Innovation Corp",
            company_website="https://example.com"
        )
        db.add(rec)

    db.commit()

    access_token = create_access_token(subject=user.id, role=user.role)
    refresh_token = create_refresh_token(subject=user.id, role=user.role)
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        role=user.role,
        name=name
    )

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    name = user.email.split("@")[0].capitalize()
    if user.role == "candidate" and user.candidate_profile:
        name = user.candidate_profile.full_name
    elif user.role == "recruiter" and user.recruiter_profile:
        name = user.recruiter_profile.company_name

    access_token = create_access_token(subject=user.id, role=user.role)
    refresh_token = create_refresh_token(subject=user.id, role=user.role)
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        role=user.role,
        name=name
    )

@router.post("/refresh", response_model=Token)
def refresh_token(token_input: RefreshTokenInput, db: Session = Depends(get_db)):
    from app.core.security import decode_token
    try:
        payload = decode_token(token_input.refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=400, detail="Invalid refresh token type")
        user_id = payload.get("sub")
        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_active:
            raise HTTPException(status_code=401, detail="User not found or inactive")
        
        name = user.email.split("@")[0].capitalize()
        if user.role == "candidate" and user.candidate_profile:
            name = user.candidate_profile.full_name
        elif user.role == "recruiter" and user.recruiter_profile:
            name = user.recruiter_profile.company_name

        new_access_token = create_access_token(subject=user.id, role=user.role)
        new_refresh_token = create_refresh_token(subject=user.id, role=user.role)
        return Token(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            user_id=user.id,
            email=user.email,
            role=user.role,
            name=name
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid or expired refresh token: {str(e)}")

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

