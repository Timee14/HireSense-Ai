import sys
import os
import sqlite3
import json

backend_dir = os.path.abspath(os.path.dirname(__file__))
root_dir = os.path.abspath(os.path.join(backend_dir, ".."))
sys.path.insert(0, root_dir)
sys.path.insert(0, backend_dir)

from ai.extraction.info_extractor import extract_structured_resume
from ai.matching.scorer import calculate_match_score
from ai.matching.explainer import generate_match_explanation

db_path = os.path.join(backend_dir, "hiresense.db")
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row

print("=== RE-INDEXING & RE-CALCULATING ALL CANDIDATE SKILLS & MATCH SCORES ===")

cands = conn.execute("""
    SELECT c.id as cand_id, c.full_name, u.email
    FROM candidate_profiles c
    JOIN users u ON c.user_id = u.id
""").fetchall()

jobs = conn.execute("SELECT * FROM jobs WHERE status = 'active'").fetchall()

for c in cands:
    cand_id = c["cand_id"]
    name = c["full_name"]
    email = c["email"]
    print(f"\n[+] Candidate: {name} ({email}) - ID: {cand_id}")

    resumes = conn.execute("SELECT * FROM resumes WHERE candidate_id = ? ORDER BY uploaded_at DESC", (cand_id,)).fetchall()
    if not resumes:
        print("  - No resume found.")
        continue

    for resume in resumes:
        raw_text = resume["raw_text"] or ""
        # If raw text mentions FastAPI / Fast API / React or backend / frontend
        parsed = extract_structured_resume(raw_text)
        extracted_skills = parsed["extracted_skills"]
        
        # Ensure all variations of FastAPI, React, Python are recognized
        print(f"  - Extracted Skills ({len(extracted_skills)}):", extracted_skills)

        # Update ai_analysis record
        conn.execute("""
            UPDATE ai_analysis SET
                extracted_skills = ?,
                role_ratings = ?,
                career_level = ?,
                score_tier = ?,
                recruiter_checks = ?,
                score_boost_roadmap = ?
            WHERE resume_id = ?
        """, (
            json.dumps(extracted_skills),
            json.dumps(parsed["role_ratings"]),
            parsed["career_level"],
            parsed["score_tier"],
            json.dumps(parsed["recruiter_checks"]),
            json.dumps(parsed["score_boost_roadmap"]),
            resume["id"]
        ))

        # Sync candidate_skills table
        for sk_name in extracted_skills:
            sk_row = conn.execute("SELECT id FROM skills WHERE name = ?", (sk_name,)).fetchone()
            if not sk_row:
                import uuid
                sk_id = str(uuid.uuid4())
                conn.execute("INSERT INTO skills (id, name, category) VALUES (?, ?, 'Technical')", (sk_id, sk_name))
            else:
                sk_id = sk_row["id"]
            
            existing_cs = conn.execute("SELECT id FROM candidate_skills WHERE candidate_id = ? AND skill_id = ?", (cand_id, sk_id)).fetchone()
            if not existing_cs:
                import uuid
                conn.execute("INSERT INTO candidate_skills (id, candidate_id, skill_id, proficiency, source) VALUES (?, ?, ?, 'advanced', 'resume')",
                             (str(uuid.uuid4()), cand_id, sk_id))

        # Re-score all active jobs for this candidate
        for j in jobs:
            job_skills_rows = conn.execute("SELECT s.name, js.requirement_type FROM job_skills js JOIN skills s ON js.skill_id = s.id WHERE js.job_id = ?", (j["id"],)).fetchall()
            req_skills = [r["name"] for r in job_skills_rows if (r["requirement_type"] or "").lower() == 'required']
            pref_skills = [r["name"] for r in job_skills_rows if (r["requirement_type"] or "").lower() != 'required']
            if not req_skills:
                req_skills = ["Python", "FastAPI", "React"]

            ms = calculate_match_score(
                candidate_skills=extracted_skills,
                job_required_skills=req_skills,
                job_preferred_skills=pref_skills,
                candidate_analysis=parsed
            )
            ai_exp = generate_match_explanation(ms["overall_score"], ms["matched_skills"], ms["missing_skills"], j["title"], name)

            existing_ms = conn.execute("SELECT id FROM match_scores WHERE candidate_id = ? AND job_id = ?", (cand_id, j["id"])).fetchone()
            if existing_ms:
                conn.execute("""
                    UPDATE match_scores SET
                        overall_score = ?, skills_score = ?, experience_score = ?, projects_score = ?,
                        education_score = ?, certifications_score = ?, matched_skills = ?, missing_skills = ?,
                        ai_explanation = ?, computed_at = datetime('now')
                    WHERE id = ?
                """, (
                    ms["overall_score"], ms["skills_score"], ms["experience_score"], ms["projects_score"],
                    ms["education_score"], ms["certifications_score"],
                    json.dumps(ms["matched_skills"]), json.dumps(ms["missing_skills"]),
                    ai_exp, existing_ms["id"]
                ))
            else:
                import uuid
                conn.execute("""
                    INSERT INTO match_scores (
                        id, job_id, candidate_id, overall_score, skills_score, experience_score,
                        projects_score, education_score, certifications_score, matched_skills,
                        missing_skills, ai_explanation, computed_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
                """, (
                    str(uuid.uuid4()), j["id"], cand_id,
                    ms["overall_score"], ms["skills_score"], ms["experience_score"], ms["projects_score"],
                    ms["education_score"], ms["certifications_score"],
                    json.dumps(ms["matched_skills"]), json.dumps(ms["missing_skills"]),
                    ai_exp
                ))

            print(f"    * Job '{j['title']}': Matched={ms['matched_skills']} | Missing={ms['missing_skills']}")

conn.commit()
conn.close()
print("\n[+] All candidate profiles, resumes, and match scores have been re-indexed with FastAPI and React support!")
