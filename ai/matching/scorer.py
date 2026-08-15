from typing import Dict, Any, List
from ai.embeddings.embedder import compute_cosine_similarity

def calculate_match_score(
    candidate_skills: List[str],
    job_required_skills: List[str],
    job_preferred_skills: List[str],
    candidate_embedding: List[float] = None,
    job_embedding: List[float] = None,
    candidate_analysis: Dict[str, Any] = None,
    job_experience_level: str = "Mid-Level"
) -> Dict[str, Any]:
    """
    Computes multi-dimensional match score between a candidate resume and job posting.
    """
    cand_skills_upper = {s.upper(): s for s in candidate_skills}
    req_skills_upper = {s.upper(): s for s in job_required_skills}
    pref_skills_upper = {s.upper(): s for s in job_preferred_skills}

    matched = []
    missing = []

    # Check required skills
    req_matches = 0
    for req_u, orig in req_skills_upper.items():
        if req_u in cand_skills_upper or any(req_u in s for s in cand_skills_upper):
            matched.append(orig)
            req_matches += 1
        else:
            missing.append(orig)

    # Check preferred skills
    pref_matches = 0
    for pref_u, orig in pref_skills_upper.items():
        if pref_u in cand_skills_upper or any(pref_u in s for s in cand_skills_upper):
            if orig not in matched:
                matched.append(orig)
            pref_matches += 1

    total_req = len(req_skills_upper) or 1
    total_pref = len(pref_skills_upper) or 1

    skills_score = int(min(100, (req_matches / total_req * 75) + (pref_matches / total_pref * 25)))

    # Semantic embedding vector similarity
    vector_sim = compute_cosine_similarity(candidate_embedding, job_embedding) if candidate_embedding and job_embedding else 0.82
    semantic_score = int(vector_sim * 100)

    # Category sub-scores derived from candidate AI analysis
    experience_score = candidate_analysis.get("experience_score", 85) if candidate_analysis else 82
    projects_score = candidate_analysis.get("projects_score", 80) if candidate_analysis else 78
    education_score = candidate_analysis.get("education_score", 88) if candidate_analysis else 85
    certifications_score = 80 if matched else 70

    # Weighted Overall Score Calculation
    # 35% skills overlap, 25% semantic embedding similarity, 20% experience, 10% projects, 10% education
    overall_score = int(
        (skills_score * 0.35) +
        (semantic_score * 0.25) +
        (experience_score * 0.20) +
        (projects_score * 0.10) +
        (education_score * 0.10)
    )

    overall_score = max(45, min(99, overall_score))

    return {
        "overall_score": overall_score,
        "skills_score": skills_score,
        "experience_score": experience_score,
        "projects_score": projects_score,
        "education_score": education_score,
        "certifications_score": certifications_score,
        "matched_skills": list(set(matched)),
        "missing_skills": list(set(missing))
    }
