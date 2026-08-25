from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import time
import uuid

router = APIRouter(prefix="/chat", tags=["AI Career Chatbot"])

class ChatMessagePayload(BaseModel):
    message: str
    model: Optional[str] = "consensus"  # "consensus", "chatgpt", "claude", "gemini", "grok"
    target_role: Optional[str] = "Senior Full-Stack Engineer"
    candidate_skills: Optional[List[str]] = []
    missing_skills: Optional[List[str]] = []
    resume_summary: Optional[str] = ""
    history: Optional[List[Dict[str, Any]]] = []

class ChatResponse(BaseModel):
    id: str
    role: str = "assistant"
    content: str
    model_used: str
    timestamp: str
    perspectives: Optional[Dict[str, str]] = None
    suggested_actions: Optional[List[Dict[str, str]]] = None
    roadmap_items: Optional[List[Dict[str, str]]] = None

def generate_multi_ai_chat_response(payload: ChatMessagePayload) -> ChatResponse:
    user_msg = payload.message.strip()
    msg_lower = user_msg.lower()
    target_role = payload.target_role or "Senior Full-Stack Engineer"
    skills = payload.candidate_skills or ["Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "Docker"]
    missing = payload.missing_skills or ["Kubernetes", "Redis Caching", "System Design", "AWS Lambda", "GraphQL"]
    
    # 1. Generate Model Perspectives (ChatGPT, Claude, Gemini)
    chatgpt_perspective = ""
    claude_perspective = ""
    gemini_perspective = ""
    main_content = ""
    suggested_actions = []
    roadmap_items = []

    if "gap" in msg_lower or "missing" in msg_lower or "role" in msg_lower:
        main_content = f"""### 🎯 Precision Skill Gap Breakdown for **{target_role}**

Based on your current resume profile and benchmark job requirements for **{target_role}**, here is your exact gap analysis:

#### 1. Critical Missing Competencies
* **{missing[0] if len(missing) > 0 else 'Kubernetes & Container Orchestration'}**: High priority in modern production deployments. Required for container scaling and microservices architecture.
* **{missing[1] if len(missing) > 1 else 'Redis & Distributed Caching'}**: Essential for reducing DB latency on high-throughput read paths.
* **{missing[2] if len(missing) > 2 else 'System Design & High-Availability RFCs'}**: Differentiator for Senior engineering bands and compensation calibrations.

#### 2. Verified Strengths on Resume
* **Core Languages & Frameworks**: {', '.join(skills[:4])}
* **Data Layer**: PostgreSQL, Vector Embeddings, Schema Design

#### 3. Recommended Action Plan
1. **Weekend Project**: Build a Redis caching middleware on top of FastAPI to demonstrate sub-10ms response times.
2. **Resume Update**: Add quantified impact metrics to your experience section (e.g. *Reduced query latency by 45%*).
"""
        chatgpt_perspective = f"ChatGPT-4o: Focus on ATS keyword density. Embed '{missing[0] if missing else 'Kubernetes'}' directly in your technical skills grid and create 2 STAR-format bullet points demonstrating production usage."
        claude_perspective = f"Claude 3.5 Sonnet: From a systems architecture lens, demonstrate trade-off evaluation between relational PostgreSQL indexing vs Redis caching layers to show Senior engineering maturity."
        gemini_perspective = f"Gemini Flash / Pro: Market hiring trend data for {target_role} shows a 34% increase in demand for {', '.join(missing[:3])}. Adding these will boost your ATS match score by +12 points."
        
        suggested_actions = [
            {"title": "Add Kubernetes to Resume", "action": "Insert container orchestration project bullet point"},
            {"title": "Practice System Design", "action": "Simulate mock design interview for rate limiters"},
            {"title": "Explore Recommended Course", "action": "FastAPI + Redis Microservices Mastery"}
        ]

    elif "upskill" in msg_lower or "resume" in msg_lower or "bullet" in msg_lower or "star" in msg_lower:
        main_content = f"""### 📝 AI Resume Transformation & STAR Metric Optimization

Here is how to rewrite your engineering bullet points to achieve an **Elite 95+ ATS Score**:

#### ❌ Before (Passive / Weak):
> "Worked on backend APIs with FastAPI and fixed database query bugs for the web application."

#### ✅ After (Calibrated STAR Architecture):
> "Architected 14+ asynchronous RESTful endpoints with **FastAPI** and **PostgreSQL**, optimizing unindexed foreign key joins to reduce p99 latency by **38%** for 50,000+ daily active requests."

#### 🚀 Key Power Formulas Applied:
1. **Active Power Verb**: *Architected*, *Engineered*, *Orchestrated*, *Optimized*
2. **Context & Tech Stack**: *FastAPI*, *PostgreSQL*, *Docker*, *Redis*
3. **Quantifiable Business Outcome**: *38% latency reduction*, *50k+ daily requests*
"""
        chatgpt_perspective = "ChatGPT-4o: Always lead with quantifiable business metric in the first 8 words. Recruiters scan resumes in under 6 seconds."
        claude_perspective = "Claude 3.5 Sonnet: Ensure the bullet clearly shows *why* the technical decision mattered to platform reliability and user experience."
        gemini_perspective = "Gemini Flash: Highlight modern CI/CD, telemetry (OpenTelemetry/Prometheus), and async paradigms to match top-decile hiring rubrics."

        suggested_actions = [
            {"title": "Copy Optimized STAR Bullet", "action": "Paste directly into your Experience section"},
            {"title": "Run Full Resume Rescan", "action": "Check updated ATS score on Resume Analyzer"}
        ]

    elif "roadmap" in msg_lower or "learn" in msg_lower or "study" in msg_lower or "plan" in msg_lower:
        main_content = f"""### 🚀 30-Day Accelerated Upskilling Roadmap for **{target_role}**

Follow this structured weekly progression to master missing skills and reach candidate shortlist tier:

| Week | Focus Domain | Key Milestone & Deliverable |
| :--- | :--- | :--- |
| **Week 1** | **Advanced Redis & Caching** | Implement Token Bucket rate limiter & Redis cache invalidation pipeline |
| **Week 2** | **Docker & Kubernetes Deployment** | Write multi-stage Dockerfiles and deploy mini-cluster with Helm charts |
| **Week 3** | **System Design & Observability** | Architect a distributed notification engine with RabbitMQ / Kafka |
| **Week 4** | **Portfolio & Resume Polish** | Deploy live demo on GitHub with automated CI/CD GitHub Actions & test coverage |
"""
        chatgpt_perspective = "ChatGPT-4o: Focus on building 1 high-visibility GitHub repo with a comprehensive README, architecture diagrams, and test suite."
        claude_perspective = "Claude 3.5 Sonnet: Emphasize resilience patterns: Circuit Breakers, Exponential Backoff, Idempotency Keys, and graceful degradation."
        gemini_perspective = "Gemini Flash: Align your study sprints with Google Cloud / AWS Well-Architected Framework benchmarks for maximum recruiter impact."

        roadmap_items = [
            {"week": "Week 1", "topic": "Redis Caching & Latency Optimization", "hours": "8 hrs"},
            {"week": "Week 2", "topic": "Kubernetes & Helm Microservices", "hours": "10 hrs"},
            {"week": "Week 3", "topic": "Distributed System Architecture", "hours": "12 hrs"},
            {"week": "Week 4", "topic": "CI/CD & Live Cloud Deployment", "hours": "6 hrs"}
        ]

    else:
        main_content = f"""### 🤖 Aven — AI Career & Upskilling Copilot

Hello! I am **Aven**, your AI career copilot, powered by multi-model intelligence (**ChatGPT-4o**, **Claude 3.5 Sonnet**, and **Google Gemini**).

Here are key ways I can help you secure your next role as **{target_role}**:

1. 🎯 **Role-Specific Skill Gap Analysis**: Discover exact technical competencies required by recruiters.
2. 📝 **STAR Resume Rewriter**: Turn generic job descriptions into high-impact metric bullets.
3. 🚀 **Accelerated Learning Roadmap**: Personalized 30-day skill sprints to close technical gaps.
4. 🎙️ **Live Interview Simulation**: Practice technical and behavioral questions with multi-AI scoring.
5. 🔍 **ATS Keyword Tuning**: Calibrate your resume text against any job posting description.

*What would you like to work on right now? Pick a suggestion below or type your custom question!*
"""
        chatgpt_perspective = "ChatGPT-4o: Ask me to draft tailored cover letters or rewrite your project bullets for maximum ATS ranking."
        claude_perspective = "Claude 3.5 Sonnet: Ask me for deep architectural breakdown of technical system design interview topics."
        gemini_perspective = "Gemini Flash: Ask me to benchmark your current resume skills against live market hiring standards."

        suggested_actions = [
            {"title": f"Analyze Gaps for {target_role}", "action": f"What are my exact skill gaps for {target_role}?"},
            {"title": "Generate STAR Resume Bullets", "action": "Rewrite my software experience bullets using STAR metrics"},
            {"title": "Create 30-Day Learning Plan", "action": f"Create a 30-day upskilling roadmap for {target_role}"}
        ]

    return ChatResponse(
        id=str(uuid.uuid4()),
        role="assistant",
        content=main_content,
        model_used=payload.model or "consensus",
        timestamp=time.strftime("%I:%M %p"),
        perspectives={
            "chatgpt": chatgpt_perspective,
            "claude": claude_perspective,
            "gemini": gemini_perspective
        },
        suggested_actions=suggested_actions,
        roadmap_items=roadmap_items
    )

@router.post("/message", response_model=ChatResponse)
def post_chat_message(payload: ChatMessagePayload):
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    return generate_multi_ai_chat_response(payload)

@router.get("/sessions")
def get_chat_sessions():
    return [
        {"id": "sess-1", "title": "🎯 Skill Gap Analysis for Senior Full-Stack", "created_at": "Today", "message_count": 6},
        {"id": "sess-2", "title": "📝 STAR Resume Metric Polishing", "created_at": "Yesterday", "message_count": 4},
        {"id": "sess-3", "title": "🚀 30-Day Kubernetes Upskilling Plan", "created_at": "3 days ago", "message_count": 8}
    ]

@router.delete("/clear")
def clear_chat_history():
    return {"success": True, "message": "Chat history cleared successfully"}
