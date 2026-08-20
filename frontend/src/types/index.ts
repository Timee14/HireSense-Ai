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

export interface RoleRating {
  role: string;
  rating: number;
  match_level?: string;
  level?: string;
  key_fit?: string;
  fit?: string;
}

export interface RecruiterCheck {
  id: string;
  category: string;
  title: string;
  status: 'passed' | 'warning' | 'critical';
  score: number;
  issue_count: number;
  summary: string;
  fix: string;
}

export interface ScoreBoostItem {
  points: string;
  action: string;
  detail: string;
}

export interface AIAnalysis {
  id: string;
  overall_score: number;
  score_tier?: string;
  tier_color?: string;
  career_level?: string;
  ats_score: number;
  impact_score?: number;
  experience_score: number;
  skills_score: number;
  action_verb_score?: number;
  projects_score?: number;
  education_score?: number;
  formatting_score: number;
  extracted_skills?: string[];
  role_ratings?: RoleRating[];
  recruiter_checks?: RecruiterCheck[];
  score_boost_roadmap?: ScoreBoostItem[];
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
  raw_text?: string;
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

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'behavioral' | 'technical' | 'problem_solving' | 'system_design' | 'leadership';
  difficulty: 'entry' | 'mid' | 'senior';
  key_competencies: string[];
  sample_response: {
    star_situation?: string;
    star_task?: string;
    star_action?: string;
    star_result?: string;
    full_sample: string;
    chatgpt_tip: string;
    claude_tip: string;
    gemini_tip: string;
  };
}

export interface MultiAIEvaluation {
  overall_score: number; // 0-100
  clarity_score: number;
  technical_depth_score: number;
  star_structure_score: number;
  relevance_score: number;
  chatgpt_review: {
    model: string;
    summary: string;
    strengths: string[];
    improvements: string[];
    fluency_rating: string;
    verdict: string;
  };
  claude_review: {
    model: string;
    summary: string;
    strengths: string[];
    improvements: string[];
    depth_rating: string;
    verdict: string;
  };
  gemini_review: {
    model: string;
    summary: string;
    matched_skills: string[];
    missing_keywords: string[];
    upskill_action: string;
    verdict: string;
  };
  upskilling_recommendations: {
    topic: string;
    priority: 'high' | 'medium' | 'low';
    resource_type: string;
    actionable_step: string;
  }[];
}

export interface InterviewAnswer {
  question_id: string;
  question_text: string;
  user_answer: string;
  audio_duration_seconds: number;
  skipped: boolean;
  evaluation?: MultiAIEvaluation;
}

export interface InterviewSession {
  id: string;
  candidate_id?: string;
  role_title: string;
  job_description: string;
  total_questions: number;
  completed_at: string;
  average_score: number;
  answers: InterviewAnswer[];
  top_strengths: string[];
  priority_upskill_areas: string[];
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: string;
  message: string;
  is_read: number;
  created_at: string;
  parsed_data?: {
    title?: string;
    job_title?: string;
    company_name?: string;
    scheduled_at?: string;
    location_or_link?: string;
    notes?: string;
    interview_type?: string;
    candidate_email?: string;
    gmail_url?: string;
    status?: string;
  };
}

export interface InterviewScheduleRequest {
  application_id: string;
  interview_type?: string;
  scheduled_at: string;
  location_or_link?: string;
  notes?: string;
  send_email?: boolean;
}

export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  status: 'applied' | 'under_review' | 'shortlisted' | 'interview' | 'offer' | 'rejected';
  applied_at: string;
  job?: Job;
  job_title?: string;
  company_name?: string;
  candidate_name?: string;
  candidate_headline?: string;
  candidate_email?: string;
  candidate_phone?: string;
  candidate_location?: string;
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
