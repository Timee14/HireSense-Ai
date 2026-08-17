import urllib.request
import json

# 1. Login as candidate
login_data = json.dumps({'email': 'alex.dev@example.com', 'password': 'password123'}).encode()
req = urllib.request.Request(
    'http://127.0.0.1:8000/api/v1/auth/login',
    data=login_data,
    headers={'Content-Type': 'application/json'}
)
res = urllib.request.urlopen(req)
token = json.loads(res.read().decode())['access_token']

# 2. Upload Anubhaw Gupta resume
boundary = '----WebKitFormBoundaryAnubhaw'
anubhaw_resume = """ANUBHAW GUPTA
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

header_part = (
    f'--{boundary}\r\n'
    f'Content-Disposition: form-data; name="file"; filename="Anubhaw_Gupta_Resume.pdf"\r\n'
    f'Content-Type: application/pdf\r\n\r\n'
).encode('latin1')
footer_part = f'\r\n--{boundary}--\r\n'.encode('latin1')
body = header_part + anubhaw_resume.encode('utf-8') + footer_part

upload_req = urllib.request.Request(
    'http://127.0.0.1:8000/api/v1/resumes/upload',
    data=body,
    headers={
        'Content-Type': f'multipart/form-data; boundary={boundary}',
        'Authorization': f'Bearer {token}'
    }
)
upload_res = urllib.request.urlopen(upload_req)
resp_data = json.loads(upload_res.read().decode())
print('[+] Uploaded and evaluated Anubhaw Gupta Resume:')
print(f"Overall ATS Score: {resp_data['analysis']['overall_score']} / 100")
print(f"Score Tier: {resp_data['analysis']['score_tier']}")
print(f"Career Level: {resp_data['analysis']['career_level']}")
print(f"Impact Score: {resp_data['analysis']['impact_score']}%")
print(f"Experience Score: {resp_data['analysis']['experience_score']}%")
print(f"Skills Score: {resp_data['analysis']['skills_score']}%")
print(f"Action Verbs Score: {resp_data['analysis']['action_verb_score']}%")
print(f"Formatting Score: {resp_data['analysis']['formatting_score']}%")

print('\nRecruiter Checks:')
for c in resp_data['analysis']['recruiter_checks']:
    print(f"  * [{c['status'].upper()}] {c['category']} ({c['score']}%): {c['summary']}")

print('\nRole Ratings:')
for r in resp_data['analysis']['role_ratings']:
    print(f"  - {r['role']}: {r['rating']}% ({r['match_level']})")
