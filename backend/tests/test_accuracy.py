import sys
import os

backend_dir = os.path.abspath(os.path.dirname(__file__))
root_dir = os.path.abspath(os.path.join(backend_dir, "..", ".."))
sys.path.insert(0, root_dir)

from ai.extraction.info_extractor import extract_structured_resume

resume_text = """ANUBHAW GUPTA
Noida, Uttar Pradesh | +91 8292519740 | anubhaw@gmail.com | GitHub: Anubhaw1234 | LeetCode: Anubhaw Gupta
PROFESSIONAL SUMMARY
Computer Science undergraduate (CGPA: 7.6) with a strong foundation in Data Structures & Algorithms and problem solving. Solved 400+ DSA problems on LeetCode (max rating 1511) and achieved a maximum Codeforces rating of 900. Proficient in C++, Python, JavaScript, and SQL with hands on experience developing Python applications and introductory machine learning projects. Currently expanding knowledge in Machine Learning while strengthening software development skills.
EDUCATION
JSS Academy of Technical Education, Noida (2023-2027)
B. Tech | Computer Science & Engineering | CGPA: 7.6
H/S Ram Chandrapur (2020-2022)
DAV Public School (2018-2020)
TECHNICAL SKILLS
Languages: C++, Python, JavaScript, SQL
Web Development: HTML5, CSS3, JavaScript, TypeScript, React, Next.js, Tailwind CSS
Machine Learning: NumPy, Pandas, Matplotlib, Scikit-learn
Core CS: DSA, OOP, DBMS, OS, CN
Tools: Git, GitHub, VS Code, REST APIs
PROJECTS
Gemini Clone
Tech Stack: React, JavaScript, Gemini API
- Built a conversational AI chat application replicating Google Gemini interface, delivering real-time, context-aware responses via API integration.
RailGaadi
Tech Stack: Next.js, TypeScript, Tailwind CSS
- Developed responsive train tracking frontend interface.
"""

analysis = extract_structured_resume(resume_text)
print("[+] Anubhaw Gupta Calibrated Score Analysis:")
print(f"Overall ATS Score: {analysis['overall_score']} / 100")
print(f"Score Tier: {analysis['score_tier']}")
print(f"Career Level: {analysis['career_level']}")
print(f"  - Impact & Outcomes Score: {analysis['impact_score']}%")
print(f"  - Experience Depth Score: {analysis['experience_score']}%")
print(f"  - Skills Coverage Score: {analysis['skills_score']}%")
print(f"  - Action Verb Score: {analysis['action_verb_score']}%")
print(f"  - Formatting & Structure Score: {analysis['formatting_score']}%")

print("\nSeniority-Calibrated Role Ratings:")
for r in analysis['role_ratings']:
    print(f"  - {r['role']}: {r['rating']}% ({r['match_level']})")

print("\nRecruiter Checks Breakdown:")
for c in analysis['recruiter_checks']:
    print(f"  * [{c['status'].upper()}] {c['category']} ({c['score']}%): {c['summary']}")
