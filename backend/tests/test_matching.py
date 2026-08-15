import unittest
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from ai.matching.scorer import calculate_match_score
from ai.matching.explainer import generate_match_explanation

class TestMatchingEngine(unittest.TestCase):

    def test_match_score_calculation(self):
        cand_skills = ["Python", "FastAPI", "React", "PostgreSQL"]
        job_req_skills = ["Python", "FastAPI", "PostgreSQL", "Kubernetes"]
        job_pref_skills = ["Docker", "AWS"]

        cand_text = "Experienced Senior Python Engineer with FastAPI and React skills. Built microservices."
        job_text = "Looking for Senior Python Developer with FastAPI expertise and database skills."

        result = calculate_match_score(
            candidate_skills=cand_skills,
            job_required_skills=job_req_skills,
            job_preferred_skills=job_pref_skills,
            candidate_embedding=None,
            job_embedding=None,
            candidate_analysis=None,
            job_experience_level="Mid-Level"
        )

        self.assertGreaterEqual(result["overall_score"], 0)
        self.assertLessEqual(result["overall_score"], 100)
        self.assertIn("Python", result["matched_skills"])
        self.assertIn("Kubernetes", result["missing_skills"])

    def test_explanation_generation(self):
        matched_skills = ["Python", "FastAPI", "PostgreSQL"]
        missing_skills = ["Docker"]
        explanation = generate_match_explanation(
            overall_score=88,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            job_title="Senior Python Developer"
        )
        self.assertIn("Python", explanation)
        self.assertIsInstance(explanation, str)

if __name__ == "__main__":
    unittest.main()
