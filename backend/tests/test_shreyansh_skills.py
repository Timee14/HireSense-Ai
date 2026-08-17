import sys
import os
import sqlite3
import json

backend_dir = os.path.abspath(os.path.dirname(__file__))
root_dir = os.path.abspath(os.path.join(backend_dir, "..", ".."))
sys.path.insert(0, root_dir)
sys.path.insert(0, os.path.join(root_dir, "backend"))

from ai.extraction.info_extractor import extract_structured_resume
from ai.matching.scorer import calculate_match_score
from ai.matching.explainer import generate_match_explanation

db_path = os.path.join(backend_dir, "..", "hiresense.db")
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row

# Find Shreyansh candidate
cand = conn.execute("SELECT * FROM candidate_profiles WHERE full_name LIKE '%Shreyansh%' OR user_id IN (SELECT id FROM users WHERE email LIKE '%shreyansh%')").fetchone()
if cand:
    print(f"[+] Found candidate: {cand['full_name']} (ID: {cand['id']})")
    resume = conn.execute("SELECT * FROM resumes WHERE candidate_id = ? ORDER BY uploaded_at DESC LIMIT 1", (cand['id'],)).fetchone()
    if resume and resume['raw_text']:
        print(f"[+] Raw Resume Text Snippet:\n{resume['raw_text'][:300]}")
        parsed = extract_structured_resume(resume['raw_text'])
        print(f"\n[+] Extracted Skills ({len(parsed['extracted_skills'])}):", parsed['extracted_skills'])

        # Recalculate match for all jobs
        jobs = conn.execute("SELECT * FROM jobs WHERE status = 'active'").fetchall()
        for j in jobs:
            job_skills_rows = conn.execute("SELECT s.name, js.requirement_type FROM job_skills js JOIN skills s ON js.skill_id = s.id WHERE js.job_id = ?", (j["id"],)).fetchall()
            req_skills = [r["name"] for r in job_skills_rows if (r["requirement_type"] or "").lower() == 'required']
            pref_skills = [r["name"] for r in job_skills_rows if (r["requirement_type"] or "").lower() != 'required']
            if not req_skills:
                req_skills = ["Python", "FastAPI", "React"]

            ms = calculate_match_score(
                candidate_skills=parsed['extracted_skills'],
                job_required_skills=req_skills,
                job_preferred_skills=pref_skills,
                candidate_analysis=parsed
            )
            ai_exp = generate_match_explanation(ms['overall_score'], ms['matched_skills'], ms['missing_skills'], j['title'], cand['full_name'])

            # Update match_scores table in DB
            existing_ms = conn.execute("SELECT id FROM match_scores WHERE candidate_id = ? AND job_id = ?", (cand['id'], j['id'])).fetchone()
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
            print(f"\n[+] Match with Job '{j['title']}':")
            print(f"  - Overall Score: {ms['overall_score']}% (Skills Score: {ms['skills_score']}%)")
            print(f"  - Matched Skills: {ms['matched_skills']}")
            print(f"  - Missing Skills: {ms['missing_skills']}")
            print(f"  - AI Rationale: {ai_exp}")

        conn.commit()
else:
    print("[-] Shreyansh candidate not found in database.")

conn.close()
