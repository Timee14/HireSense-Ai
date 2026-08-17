from typing import Dict, Any, List
from ai.embeddings.embedder import compute_cosine_similarity
from ai.extraction.info_extractor import SKILL_SYNONYMS

def normalize_skill(skill_name: str) -> str:
    """Normalize any skill or alias (e.g., 'Fast API' -> 'FastAPI', 'React.js' -> 'React') to its canonical form."""
    if not skill_name:
        return ""
    s_upper = skill_name.upper().strip()
    for canonical_name, synonyms in SKILL_SYNONYMS.items():
        if s_upper == canonical_name.upper():
            return canonical_name
        for syn in synonyms:
            if s_upper == syn or syn == s_upper.replace(" ", "") or syn == s_upper.replace("-", ""):
                return canonical_name
    return skill_name.strip()

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
    Computes multi-dimensional match score between a candidate resume and job posting
    with robust skill synonym and alias normalization.
    """
    # Normalize candidate skills
    norm_cand_skills = set()
    for s in (candidate_skills or []):
        norm = normalize_skill(s)
        if norm:
            norm_cand_skills.add(norm.upper())
        norm_cand_skills.add(s.upper().strip())
        norm_cand_skills.add(s.upper().replace(" ", ""))
        norm_cand_skills.add(s.upper().replace("-", ""))

    matched = []
    missing = []

    # Check required skills
    req_matches = 0
    for req in job_required_skills:
        req_norm = normalize_skill(req)
        req_clean = req.upper().replace(" ", "").replace("-", "")
        if (req_norm.upper() in norm_cand_skills or
            req.upper() in norm_cand_skills or
            req_clean in norm_cand_skills or
            any(req_norm.upper() in s for s in norm_cand_skills)):
            matched.append(req)
            req_matches += 1
        else:
            missing.append(req)

    # Check preferred skills
    pref_matches = 0
    for pref in job_preferred_skills:
        pref_norm = normalize_skill(pref)
        pref_clean = pref.upper().replace(" ", "").replace("-", "")
        if (pref_norm.upper() in norm_cand_skills or
            pref.upper() in norm_cand_skills or
            pref_clean in norm_cand_skills or
            any(pref_norm.upper() in s for s in norm_cand_skills)):
            if pref not in matched:
                matched.append(pref)
            pref_matches += 1

    total_req = len(job_required_skills) or 1
    total_pref = len(job_preferred_skills) or 1

    skills_score = int(min(100, (req_matches / total_req * 80) + (pref_matches / total_pref * 20)))
    if req_matches == len(job_required_skills) and len(job_required_skills) > 0:
        skills_score = max(skills_score, 95)

    # Semantic embedding vector similarity
    vector_sim = compute_cosine_similarity(candidate_embedding, job_embedding) if candidate_embedding and job_embedding else 0.88
    semantic_score = int(vector_sim * 100)

    # Category sub-scores derived from candidate AI analysis
    experience_score = candidate_analysis.get("experience_score", 80) if candidate_analysis else 75
    projects_score = candidate_analysis.get("projects_score", 85) if candidate_analysis else 80
    education_score = candidate_analysis.get("education_score", 88) if candidate_analysis else 85
    certifications_score = 85 if matched else 70

    # Weighted Overall Score Calculation
    overall_score = int(
        (skills_score * 0.35) +
        (semantic_score * 0.25) +
        (experience_score * 0.20) +
        (projects_score * 0.10) +
        (education_score * 0.10)
    )

    overall_score = max(40, min(99, overall_score))

    return {
        "overall_score": overall_score,
        "skills_score": skills_score,
        "experience_score": experience_score,
        "projects_score": projects_score,
        "education_score": education_score,
        "certifications_score": certifications_score,
        "matched_skills": list(dict.fromkeys(matched)),
        "missing_skills": list(dict.fromkeys(missing))
    }
