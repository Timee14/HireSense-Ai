from typing import List

def generate_match_explanation(
    overall_score: int,
    matched_skills: List[str],
    missing_skills: List[str],
    job_title: str,
    candidate_name: str = "The candidate"
) -> str:
    """
    Generates a clear 2-3 sentence AI match explanation based on match breakdown.
    """
    matched_str = ", ".join(matched_skills[:4]) if matched_skills else "core technical fundamentals"
    missing_str = ", ".join(missing_skills[:3]) if missing_skills else "none"

    if overall_score >= 85:
        explanation = (
            f"{candidate_name} is an exceptional match ({overall_score}%) for the {job_title} role. "
            f"Strong technical alignment in {matched_str}. "
            f"Experience level and background closely align with role requirements."
        )
    elif overall_score >= 70:
        explanation = (
            f"{candidate_name} shows strong potential ({overall_score}%) for {job_title}. "
            f"Demonstrates solid proficiency in {matched_str}. "
            + (f"Bridging gaps in {missing_str} will make them a top-tier candidate." if missing_skills else "Good overall domain fit.")
        )
    else:
        explanation = (
            f"{candidate_name} meets basic qualification thresholds ({overall_score}%) for {job_title}. "
            f"Matches core skills like {matched_str}, but lacks key required competencies in {missing_str}."
        )

    return explanation
