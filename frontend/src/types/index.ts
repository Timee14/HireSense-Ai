export interface User {
  id: string;
  email: string;
  role: 'candidate' | 'recruiter';
  name?: string;
}

export interface CandidateProfile {
  id: string;
  full_name: string;
  phone?: string;
  location?: string;
  headline?: string;
  profile_completion_pct: number;
}

export interface RecruiterProfile {
  id: string;
  company_name: string;
  company_website?: string;
}

export interface AIAnalysis {
  id: string;
  overall_score: number;
  ats_score: number;
  skills_score: number;
  experience_score: number;
  projects_score: number;
  education_score: number;
  formatting_score: number;
  suggestions?: string[];
  extracted_education?: any[];
  extracted_experience?: any[];
  extracted_projects?: any[];
  extracted_certifications?: any[];
}

export interface Resume {
  id: string;
  candidate_id: string;
  file_name: string;
  file_type: string;
  status: string;
  uploaded_at: string;
  analysis?: AIAnalysis;
}

export interface JobCreate {
  title: string;
  location?: string;
  employment_type?: string;
  experience_level?: string;
  salary_range?: string;
  description: string;
  required_skills?: string[];
  preferred_skills?: string[];
}

export interface Job {
  id: string;
  recruiter_id: string;
  title: string;
  location: string;
  employment_type: string;
  experience_level: string;
  salary_range?: string;
  description: string;
  responsibilities?: string[];
  status: string;
  created_at: string;
  company_name?: string;
  applicant_count?: number;
  required_skills?: string[];
  preferred_skills?: string[];
}

export interface MatchBreakdown {
  overall_score: number;
  skills_score: number;
  experience_score: number;
  projects_score: number;
  education_score: number;
  certifications_score: number;
  matched_skills: string[];
  missing_skills: string[];
  ai_explanation: string;
}

export interface JobRecommendation {
  job: Job;
  match_details: MatchBreakdown;
}

export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  status: 'applied' | 'under_review' | 'shortlisted' | 'interview' | 'offer' | 'rejected';
  applied_at: string;
  job?: Job;
  candidate_name?: string;
  candidate_headline?: string;
  match_score?: MatchBreakdown;
}

export interface RecruiterAnalytics {
  kpis: {
    total_jobs: number;
    active_jobs: number;
    total_applicants: number;
    shortlisted_count: number;
    interview_count: number;
    avg_match_score: number;
  };
  pipeline_stages: Record<string, number>;
}
