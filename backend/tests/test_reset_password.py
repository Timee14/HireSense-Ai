import urllib.request
import json

reset_data = json.dumps({
    'email': 'gamesshreyansh69@gmail.com',
    'new_password': 'myNewPassword123'
}).encode()

req = urllib.request.Request(
    'http://127.0.0.1:8000/api/v1/auth/reset-password',
    data=reset_data,
    headers={'Content-Type': 'application/json'}
)
res = urllib.request.urlopen(req)
resp = json.loads(res.read().decode())
print('[+] Password Reset Response:')
print('  - Message:', resp.get('message'))
print('  - User Email:', resp.get('email'))
print('  - Role:', resp.get('role'))
print('  - Access Token:', resp.get('access_token')[:40], '...')

# Verify login with new password
login_data = json.dumps({
    'email': 'gamesshreyansh69@gmail.com',
    'password': 'myNewPassword123'
}).encode()

req2 = urllib.request.Request(
    'http://127.0.0.1:8000/api/v1/auth/login',
    data=login_data,
    headers={'Content-Type': 'application/json'}
)
res2 = urllib.request.urlopen(req2)
login_resp = json.loads(res2.read().decode())
print('[+] Immediate Login with New Password Succeeded:')
print('  - User Email:', login_resp.get('email'))
print('  - Candidate Name:', login_resp.get('name'))
