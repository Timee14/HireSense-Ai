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

# 2. Get all applications
req = urllib.request.Request(
    'http://127.0.0.1:8000/api/v1/applications/recruiter/all',
    headers={'Authorization': f'Bearer {rec_token}'}
)
res = urllib.request.urlopen(req)
apps = json.loads(res.read().decode())
print(f"[+] Loaded {len(apps)} total applications across all jobs:")

for a in apps:
    app_id = a['id']
    cand_name = a['candidate_name']

    # Test Shortlisting
    patch_data = json.dumps({'status': 'shortlisted'}).encode()
    req = urllib.request.Request(
        f'http://127.0.0.1:8000/api/v1/applications/{app_id}/status',
        data=patch_data,
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {rec_token}'},
        method='PATCH'
    )
    res = urllib.request.urlopen(req)
    updated = json.loads(res.read().decode())
    print(f"  * Updated {cand_name} (ID: {app_id[:8]}) -> status: {updated.get('status')}")

    # Test moving to under_review
    patch_data2 = json.dumps({'status': 'under_review'}).encode()
    req2 = urllib.request.Request(
        f'http://127.0.0.1:8000/api/v1/applications/{app_id}/status',
        data=patch_data2,
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {rec_token}'},
        method='PATCH'
    )
    res2 = urllib.request.urlopen(req2)
    updated2 = json.loads(res2.read().decode())
    print(f"  * Re-updated {cand_name} -> status: {updated2.get('status')}")

print("\n[+] All application pipeline stage status updates succeeded with 0 lock errors!")
