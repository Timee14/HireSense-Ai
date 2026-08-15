import sys
import os

# Add backend directory and root directory to sys.path
backend_dir = os.path.abspath(os.path.dirname(__file__))
root_dir = os.path.abspath(os.path.join(backend_dir, ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from app.db.session import SessionLocal, engine, Base
from app.models.models import (
    User, CandidateProfile, RecruiterProfile, Resume, AIAnalysis,
    Skill, CandidateSkill, Job, JobSkill, Application, MatchScore
)
from app.core.security import get_password_hash
from ai.extraction.info_extractor import extract_structured_resume
from ai.embeddings.embedder import generate_embedding
from ai.matching.scorer import calculate_match_score
from ai.matching.explainer import generate_match_explanation

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing data to ensure clean state
    db.query(MatchScore).delete()
    db.query(Application).delete()
    db.query(JobSkill).delete()
    db.query(Job).delete()
    db.query(CandidateSkill).delete()
    db.query(Skill).delete()
    db.query(AIAnalysis).delete()
    db.query(Resume).delete()
    db.query(CandidateProfile).delete()
    db.query(RecruiterProfile).delete()
    db.query(User).delete()
    db.commit()

    print("[+] Seeding HireSense AI database...")

    # 1. Create Core Skills
    skills_list = [
        ("Python", "Backend"), ("FastAPI", "Backend"), ("React", "Frontend"),
        ("TypeScript", "Frontend"), ("JavaScript", "Frontend"), ("Node.js", "Backend"),
        ("PostgreSQL", "Database"), ("MongoDB", "Database"), ("Redis", "Database"),
        ("Docker", "DevOps"), ("AWS", "Cloud"), ("Kubernetes", "DevOps"),
        ("Tailwind CSS", "Frontend"), ("GraphQL", "API"), ("Machine Learning", "AI"),
        ("TensorFlow", "AI"), ("PyTorch", "AI"), ("SQL", "Database"),
        ("System Design", "Architecture"), ("Git", "Tools")
    ]
    skill_objs = {}
    for name, cat in skills_list:
        sk = Skill(name=name, category=cat)
        db.add(sk)
        db.commit()
        db.refresh(sk)
        skill_objs[name] = sk

    # 2. Create Sample Candidate Users (10 Candidates)
    cand_data = [
        ("alex.dev@example.com", "Alex Chen", "Senior Full-Stack Engineer | Python, React & Cloud Architect", ["Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "Docker", "AWS"]),
        ("sarah.m@example.com", "Sarah Miller", "AI / ML Developer & Data Scientist", ["Python", "Machine Learning", "PyTorch", "TensorFlow", "FastAPI", "SQL"]),
        ("david.k@example.com", "David Kim", "Frontend Engineer | UI/UX & React Specialist", ["React", "TypeScript", "JavaScript", "Tailwind CSS", "GraphQL", "Git"]),
        ("priya.s@example.com", "Priya Sharma", "Backend & Distributed Systems Developer", ["Python", "Node.js", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS"]),
        ("marcus.v@example.com", "Marcus Vance", "Full Stack Software Engineer", ["JavaScript", "React", "Node.js", "MongoDB", "Tailwind CSS"]),
        ("elena.r@example.com", "Elena Rostova", "DevOps & Cloud Infrastructure Lead", ["Docker", "Kubernetes", "AWS", "Python", "System Design", "Git"]),
        ("james.w@example.com", "James Wilson", "Python Microservices Developer", ["Python", "FastAPI", "PostgreSQL", "Redis", "Git"]),
        ("ananya.p@example.com", "Ananya Patel", "Frontend Developer & React Specialist", ["React", "TypeScript", "JavaScript", "Tailwind CSS"]),
        ("lucas.m@example.com", "Lucas Meyer", "Data Engineer & SQL Analyst", ["Python", "PostgreSQL", "SQL", "Redis", "MongoDB"]),
        ("chloe.d@example.com", "Chloe Dubois", "Full-Stack Software Engineer", ["Python", "FastAPI", "React", "TypeScript", "Docker"])
    ]

    cand_profiles = []
    for email, name, headline, sk_names in cand_data:
        user = User(
            email=email,
            password_hash=get_password_hash("password123"),
            role="candidate"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        profile = CandidateProfile(
            user_id=user.id,
            full_name=name,
            phone="+1 (555) 234-5678",
            location="San Francisco, CA (Remote)",
            headline=headline,
            profile_completion_pct=95
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
        cand_profiles.append((profile, sk_names))

        # Add candidate skills
        for sk_name in sk_names:
            if sk_name in skill_objs:
                cs = CandidateSkill(candidate_id=profile.id, skill_id=skill_objs[sk_name].id, proficiency="advanced", source="resume")
                db.add(cs)

        # Add candidate Resume & AI Analysis
        raw_txt = f"{name} - {headline}. Skills: {', '.join(sk_names)}. Built high-performance microservices and responsive web platforms."
        analysis_data = extract_structured_resume(raw_txt)
        emb = generate_embedding(raw_txt)

        resume = Resume(
            candidate_id=profile.id,
            file_name=f"{name.replace(' ', '_')}_Resume.pdf",
            file_type="pdf",
            raw_text=raw_txt,
            status="complete",
            embedding=emb
        )
        db.add(resume)
        db.commit()
        db.refresh(resume)

        ai_an = AIAnalysis(
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
        db.add(ai_an)
        db.commit()

    # 3. Create Sample Recruiter Users & Jobs (5 Recruiters)
    rec_data = [
        ("recruiter@techinnovations.com", "Tech Innovations Inc.", "https://techinnovations.com"),
        ("talent@cloudscale.io", "CloudScale Systems", "https://cloudscale.io"),
        ("careers@datapulse.ai", "DataPulse AI Labs", "https://datapulse.ai"),
        ("hr@nexussoftware.com", "Nexus Software Solutions", "https://nexussoftware.com"),
        ("hiring@apexglobal.com", "Apex Global Tech", "https://apexglobal.com")
    ]

    rec_profiles = []
    for email, company, web in rec_data:
        user = User(
            email=email,
            password_hash=get_password_hash("password123"),
            role="recruiter"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        rec = RecruiterProfile(user_id=user.id, company_name=company, company_website=web)
        db.add(rec)
        db.commit()
        db.refresh(rec)
        rec_profiles.append(rec)

    # 10 Active Jobs
    job_specs = [
        {
            "recruiter": rec_profiles[0],
            "title": "Senior Full-Stack Engineer",
            "location": "San Francisco, CA (Hybrid)",
            "employment_type": "Full-time",
            "experience_level": "Senior",
            "salary_range": "$140,000 - $175,000",
            "description": "We are seeking a Senior Full-Stack Engineer to architect and build our next-generation AI web platform. You will work with FastAPI, React, TypeScript, PostgreSQL, and Docker.",
            "req": ["Python", "FastAPI", "React", "TypeScript", "PostgreSQL"],
            "pref": ["Docker", "AWS", "Redis"]
        },
        {
            "recruiter": rec_profiles[0],
            "title": "AI / Machine Learning Engineer",
            "location": "Remote",
            "employment_type": "Full-time",
            "experience_level": "Mid-Level",
            "salary_range": "$130,000 - $160,000",
            "description": "Join our AI lab! Looking for an ML engineer proficient in Python, PyTorch/TensorFlow, NLP, and model deployment via FastAPI microservices.",
            "req": ["Python", "Machine Learning", "PyTorch", "FastAPI"],
            "pref": ["TensorFlow", "Docker", "AWS"]
        },
        {
            "recruiter": rec_profiles[1],
            "title": "Frontend React Developer",
            "location": "Austin, TX (Remote)",
            "employment_type": "Full-time",
            "experience_level": "Mid-Level",
            "salary_range": "$110,000 - $135,000",
            "description": "Build stunning, lightning-fast user interfaces using modern React, TypeScript, Tailwind CSS, and state management.",
            "req": ["React", "TypeScript", "JavaScript", "Tailwind CSS"],
            "pref": ["GraphQL", "Git"]
        },
        {
            "recruiter": rec_profiles[1],
            "title": "Cloud Infrastructure & Backend Lead",
            "location": "New York, NY (Hybrid)",
            "employment_type": "Full-time",
            "experience_level": "Lead",
            "salary_range": "$160,000 - $195,000",
            "description": "Manage scalable containerized infrastructure, Redis caches, and high-throughput Python and Node.js APIs.",
            "req": ["Python", "Docker", "Kubernetes", "AWS", "PostgreSQL"],
            "pref": ["Redis", "Node.js", "System Design"]
        },
        {
            "recruiter": rec_profiles[2],
            "title": "Backend Python Developer",
            "location": "Seattle, WA (Remote)",
            "employment_type": "Full-time",
            "experience_level": "Mid-Level",
            "salary_range": "$120,000 - $145,000",
            "description": "Develop high-concurrency Python REST APIs using FastAPI and PostgreSQL database optimization.",
            "req": ["Python", "FastAPI", "PostgreSQL"],
            "pref": ["Redis", "Docker"]
        },
        {
            "recruiter": rec_profiles[2],
            "title": "Data Engineer & Pipeline Specialist",
            "location": "Boston, MA (Hybrid)",
            "employment_type": "Full-time",
            "experience_level": "Senior",
            "salary_range": "$135,000 - $165,000",
            "description": "Build ETL data pipelines, optimize SQL queries, and manage cloud data architecture.",
            "req": ["Python", "PostgreSQL", "SQL"],
            "pref": ["AWS", "Redis", "MongoDB"]
        },
        {
            "recruiter": rec_profiles[3],
            "title": "DevOps Engineer",
            "location": "Remote",
            "employment_type": "Full-time",
            "experience_level": "Mid-Level",
            "salary_range": "$125,000 - $150,000",
            "description": "Automate deployment pipelines with Docker, Kubernetes, and AWS cloud infrastructure.",
            "req": ["Docker", "Kubernetes", "AWS"],
            "pref": ["Python", "System Design"]
        },
        {
            "recruiter": rec_profiles[3],
            "title": "Full-Stack TypeScript Engineer",
            "location": "Chicago, IL (Hybrid)",
            "employment_type": "Full-time",
            "experience_level": "Mid-Level",
            "salary_range": "$115,000 - $140,000",
            "description": "Build modern Web applications with React, Node.js, and GraphQL API integrations.",
            "req": ["React", "TypeScript", "Node.js"],
            "pref": ["GraphQL", "PostgreSQL"]
        },
        {
            "recruiter": rec_profiles[4],
            "title": "Senior AI NLP Scientist",
            "location": "San Jose, CA (Hybrid)",
            "employment_type": "Full-time",
            "experience_level": "Senior",
            "salary_range": "$170,000 - $210,000",
            "description": "Research and build NLP dense vector models, document extractors, and LLM fine-tuning pipelines.",
            "req": ["Python", "Machine Learning", "PyTorch", "System Design"],
            "pref": ["FastAPI", "Docker"]
        },
        {
            "recruiter": rec_profiles[4],
            "title": "UI/UX Frontend Architect",
            "location": "Remote",
            "employment_type": "Full-time",
            "experience_level": "Lead",
            "salary_range": "$150,000 - $180,000",
            "description": "Architect accessible, responsive design systems using React 18, TypeScript, and Tailwind CSS.",
            "req": ["React", "TypeScript", "Tailwind CSS", "JavaScript"],
            "pref": ["Git", "GraphQL"]
        }
    ]

    jobs = []
    for spec in job_specs:
        emb = generate_embedding(f"{spec['title']} {spec['description']}")
        job = Job(
            recruiter_id=spec["recruiter"].id,
            title=spec["title"],
            location=spec["location"],
            employment_type=spec["employment_type"],
            experience_level=spec["experience_level"],
            salary_range=spec["salary_range"],
            description=spec["description"],
            responsibilities=[
                "Lead development of key application modules.",
                "Conduct code reviews and champion software engineering best practices.",
                "Design and optimize high-concurrency database queries and API endpoints."
            ],
            embedding=emb,
            status="active"
        )
        db.add(job)
        db.commit()
        db.refresh(job)
        jobs.append(job)

        for r_name in spec["req"]:
            if r_name in skill_objs:
                js = JobSkill(job_id=job.id, skill_id=skill_objs[r_name].id, requirement_type="required")
                db.add(js)

        for p_name in spec["pref"]:
            if p_name in skill_objs:
                js = JobSkill(job_id=job.id, skill_id=skill_objs[p_name].id, requirement_type="preferred")
                db.add(js)

        db.commit()

    # 4. Generate ~50 Applications & Match Scores across 10 candidates & 10 jobs
    statuses = ["applied", "under_review", "shortlisted", "interview", "offer", "rejected"]
    app_count_total = 0
    for idx, (cand, cand_sk) in enumerate(cand_profiles):
        for j_idx, job in enumerate(jobs):
            # Create application for 5 out of 10 jobs per candidate (total 50 applications)
            if (idx + j_idx) % 2 == 0:
                app = Application(
                    candidate_id=cand.id,
                    job_id=job.id,
                    status=statuses[(idx + j_idx) % len(statuses)]
                )
                db.add(app)
                db.commit()
                db.refresh(app)
                app_count_total += 1

                req_skills = [js.skill.name for js in job.skills if js.requirement_type == "required" and js.skill]
                pref_skills = [js.skill.name for js in job.skills if js.requirement_type == "preferred" and js.skill]

                m_res = calculate_match_score(
                    candidate_skills=cand_sk,
                    job_required_skills=req_skills,
                    job_preferred_skills=pref_skills,
                    candidate_embedding=None,
                    job_embedding=job.embedding,
                    job_experience_level=job.experience_level
                )

                expl = generate_match_explanation(
                    overall_score=m_res["overall_score"],
                    matched_skills=m_res["matched_skills"],
                    missing_skills=m_res["missing_skills"],
                    job_title=job.title,
                    candidate_name=cand.full_name
                )

                ms = MatchScore(
                    application_id=app.id,
                    job_id=job.id,
                    candidate_id=cand.id,
                    overall_score=m_res["overall_score"],
                    skills_score=m_res["skills_score"],
                    experience_score=m_res["experience_score"],
                    projects_score=m_res["projects_score"],
                    education_score=m_res["education_score"],
                    certifications_score=m_res["certifications_score"],
                    matched_skills=m_res["matched_skills"],
                    missing_skills=m_res["missing_skills"],
                    ai_explanation=expl
                )
                db.add(ms)
                db.commit()

    print(f"[SUCCESS] Seed completed successfully! Created 10 Candidate Accounts, 5 Recruiter Accounts, 10 Active Jobs, and {app_count_total} Applications.")
    print("   Candidate Demo: alex.dev@example.com / password123")
    print("   Recruiter Demo: recruiter@techinnovations.com / password123")

if __name__ == "__main__":
    seed()


if __name__ == "__main__":
    seed()
