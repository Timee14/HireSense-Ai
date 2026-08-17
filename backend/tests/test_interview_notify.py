import urllib.request
import json

# 1. Login as recruiter
login_data = json.dumps({'email': 'recruiter@techinnovations.com', 'password': 'password123'}).encode()
req = urllib.request.Request(
    'http://127.0.0.1:8000/api/v1/auth/login',
    data=login_data,
    headers={'Content-Type': 'application/json'}
)
res = urllib.request.urlopen(req)
rec_token = json.loads(res.read().decode())['access_token']

# 2. Get recruiter jobs
req = urllib.request.Request(
    'http://127.0.0.1:8000/api/v1/jobs/recruiter/my-jobs',
    headers={'Authorization': f'Bearer {rec_token}'}
)
res = urllib.request.urlopen(req)
jobs = json.loads(res.read().decode())
job_id = jobs[0]['id']

# 3. Get applicants for the job
req = urllib.request.Request(
    f'http://127.0.0.1:8000/api/v1/applications/job/{job_id}',
    headers={'Authorization': f'Bearer {rec_token}'}
)
res = urllib.request.urlopen(req)
apps = json.loads(res.read().decode())
print(f"[+] Found {len(apps)} applicants for job: {jobs[0]['title']}")
target_app = apps[0]
print(f"[+] Target Candidate: {target_app['candidate_name']} ({target_app['candidate_email']})")

# 4. Schedule Interview & Dispatch Gmail / In-App Notification
schedule_data = json.dumps({
    'application_id': target_app['id'],
    'interview_type': 'Technical Round 1 (Live Coding & Architecture)',
    'scheduled_at': 'Tomorrow at 2:00 PM EST',
    'location_or_link': 'https://meet.google.com/hms-alex-meet',
    'notes': 'Looking forward to discussing your background in Python, FastAPI, and React!'
}).encode()

req = urllib.request.Request(
    'http://127.0.0.1:8000/api/v1/interviews/schedule',
    data=schedule_data,
    headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {rec_token}'
    }
)
res = urllib.request.urlopen(req)
invite_resp = json.loads(res.read().decode())
print("[+] Interview Invitation Dispatched Successfully:")
print(f"  - Interview ID: {invite_resp['interview_id']}")
print(f"  - Candidate Email: {invite_resp['candidate_email']}")
print(f"  - Google Meet Link: {invite_resp['location_or_link']}")
print(f"  - Gmail Compose URL: {invite_resp['gmail_url'][:80]}...")

# 5. Login as Candidate (Alex Chen) and verify received notification in Mailbox
login_cand = json.dumps({'email': target_app['candidate_email'], 'password': 'password123'}).encode()
req = urllib.request.Request(
    'http://127.0.0.1:8000/api/v1/auth/login',
    data=login_cand,
    headers={'Content-Type': 'application/json'}
)
res = urllib.request.urlopen(req)
cand_token = json.loads(res.read().decode())['access_token']

req = urllib.request.Request(
    'http://127.0.0.1:8000/api/v1/notifications',
    headers={'Authorization': f'Bearer {cand_token}'}
)
res = urllib.request.urlopen(req)
notifs = json.loads(res.read().decode())
print(f"\n[+] Candidate Mailbox contains {len(notifs)} notification(s):")
for n in notifs[:2]:
    print(f"  * [{n['type'].upper()}] {n['parsed_data'].get('title')}")
    print(f"    Company: {n['parsed_data'].get('company_name')} | Meet: {n['parsed_data'].get('location_or_link')}")
    print(f"    Notes: {n['parsed_data'].get('notes')}")
