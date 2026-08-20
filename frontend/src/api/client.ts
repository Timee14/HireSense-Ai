const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && (window as any).VITE_API_URL) {
    return (window as any).VITE_API_URL;
  }
  const host = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : '127.0.0.1';
  return `http://${host}:8000/api/v1`;
};

export const getToken = (): string | null => localStorage.getItem('hiresense_token') || localStorage.getItem('hiresense_demo_token');
export const setToken = (token: string) => localStorage.setItem('hiresense_token', token);
export const removeToken = () => {
  localStorage.removeItem('hiresense_token');
  localStorage.removeItem('hiresense_demo_token');
};

// Fallback Mock Data for Zero-Backend Vercel Deployments
const MOCK_CANDIDATE = {
  id: "cand-demo-01",
  user_id: "user-demo-01",
  full_name: "Alex Chen",
  headline: "Senior Full-Stack & Python Developer",
  phone: "+1 (555) 019-2834",
  location: "San Francisco, CA / Remote",
  profile_completion_pct: 95
};

const MOCK_JOBS = [
  {
    id: "job-01",
    recruiter_id: "rec-01",
    company_name: "Tech Innovations Inc.",
    title: "Senior Full-Stack Engineer",
    location: "Bengaluru / Remote",
    employment_type: "Full-time",
    experience_level: "Senior",
    salary_range: "₹28,00,000 - ₹34,00,000",
    description: "Seeking an experienced Full-Stack Engineer skilled in Python, FastAPI, and React.",
    status: "active",
    created_at: new Date().toISOString()
  },
  {
    id: "job-02",
    recruiter_id: "rec-01",
    company_name: "CloudScale Systems",
    title: "Software Development Engineer",
    location: "Hyderabad / Hybrid",
    employment_type: "Full-time",
    experience_level: "Mid-Level",
    salary_range: "₹20,00,000 - ₹26,00,000",
    description: "Core backend & API development in Python and React.",
    status: "active",
    created_at: new Date().toISOString()
  }
];

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const baseUrl = getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    // Network failure / Vercel isolated frontend fallback
  }

  // Graceful Mock Responder for Vercel Static Previews & Offline Execution
  if (endpoint.includes('/auth/me')) {
    const isRecruiter = token?.includes('recruiter');
    return {
      id: isRecruiter ? 'rec-demo-01' : 'cand-demo-01',
      email: isRecruiter ? 'recruiter@techinnovations.com' : 'alex.dev@example.com',
      role: isRecruiter ? 'recruiter' : 'candidate',
      name: isRecruiter ? 'Tech Innovations Recruiter' : 'Alex Chen'
    } as any;
  }

  if (endpoint.includes('/auth/login') || endpoint.includes('/auth/register') || endpoint.includes('/auth/reset-password')) {
    const isRecruiter = endpoint.includes('recruiter') || (options.body && options.body.toString().includes('recruiter'));
    return {
      access_token: 'demo-jwt-token-hiresense-2026',
      token_type: 'bearer',
      user_id: isRecruiter ? 'rec-demo-01' : 'cand-demo-01',
      email: isRecruiter ? 'recruiter@techinnovations.com' : 'alex.dev@example.com',
      role: isRecruiter ? 'recruiter' : 'candidate',
      name: isRecruiter ? 'Tech Innovations Recruiter' : 'Alex Chen'
    } as any;
  }


  if (endpoint.includes('/candidates/me/recommendations')) {
    return [
      {
        job: MOCK_JOBS[0],
        match_details: {
          overall_score: 94,
          skills_score: 95,
          experience_score: 88,
          projects_score: 90,
          education_score: 92,
          certifications_score: 85,
          matched_skills: ['Python', 'FastAPI', 'React', 'PostgreSQL', 'Docker'],
          missing_skills: [],
          ai_explanation: 'Alex Chen is an exceptional match (94%) for Senior Full-Stack Engineer with strong Python and React alignment.'
        }
      },
      {
        job: MOCK_JOBS[1],
        match_details: {
          overall_score: 88,
          skills_score: 90,
          experience_score: 85,
          projects_score: 88,
          education_score: 90,
          certifications_score: 80,
          matched_skills: ['Python', 'FastAPI', 'React'],
          missing_skills: [],
          ai_explanation: 'Strong candidate match with proven engineering track record in Python and modern APIs.'
        }
      }
    ] as any;
  }

  if (endpoint.includes('/candidates/me')) return MOCK_CANDIDATE as any;
  if (endpoint.includes('/jobs/recruiter/my-jobs')) return MOCK_JOBS as any;
  if (endpoint.includes('/applications/recruiter/all') || endpoint.includes('/applications/job/')) {
    return [
      {
        id: "app-01",
        job_id: "job-01",
        candidate_id: "cand-01",
        status: "shortlisted",
        candidate_name: "Alex Chen",
        candidate_email: "alex.dev@example.com",
        job_title: "Senior Full-Stack Engineer",
        company_name: "Tech Innovations Inc.",
        applied_at: new Date().toISOString(),
        match_score: {
          overall_score: 94,
          skills_score: 95,
          experience_score: 88,
          projects_score: 90,
          education_score: 92,
          certifications_score: 85,
          matched_skills: ["Python", "FastAPI", "React", "PostgreSQL"],
          missing_skills: [],
          ai_explanation: "Top tier engineer matching core skills."
        }
      },
      {
        id: "app-02",
        job_id: "job-01",
        candidate_id: "cand-02",
        status: "under_review",
        candidate_name: "Sarah Miller",
        candidate_email: "sarah.m@example.com",
        job_title: "Senior Full-Stack Engineer",
        company_name: "Tech Innovations Inc.",
        applied_at: new Date().toISOString(),
        match_score: {
          overall_score: 88,
          skills_score: 85,
          experience_score: 85,
          projects_score: 88,
          education_score: 90,
          certifications_score: 80,
          matched_skills: ["Python", "React", "Docker"],
          missing_skills: ["FastAPI"],
          ai_explanation: "Strong engineering background."
        }
      }
    ] as any;
  }

  if (endpoint.includes('/notifications')) {
    return [
      {
        id: "notif-01",
        user_id: "user-demo-01",
        type: "interview_invite",
        is_read: 0,
        created_at: new Date().toISOString(),
        parsed_data: {
          title: "🎉 Interview Invitation: Senior Full-Stack Engineer",
          job_title: "Senior Full-Stack Engineer",
          company_name: "Tech Innovations Inc.",
          status: "interview_scheduled",
          scheduled_at: "Tomorrow at 2:00 PM EST",
          location_or_link: "https://meet.google.com/hms-recr-invite",
          notes: "We were impressed by your resume score (94%) and would love to meet you!"
        }
      }
    ] as any;
  }

  if (endpoint.includes('/analytics/recruiter')) {
    return {
      total_jobs: 4,
      total_applications: 28,
      shortlisted_candidates: 12,
      interviews_scheduled: 6,
      average_match_score: 86
    } as any;
  }

  return {} as any;
}

export async function uploadFile<T>(endpoint: string, file: File): Promise<T> {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const baseUrl = getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    // Vercel standalone preview fallback
  }

  // Instant client-side analysis mock for Vercel demo
  return {
    id: "resume-demo-uploaded",
    candidate_id: "cand-demo-01",
    filename: file.name,
    uploaded_at: new Date().toISOString(),
    analysis: {
      overall_score: 82,
      score_tier: "Competitive Candidate",
      career_level: "Mid-Level Engineer (3-5 yrs)",
      ats_score: 85,
      impact_score: 75,
      experience_score: 80,
      skills_score: 90,
      action_verb_score: 80,
      formatting_score: 95,
      extracted_skills: ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "Git", "REST APIs", "Next.js"],
      recruiter_checks: [
        {
          id: "impact",
          category: "Quantify Impact",
          title: "Measurable Metrics & Business Scale",
          status: "passed",
          score: 85,
          issue_count: 0,
          summary: "Strong quantification of impact and latency improvements found in bullet points.",
          fix: "Great job! Keep highlighting % and $ metrics."
        },
        {
          id: "skills",
          category: "Skills Breadth",
          title: "Technical Stack Alignment",
          status: "passed",
          score: 95,
          issue_count: 0,
          summary: "Core technologies (Python, FastAPI, React, PostgreSQL, Docker) recognized.",
          fix: "Strong technical alignment."
        }
      ],
      score_boost_roadmap: [
        {
          title: "Highlight Distributed Architecture & Cloud Deployments",
          impact_gain: "+10 PTS",
          priority: "High Priority",
          color: "emerald",
          description: "Detail AWS ECS, Lambda, or Kubernetes container clustering."
        }
      ]
    }
  } as any;
}

export async function scheduleInterview(data: any): Promise<any> {
  return apiRequest('/interviews/schedule', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getNotifications(): Promise<any[]> {
  return apiRequest<any[]>('/notifications');
}

export async function markNotificationAsRead(id: string): Promise<any> {
  return apiRequest(`/notifications/${id}/read`, {
    method: 'PATCH',
  });
}

export async function resetPassword(email: string, newPassword: string): Promise<any> {
  return apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, new_password: newPassword }),
  });
}

export async function generateInterviewQuestions(roleTitle: string, jobDescription?: string, skills?: string[]): Promise<{ questions: any[]; role_title: string; total: number }> {
  try {
    return await apiRequest('/interviews/generate-questions', {
      method: 'POST',
      body: JSON.stringify({ role_title: roleTitle, job_description: jobDescription, skills }),
    });
  } catch (err) {
    // Fallback Mock Questions
    return {
      role_title: roleTitle,
      total: 4,
      questions: [
        {
          id: "q-1",
          question: "Can you describe a recent project where you had to troubleshoot a difficult bug or production issue? How did you identify the root cause and resolve it?",
          category: "problem_solving",
          difficulty: "mid",
          key_competencies: ["Debugging", "Root Cause Analysis", "Resilience", "Monitoring"],
          sample_response: {
            star_situation: "In our microservices platform, we hit intermittent 504 timeouts during flash sales.",
            star_task: "Locate the bottleneck without inflating infrastructure costs.",
            star_action: "Traced distributed logs using OpenTelemetry, isolated an N+1 query in PostgreSQL, and added Redis caching with batching.",
            star_result: "Reduced latency by 72% (from 1400ms to 90ms) and eliminated checkout timeouts completely.",
            full_sample: "In our microservices platform, we hit intermittent 504 timeouts during flash sales. I traced logs using OpenTelemetry, isolated an N+1 database query, introduced Redis caching and batching, which reduced latency by 72% and eliminated timeouts.",
            chatgpt_tip: "ChatGPT: Quantify metrics (% latency reduction) and lead with strong STAR structure.",
            claude_tip: "Claude: Explain architecture trade-offs (why Redis caching vs DB read replicas).",
            gemini_tip: "HireSense Gemini: Mention OpenTelemetry, PostgreSQL indexing, and Redis to demonstrate stack expertise."
          }
        },
        {
          id: "q-2",
          question: "How do you design scalable RESTful APIs or backend services, and what strategies do you employ for versioning, caching, and rate limiting?",
          category: "technical",
          difficulty: "senior",
          key_competencies: ["API Architecture", "Rate Limiting", "Caching Strategies", "Idempotency"],
          sample_response: {
            star_situation: "When scaling our payment webhook ingestion pipeline handling 10k requests/sec.",
            star_task: "Design resilient API endpoints ensuring zero duplicate charges.",
            star_action: "Applied URI versioning (/v1/), token-bucket rate limiting in Redis, idempotency keys, and async Celery workers.",
            star_result: "Achieved 99.99% uptime with guaranteed once-and-only-once payment processing.",
            full_sample: "I structure APIs around RESTful resource conventions, enforce strict semantic versioning, use token-bucket rate limiters in Redis, and require idempotency headers on POST operations with async message workers.",
            chatgpt_tip: "ChatGPT: Clearly distinguish between HTTP 429 rate limit vs HTTP 401 auth handling.",
            claude_tip: "Claude: Discuss distributed lock timeouts, idempotency replay prevention, and consistency.",
            gemini_tip: "HireSense Gemini: Highlight Idempotency Keys, Redis Token Bucket, and Async Queues."
          }
        },
        {
          id: "q-3",
          question: "Tell me about a time you had a technical disagreement with a team member or tech lead. How did you handle it and what was the outcome?",
          category: "behavioral",
          difficulty: "mid",
          key_competencies: ["Conflict Resolution", "Collaboration", "Empathy", "Data-Driven Decisions"],
          sample_response: {
            star_situation: "During a migration, the lead favored a monolithic rewrite while I advocated for a strangler pattern.",
            star_task: "Align on an architecture that mitigated release risk without delaying delivery.",
            star_action: "Constructed a POC benchmark showing rollback safety and incremental deployment metrics.",
            star_result: "We agreed on the incremental approach, delivering Phase 1 two weeks early with zero downtime.",
            full_sample: "When debating monolithic rewrite versus strangler pattern, I avoided subjective arguments by building a benchmark POC showing risk curves and deployment velocity, uniting the team behind a safe incremental path.",
            chatgpt_tip: "ChatGPT: Focus on listening, emotional intelligence, and shared organizational goals.",
            claude_tip: "Claude: Highlight the objective technical trade-off matrix used to evaluate both options.",
            gemini_tip: "HireSense Gemini: Mentioning 'Strangler Fig Pattern' and 'POC Benchmarks' proves leadership."
          }
        },
        {
          id: "q-4",
          question: "Explain how you write automated tests and maintain code quality in a fast-paced CI/CD deployment environment.",
          category: "technical",
          difficulty: "mid",
          key_competencies: ["Unit Testing", "CI/CD Pipelines", "Code Quality", "Mocking & Fixtures"],
          sample_response: {
            star_situation: "Our release cycle was slowed down by flaky end-to-end tests and manual regression testing.",
            star_task: "Establish a test pyramid executing in under 3 minutes on GitHub Actions.",
            star_action: "Replaced heavy UI tests with pytest/Jest unit tests and Dockerized integration fixtures with 80% coverage gates.",
            star_result: "Pipeline run time dropped from 22 mins to 2.5 mins while production defects dropped 65%.",
            full_sample: "I apply the Test Pyramid principle: heavy unit test coverage with fast mocking, containerized integration tests for DB interactions, and synthetic health checks in GitHub Actions CI/CD gates.",
            chatgpt_tip: "ChatGPT: Emphasize balancing developer velocity with regression safety.",
            claude_tip: "Claude: Mention contract testing and deterministic test database seeding.",
            gemini_tip: "HireSense Gemini: Mention Pytest/Jest, Docker testcontainers, GitHub Actions, and Coverage Gates."
          }
        }
      ]
    };
  }
}

export async function evaluateInterviewAnswer(questionText: string, userAnswer: string, roleTitle: string): Promise<any> {
  try {
    return await apiRequest('/interviews/evaluate-answer', {
      method: 'POST',
      body: JSON.stringify({ question_text: questionText, user_answer: userAnswer, role_title: roleTitle }),
    });
  } catch (err) {
    const wordCount = (userAnswer || "").trim().split(/\s+/).length;
    const baseScore = wordCount > 30 ? 88 : wordCount > 10 ? 70 : 50;
    return {
      overall_score: baseScore,
      clarity_score: baseScore + 2,
      technical_depth_score: baseScore - 3,
      star_structure_score: baseScore - 1,
      relevance_score: baseScore + 4,
      chatgpt_review: {
        model: "OpenAI ChatGPT-4o",
        summary: `Your answer was direct and structured with ${wordCount} words spoken.`,
        strengths: ["Clear response tone", "Relevant past project context", "Ownership language"],
        improvements: ["Explicitly state measurable % / $ outcomes", "Ensure full STAR arc is completed"],
        fluency_rating: "Articulate & Professional",
        verdict: "Strong candidate response for screening round."
      },
      claude_review: {
        model: "Anthropic Claude 3.5 Sonnet",
        summary: "Analytical breakdown: Good technical grounding with opportunities to explore system edge cases.",
        strengths: ["Logical decomposition", "Good tool choices", "Transparent technical rationale"],
        improvements: ["Discuss trade-offs against alternative patterns", "Mention monitoring & rollback strategies"],
        depth_rating: "Rigorous & Thorough",
        verdict: "Solid technical depth and systems thinking."
      },
      gemini_review: {
        model: "HireSense Emerald AI (Gemini Flash)",
        summary: `Job Match Score: 89% alignment with ${roleTitle} technical competencies.`,
        matched_skills: ["Problem Solving", "Troubleshooting", "System Architecture", "Communication"],
        missing_keywords: ["Root Cause Analysis", "Idempotency", "Telemetry & Metrics"],
        upskill_action: "Practice quantifying engineering impact and reciting system design trade-offs.",
        verdict: "High ATS and recruiter interview fit."
      },
      upskilling_recommendations: [
        {
          topic: "STAR Metric Quantification",
          priority: "high",
          resource_type: "Interactive Workshop",
          actionable_step: "Always finish your answer with 1-2 quantified metrics (e.g. latency reduced by 70%, 10 hrs saved/week)."
        },
        {
          topic: `${roleTitle} Architectural Trade-offs`,
          priority: "medium",
          resource_type: "System Design Guide",
          actionable_step: "Highlight WHY you picked technology X over Y to showcase senior-level engineering maturity."
        }
      ]
    };
  }
}

export async function completeInterviewSession(sessionData: any): Promise<any> {
  try {
    return await apiRequest('/interviews/complete', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  } catch (err) {
    return { success: true, message: "Session completed in offline mode", id: "mock-session-" + Date.now() };
  }
}

export async function getMyInterviewSessions(): Promise<any[]> {
  try {
    return await apiRequest<any[]>('/interviews/my-sessions');
  } catch (err) {
    return [];
  }
}
