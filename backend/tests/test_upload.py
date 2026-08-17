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
auth = json.loads(res.read().decode())
token = auth['access_token']
print('[+] Logged in successfully. Token received.')

# 2. Upload full resume document
boundary = '----WebKitFormBoundaryFull123'
resume_text = """Alex Chen - Senior Full-Stack Engineer
Email: alex.dev@example.com | Phone: +1 (555) 234-5678 | Location: San Francisco, CA
Summary: Senior Full-Stack Engineer with 6+ years of experience architecting microservices and web apps.
Technical Skills: Python, FastAPI, React, TypeScript, JavaScript, PostgreSQL, Docker, AWS, Redis, GraphQL, Git, CI/CD, Machine Learning, PyTorch, System Design, SQL.
Experience:
Senior Full Stack Engineer at Tech Innovations Inc. (2022 - Present)
- Architected high-throughput microservices using Python FastAPI, React, PostgreSQL, and Redis.
- Improved database query latency by 45% and scaled system to 100k daily active users.
- Designed CI/CD deployment pipelines on AWS with Docker.
Software Engineer at DataScale Inc. (2020 - 2022)
- Developed RESTful APIs and optimized React frontend state management.
Education:
Bachelor of Science in Computer Science, State University (2020)
"""

header_part = (
    f'--{boundary}\r\n'
    f'Content-Disposition: form-data; name="file"; filename="Alex_Chen_Senior_FullStack_Resume.pdf"\r\n'
    f'Content-Type: application/pdf\r\n\r\n'
).encode('latin1')
footer_part = f'\r\n--{boundary}--\r\n'.encode('latin1')
body = header_part + resume_text.encode('utf-8') + footer_part

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
print('[+] Upload & AI Parsing succeeded!')
print('  File:', resp_data.get('file_name'))
print('  Overall ATS Score:', resp_data.get('analysis', {}).get('overall_score'))
print('  Extracted Skills:', resp_data.get('analysis', {}).get('extracted_skills'))
print('  Role Ratings:')
for r in resp_data.get('analysis', {}).get('role_ratings', []):
    print(f"    - {r.get('role')}: {r.get('rating')}% ({r.get('match_level')})")

# 3. Check recommendations (best fit jobs)
rec_req = urllib.request.Request(
    'http://127.0.0.1:8000/api/v1/candidates/me/recommendations',
    headers={'Authorization': f'Bearer {token}'}
)
rec_res = urllib.request.urlopen(rec_req)
recs = json.loads(rec_res.read().decode())
print(f'[+] Ranked Best-Fit Jobs for uploaded resume:')
for rec in recs[:4]:
    print(f"  * {rec['job']['title']} at {rec['job'].get('company_name')} -> {rec['match_details']['overall_score']}% Match")
    print(f"    Matched Skills: {rec['match_details']['matched_skills']}")
