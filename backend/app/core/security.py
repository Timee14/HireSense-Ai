import hmac
import hashlib
import base64
import json
import time
from typing import Any, Union, Optional
from app.core.config import settings

def get_password_hash(password: str) -> str:
    salt = "hiresense_static_salt_2026"
    return hashlib.sha256((password + salt).encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return get_password_hash(plain_password) == hashed_password

def _b64_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('utf-8')

def _b64_decode(data: str) -> bytes:
    padding = '=' * (4 - (len(data) % 4))
    return base64.urlsafe_b64encode(data.encode('utf-8') + padding.encode('utf-8'))

def create_access_token(subject: Union[str, Any], role: str, expires_delta: Optional[Any] = None) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    now = int(time.time())
    expire = now + (settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    
    payload = {
        "sub": str(subject),
        "role": role,
        "type": "access",
        "iat": now,
        "exp": expire
    }

    header_b64 = _b64_encode(json.dumps(header).encode('utf-8'))
    payload_b64 = _b64_encode(json.dumps(payload).encode('utf-8'))

    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    signature = hmac.new(settings.SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
    sig_b64 = _b64_encode(signature)

    return f"{header_b64}.{payload_b64}.{sig_b64}"

def create_refresh_token(subject: Union[str, Any], role: str) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    now = int(time.time())
    expire = now + (7 * 24 * 3600)  # 7 days
    
    payload = {
        "sub": str(subject),
        "role": role,
        "type": "refresh",
        "iat": now,
        "exp": expire
    }

    header_b64 = _b64_encode(json.dumps(header).encode('utf-8'))
    payload_b64 = _b64_encode(json.dumps(payload).encode('utf-8'))

    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    signature = hmac.new(settings.SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
    sig_b64 = _b64_encode(signature)

    return f"{header_b64}.{payload_b64}.{sig_b64}"

def decode_token(token: str) -> dict:
    parts = token.split('.')
    if len(parts) != 3:
        raise ValueError("Invalid token format")
    
    header_b64, payload_b64, sig_b64 = parts
    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    expected_sig = hmac.new(settings.SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
    
    if _b64_encode(expected_sig) != sig_b64:
        raise ValueError("Invalid signature")

    padding = '=' * ((4 - len(payload_b64) % 4) % 4)
    payload_json = base64.urlsafe_b64decode((payload_b64 + padding).encode('utf-8')).decode('utf-8')
    payload = json.loads(payload_json)

    if payload.get("exp") and time.time() > payload["exp"]:
        raise ValueError("Token expired")

    return payload

