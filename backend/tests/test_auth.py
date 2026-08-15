import unittest
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token, decode_token

class TestAuthSecurity(unittest.TestCase):

    def test_password_hashing(self):
        password = "secret_password_123"
        hashed = get_password_hash(password)
        self.assertNotEqual(password, hashed)
        self.assertTrue(verify_password(password, hashed))
        self.assertFalse(verify_password("wrong_password", hashed))

    def test_jwt_access_token(self):
        user_id = "test-user-uuid-123"
        role = "candidate"
        token = create_access_token(subject=user_id, role=role)
        
        decoded = decode_token(token)
        self.assertEqual(decoded["sub"], user_id)
        self.assertEqual(decoded["role"], role)
        self.assertEqual(decoded["type"], "access")

    def test_jwt_refresh_token(self):
        user_id = "test-user-uuid-456"
        role = "recruiter"
        token = create_refresh_token(subject=user_id, role=role)
        
        decoded = decode_token(token)
        self.assertEqual(decoded["sub"], user_id)
        self.assertEqual(decoded["role"], role)
        self.assertEqual(decoded["type"], "refresh")

if __name__ == "__main__":
    unittest.main()
