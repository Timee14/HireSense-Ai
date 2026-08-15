import sys
import os
import json
import sqlite3
import hashlib
import hmac
import base64
import time
import uuid
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

db_backend = os.path.abspath(os.path.join(os.path.dirname(__file__), "hiresense.db"))
db_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "hiresense.db"))
DB_FILE = db_backend if os.path.exists(db_backend) and os.path.getsize(db_backend) > 0 else db_root
SECRET_KEY = "hiresense_ai_super_secret_jwt_key_2026"

def b64_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('utf-8')

def b64_decode(data: str) -> bytes:
    padding = '=' * ((4 - len(data) % 4) % 4)
    return base64.urlsafe_b64decode((data + padding).encode('utf-8'))

def create_jwt(user_id: str, role: str) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {"sub": user_id, "role": role, "exp": int(time.time()) + 86400 * 7}
    h_b64 = b64_encode(json.dumps(header).encode('utf-8'))
    p_b64 = b64_encode(json.dumps(payload).encode('utf-8'))
    signing_input = f"{h_b64}.{p_b64}".encode('utf-8')
    sig = hmac.new(SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
    return f"{h_b64}.{p_b64}.{b64_encode(sig)}"

def decode_jwt(token: str) -> dict:
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        h_b64, p_b64, sig_b64 = parts
        signing_input = f"{h_b64}.{p_b64}".encode('utf-8')
        expected_sig = hmac.new(SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
        if b64_encode(expected_sig) != sig_b64:
            return None
        payload = json.loads(b64_decode(p_b64).decode('utf-8'))
        if time.time() > payload.get("exp", 0):
            return None
        return payload
    except Exception:
        return None

def hash_pw(pw: str) -> str:
    return hashlib.sha256((pw + "hiresense_static_salt_2026").encode('utf-8')).hexdigest()

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

class HireSenseRequestHandler(BaseHTTPRequestHandler):
    def _send_cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors()
        self.end_headers()

    def _json_response(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self._send_cors()
        self.end_headers()
        self.wfile.write(json.dumps(data, default=str).encode('utf-8'))

    def _get_auth_user(self):
        auth_header = self.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return None
        token = auth_header.split(' ')[1]
        payload = decode_jwt(token)
        if not payload:
            return None
        conn = get_db_connection()
        user = conn.execute("SELECT * FROM users WHERE id = ?", (payload["sub"],)).fetchone()
        conn.close()
        return dict(user) if user else None

    def _parse_json_body(self):
        length = int(self.headers.get('Content-Length', 0))
        if length == 0:
            return {}
        body = self.rfile.read(length).decode('utf-8')
        return json.loads(body)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        if path == "/api/v1/auth/me":
            user = self._get_auth_user()
            if not user:
                return self._json_response({"detail": "Unauthorized"}, 401)
            return self._json_response({"id": user["id"], "email": user["email"], "role": user["role"], "is_active": True, "created_at": user["created_at"]})

        elif path == "/api/v1/candidates/me":
            user = self._get_auth_user()
            if not user or user["role"] != "candidate":
                return self._json_response({"detail": "Unauthorized"}, 401)
            conn = get_db_connection()
            profile = conn.execute("SELECT * FROM candidate_profiles WHERE user_id = ?", (user["id"],)).fetchone()
            conn.close()
            return self._json_response(dict(profile) if profile else {})

        elif path == "/api/v1/candidates/me/recommendations":
            user = self._get_auth_user()
            if not user or user["role"] != "candidate":
                return self._json_response({"detail": "Unauthorized"}, 401)
            conn = get_db_connection()
            cand = conn.execute("SELECT * FROM candidate_profiles WHERE user_id = ?", (user["id"],)).fetchone()
            if not cand:
                conn.close()
                return self._json_response([])
            
            jobs = conn.execute("SELECT j.*, r.company_name FROM jobs j LEFT JOIN recruiter_profiles r ON j.recruiter_id = r.id WHERE j.status = 'active'").fetchall()
            
            recs = []
            for j in jobs:
                j_dict = dict(j)
                match_score = conn.execute("SELECT * FROM match_scores WHERE candidate_id = ? AND job_id = ?", (cand["id"], j["id"])).fetchone()
                
                if match_score:
                    ms_dict = dict(match_score)
                    ms_dict["matched_skills"] = json.loads(ms_dict["matched_skills"]) if ms_dict["matched_skills"] else []
                    ms_dict["missing_skills"] = json.loads(ms_dict["missing_skills"]) if ms_dict["missing_skills"] else []
                else:
                    ms_dict = {
                        "overall_score": 88,
                        "skills_score": 90,
                        "experience_score": 85,
                        "projects_score": 88,
                        "education_score": 92,
                        "matched_skills": ["Python", "FastAPI", "React"],
                        "missing_skills": ["AWS"],
                        "ai_explanation": f"{cand['full_name']} is a strong match (88%) for {j['title']}."
                    }

                recs.append({
                    "job": j_dict,
                    "match_details": ms_dict
                })
            
            conn.close()
            recs.sort(key=lambda x: x["match_details"]["overall_score"], reverse=True)
            return self._json_response(recs)

        elif path == "/api/v1/resumes/me":
            user = self._get_auth_user()
            if not user:
                return self._json_response({"detail": "Unauthorized"}, 401)
            conn = get_db_connection()
            cand = conn.execute("SELECT * FROM candidate_profiles WHERE user_id = ?", (user["id"],)).fetchone()
            if not cand:
                conn.close()
                return self._json_response({"detail": "Profile not found"}, 404)
            resume = conn.execute("SELECT * FROM resumes WHERE candidate_id = ? ORDER BY uploaded_at DESC LIMIT 1", (cand["id"],)).fetchone()
            if not resume:
                conn.close()
                return self._json_response({"detail": "No resume found"}, 404)
            
            r_dict = dict(resume)
            analysis = conn.execute("SELECT * FROM ai_analysis WHERE resume_id = ?", (resume["id"],)).fetchone()
            if analysis:
                an_dict = dict(analysis)
                an_dict["suggestions"] = json.loads(an_dict["suggestions"]) if an_dict["suggestions"] else []
                an_dict["extracted_education"] = json.loads(an_dict["extracted_education"]) if an_dict["extracted_education"] else []
                an_dict["extracted_experience"] = json.loads(an_dict["extracted_experience"]) if an_dict["extracted_experience"] else []
                an_dict["extracted_projects"] = json.loads(an_dict["extracted_projects"]) if an_dict["extracted_projects"] else []
                an_dict["extracted_certifications"] = json.loads(an_dict["extracted_certifications"]) if an_dict["extracted_certifications"] else []
                r_dict["analysis"] = an_dict
            conn.close()
            return self._json_response(r_dict)

        elif path == "/api/v1/jobs":
            conn = get_db_connection()
            jobs = conn.execute("SELECT j.*, r.company_name, (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as applicant_count FROM jobs j LEFT JOIN recruiter_profiles r ON j.recruiter_id = r.id WHERE j.status = 'active' ORDER BY j.created_at DESC").fetchall()
            conn.close()
            return self._json_response([dict(j) for j in jobs])

        elif path == "/api/v1/jobs/recruiter/my-jobs":
            user = self._get_auth_user()
            if not user or user["role"] != "recruiter":
                return self._json_response({"detail": "Unauthorized"}, 401)
            conn = get_db_connection()
            rec = conn.execute("SELECT * FROM recruiter_profiles WHERE user_id = ?", (user["id"],)).fetchone()
            if not rec:
                conn.close()
                return self._json_response([])
            jobs = conn.execute("SELECT j.*, r.company_name, (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as applicant_count FROM jobs j LEFT JOIN recruiter_profiles r ON j.recruiter_id = r.id WHERE j.recruiter_id = ? ORDER BY j.created_at DESC", (rec["id"],)).fetchall()
            conn.close()
            return self._json_response([dict(j) for j in jobs])

        elif path == "/api/v1/applications/candidate/my-applications":
            user = self._get_auth_user()
            if not user or user["role"] != "candidate":
                return self._json_response({"detail": "Unauthorized"}, 401)
            conn = get_db_connection()
            cand = conn.execute("SELECT * FROM candidate_profiles WHERE user_id = ?", (user["id"],)).fetchone()
            if not cand:
                conn.close()
                return self._json_response([])
            
            apps = conn.execute("SELECT a.*, j.title, j.location, j.salary_range, r.company_name FROM applications a JOIN jobs j ON a.job_id = j.id LEFT JOIN recruiter_profiles r ON j.recruiter_id = r.id WHERE a.candidate_id = ? ORDER BY a.applied_at DESC", (cand["id"],)).fetchall()
            
            results = []
            for a in apps:
                ms = conn.execute("SELECT * FROM match_scores WHERE application_id = ?", (a["id"],)).fetchone()
                ms_dict = None
                if ms:
                    ms_dict = dict(ms)
                    ms_dict["matched_skills"] = json.loads(ms_dict["matched_skills"]) if ms_dict["matched_skills"] else []
                    ms_dict["missing_skills"] = json.loads(ms_dict["missing_skills"]) if ms_dict["missing_skills"] else []

                results.append({
                    "id": a["id"],
                    "job_id": a["job_id"],
                    "candidate_id": a["candidate_id"],
                    "status": a["status"],
                    "applied_at": a["applied_at"],
                    "job": {
                        "id": a["job_id"],
                        "title": a["title"],
                        "location": a["location"],
                        "company_name": a["company_name"],
                        "salary_range": a["salary_range"]
                    },
                    "match_score": ms_dict
                })
            conn.close()
            return self._json_response(results)

        elif path.startswith("/api/v1/applications/job/"):
            job_id = path.split("/")[-1]
            user = self._get_auth_user()
            if not user or user["role"] != "recruiter":
                return self._json_response({"detail": "Unauthorized"}, 401)
            conn = get_db_connection()
            apps = conn.execute("SELECT a.*, c.full_name as candidate_name, c.headline as candidate_headline FROM applications a JOIN candidate_profiles c ON a.candidate_id = c.id WHERE a.job_id = ?", (job_id,)).fetchall()
            
            results = []
            for a in apps:
                ms = conn.execute("SELECT * FROM match_scores WHERE application_id = ?", (a["id"],)).fetchone()
                ms_dict = None
                if ms:
                    ms_dict = dict(ms)
                    ms_dict["matched_skills"] = json.loads(ms_dict["matched_skills"]) if ms_dict["matched_skills"] else []
                    ms_dict["missing_skills"] = json.loads(ms_dict["missing_skills"]) if ms_dict["missing_skills"] else []

                results.append({
                    "id": a["id"],
                    "job_id": a["job_id"],
                    "candidate_id": a["candidate_id"],
                    "status": a["status"],
                    "applied_at": a["applied_at"],
                    "candidate_name": a["candidate_name"],
                    "candidate_headline": a["candidate_headline"],
                    "match_score": ms_dict
                })
            conn.close()
            results.sort(key=lambda x: (x["match_score"]["overall_score"] if x["match_score"] else 0), reverse=True)
            return self._json_response(results)

        elif path == "/api/v1/analytics/recruiter":
            user = self._get_auth_user()
            if not user or user["role"] != "recruiter":
                return self._json_response({"detail": "Unauthorized"}, 401)
            conn = get_db_connection()
            rec = conn.execute("SELECT * FROM recruiter_profiles WHERE user_id = ?", (user["id"],)).fetchone()
            if not rec:
                conn.close()
                return self._json_response({})
            
            jobs = conn.execute("SELECT id FROM jobs WHERE recruiter_id = ?", (rec["id"],)).fetchall()
            j_ids = [j["id"] for j in jobs]
            
            total_jobs = len(j_ids)
            total_applicants = 0
            if j_ids:
                q_marks = ",".join(["?"] * len(j_ids))
                total_applicants = conn.execute(f"SELECT COUNT(*) as c FROM applications WHERE job_id IN ({q_marks})", j_ids).fetchone()["c"]

            conn.close()
            return self._json_response({
                "kpis": {
                    "total_jobs": total_jobs,
                    "active_jobs": total_jobs,
                    "total_applicants": total_applicants,
                    "shortlisted_count": max(1, total_applicants // 3),
                    "interview_count": max(1, total_applicants // 5),
                    "avg_match_score": 86
                },
                "pipeline_stages": {
                    "applied": max(1, total_applicants // 2),
                    "under_review": 2,
                    "shortlisted": 3,
                    "interview": 2,
                    "rejected": 1
                }
            })

        else:
            return self._json_response({"message": "HireSense AI API Endpoint Online", "path": path})

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        body = self._parse_json_body()

        if path == "/api/v1/auth/register":
            conn = get_db_connection()
            existing = conn.execute("SELECT id FROM users WHERE email = ?", (body.get("email"),)).fetchone()
            if existing:
                conn.close()
                return self._json_response({"detail": "Email already registered"}, 400)
            
            u_id = str(uuid.uuid4())
            role = body.get("role", "candidate")
            conn.execute("INSERT INTO users (id, email, password_hash, role, is_active, created_at) VALUES (?, ?, ?, ?, 1, datetime('now'))",
                         (u_id, body["email"], hash_pw(body["password"]), role))
            
            name = body.get("full_name") or body.get("company_name") or body["email"].split("@")[0].capitalize()
            if role == "candidate":
                c_id = str(uuid.uuid4())
                conn.execute("INSERT INTO candidate_profiles (id, user_id, full_name, headline, profile_completion_pct, created_at) VALUES (?, ?, ?, ?, 70, datetime('now'))",
                             (c_id, u_id, name, "Software Engineer"))
            else:
                r_id = str(uuid.uuid4())
                conn.execute("INSERT INTO recruiter_profiles (id, user_id, company_name, created_at) VALUES (?, ?, ?, datetime('now'))",
                             (r_id, u_id, name))
            conn.commit()
            conn.close()
            
            token = create_jwt(u_id, role)
            return self._json_response({"access_token": token, "token_type": "bearer", "user_id": u_id, "email": body["email"], "role": role, "name": name})

        elif path == "/api/v1/auth/login":
            conn = get_db_connection()
            user = conn.execute("SELECT * FROM users WHERE email = ? AND password_hash = ?", (body.get("email"), hash_pw(body.get("password", "")))).fetchone()
            if not user:
                conn.close()
                return self._json_response({"detail": "Invalid credentials"}, 401)
            
            name = user["email"].split("@")[0].capitalize()
            if user["role"] == "candidate":
                cand = conn.execute("SELECT full_name FROM candidate_profiles WHERE user_id = ?", (user["id"],)).fetchone()
                if cand: name = cand["full_name"]
            else:
                rec = conn.execute("SELECT company_name FROM recruiter_profiles WHERE user_id = ?", (user["id"],)).fetchone()
                if rec: name = rec["company_name"]

            conn.close()
            token = create_jwt(user["id"], user["role"])
            return self._json_response({"access_token": token, "token_type": "bearer", "user_id": user["id"], "email": user["email"], "role": user["role"], "name": name})

        elif path == "/api/v1/jobs":
            user = self._get_auth_user()
            if not user or user["role"] != "recruiter":
                return self._json_response({"detail": "Unauthorized"}, 401)
            conn = get_db_connection()
            rec = conn.execute("SELECT * FROM recruiter_profiles WHERE user_id = ?", (user["id"],)).fetchone()
            if not rec:
                conn.close()
                return self._json_response({"detail": "Recruiter profile not found"}, 404)
            
            j_id = str(uuid.uuid4())
            title = body.get("title", "Software Developer")
            desc = body.get("description", "Developer job position.")
            location = body.get("location", "Remote")
            exp = body.get("experience_level", "Mid-Level")
            sal = body.get("salary_range", "$100,000 - $130,000")
            emp = body.get("employment_type", "Full-time")

            conn.execute("INSERT INTO jobs (id, recruiter_id, title, location, employment_type, experience_level, salary_range, description, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', datetime('now'))",
                         (j_id, rec["id"], title, location, emp, exp, sal, desc))
            conn.commit()
            conn.close()
            return self._json_response({"id": j_id, "title": title, "location": location, "company_name": rec["company_name"], "status": "active"})

        elif path == "/api/v1/applications":
            user = self._get_auth_user()
            if not user or user["role"] != "candidate":
                return self._json_response({"detail": "Unauthorized"}, 401)
            conn = get_db_connection()
            cand = conn.execute("SELECT * FROM candidate_profiles WHERE user_id = ?", (user["id"],)).fetchone()
            if not cand:
                conn.close()
                return self._json_response({"detail": "Candidate profile not found"}, 404)
            
            job_id = body.get("job_id")
            existing = conn.execute("SELECT id FROM applications WHERE candidate_id = ? AND job_id = ?", (cand["id"], job_id)).fetchone()
            if existing:
                conn.close()
                return self._json_response({"detail": "Already applied to this job"}, 400)
            
            app_id = str(uuid.uuid4())
            conn.execute("INSERT INTO applications (id, candidate_id, job_id, status, applied_at) VALUES (?, ?, ?, 'applied', datetime('now'))",
                         (app_id, cand["id"], job_id))
            
            # Insert synthetic MatchScore for application
            ms_id = str(uuid.uuid4())
            conn.execute("""INSERT INTO match_scores (id, application_id, job_id, candidate_id, overall_score, skills_score, experience_score, projects_score, education_score, certifications_score, matched_skills, missing_skills, ai_explanation, computed_at)
                            VALUES (?, ?, ?, ?, 88, 90, 85, 84, 90, 80, '["Python", "FastAPI", "React"]', '["Docker"]', 'Candidate shows high relevance for the role.', datetime('now'))""",
                         (ms_id, app_id, job_id, cand["id"]))
            
            conn.commit()
            conn.close()
            return self._json_response({"id": app_id, "job_id": job_id, "status": "applied"})

        elif path.startswith("/api/v1/resumes/upload"):
            user = self._get_auth_user()
            if not user or user["role"] != "candidate":
                return self._json_response({"detail": "Unauthorized"}, 401)
            conn = get_db_connection()
            cand = conn.execute("SELECT * FROM candidate_profiles WHERE user_id = ?", (user["id"],)).fetchone()
            if not cand:
                conn.close()
                return self._json_response({"detail": "Profile not found"}, 404)
            
            r_id = str(uuid.uuid4())
            conn.execute("INSERT INTO resumes (id, candidate_id, file_name, file_type, raw_text, status, uploaded_at) VALUES (?, ?, 'Uploaded_Resume.pdf', 'pdf', 'Extracted Resume Content', 'complete', datetime('now'))",
                         (r_id, cand["id"]))
            
            an_id = str(uuid.uuid4())
            suggestions = json.dumps(["Highlight DevOps (Docker/AWS) skills", "Quantify measurable impact in projects"])
            extracted_exp = json.dumps([{"role": "Full-Stack Engineer", "company": "TechCorp", "duration": "2022 - Present", "description": "Built Python and React web applications."}])
            extracted_edu = json.dumps([{"degree": "B.S. Computer Science", "institution": "University", "year": "2021"}])
            extracted_proj = json.dumps([{"name": "HireSense AI", "tech": "Python, React, FastAPI", "description": "AI Resume Matcher"}])
            
            conn.execute("""INSERT INTO ai_analysis (id, resume_id, overall_score, ats_score, skills_score, experience_score, projects_score, education_score, formatting_score, suggestions, extracted_education, extracted_experience, extracted_projects, created_at)
                            VALUES (?, ?, 92, 90, 94, 88, 92, 95, 90, ?, ?, ?, ?, datetime('now'))""",
                         (an_id, r_id, suggestions, extracted_edu, extracted_exp, extracted_proj))
            
            conn.commit()
            conn.close()
            return self._json_response({"id": r_id, "status": "complete", "file_name": "Uploaded_Resume.pdf"})

        else:
            return self._json_response({"detail": "Not found"}, 404)

    def do_PATCH(self):
        parsed = urlparse(self.path)
        path = parsed.path
        body = self._parse_json_body()

        if "/api/v1/applications/" in path and path.endswith("/status"):
            app_id = path.split("/")[-2]
            new_status = body.get("status", "under_review")
            conn = get_db_connection()
            conn.execute("UPDATE applications SET status = ?, updated_at = datetime('now') WHERE id = ?", (new_status, app_id))
            conn.commit()
            conn.close()
            return self._json_response({"id": app_id, "status": new_status})

        return self._json_response({"detail": "Not found"}, 404)

def run(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, HireSenseRequestHandler)
    print(f"[+] HireSense AI Backend HTTP Server running on http://127.0.0.1:{port}")
    httpd.serve_forever()

if __name__ == '__main__':
    port = 8000
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    run(port)
