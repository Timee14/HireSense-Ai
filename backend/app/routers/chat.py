from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import time
import uuid
import re

router = APIRouter(prefix="/chat", tags=["AI Career Chatbot"])

class ChatMessagePayload(BaseModel):
    message: str
    model: Optional[str] = "consensus"  # "consensus", "chatgpt", "claude", "gemini", "grok"
    target_role: Optional[str] = "Software Development Engineer (SDE)"
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

def extract_role_from_text(text: str, default_role: str = "Software Development Engineer (SDE)") -> str:
    text_lower = text.lower()
    if re.search(r'\b(sde|sde[- ]?[123]|software development engineer|software dev engineer)\b', text_lower):
        return "Software Development Engineer (SDE)"
    elif re.search(r'\b(frontend|front-end|react|ui engineer|ui developer)\b', text_lower):
        return "Frontend Engineer"
    elif re.search(r'\b(backend|back-end|python developer|fastapi|django|golang|java engineer)\b', text_lower):
        return "Backend Engineer"
    elif re.search(r'\b(fullstack|full-stack|full stack)\b', text_lower):
        return "Full-Stack Engineer"
    elif re.search(r'\b(devops|sre|site reliability|cloud engineer|platform engineer)\b', text_lower):
        return "DevOps & Cloud Engineer"
    elif re.search(r'\b(data engineer|etl|big data|spark|snowflake)\b', text_lower):
        return "Data Engineer"
    elif re.search(r'\b(data scientist|machine learning|ml engineer|ai engineer|nlp)\b', text_lower):
        return "AI & Machine Learning Engineer"
    elif re.search(r'\b(product manager|product management|tech pm|pm)\b', text_lower):
        return "Product Manager"
    elif re.search(r'\b(qa|sdet|test engineer|automation engineer)\b', text_lower):
        return "SDET / QA Automation Engineer"
    return default_role

def generate_multi_ai_chat_response(payload: ChatMessagePayload) -> ChatResponse:
    user_msg = payload.message.strip()
    msg_lower = user_msg.lower()
    
    # 1. Detect role mentioned in user query or fallback to payload target_role
    target_role = extract_role_from_text(user_msg, payload.target_role or "Software Development Engineer (SDE)")
    
    skills = payload.candidate_skills or ["Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "Docker"]
    missing = payload.missing_skills or ["Distributed Caching (Redis)", "System Design (HLD/LLD)", "Container Orchestration (Kubernetes)"]

    chatgpt_perspective = ""
    claude_perspective = ""
    gemini_perspective = ""
    main_content = ""
    suggested_actions = []
    roadmap_items = []

    # INTENT 1: Role Overview / "Tell me about X role" / "What is an SDE"
    if any(phrase in msg_lower for phrase in ["tell me about", "what is", "explain", "about the", "role overview", "responsibilities of", "what does a", "how to become", "guide for"]) and any(w in msg_lower for w in ["sde", "role", "engineer", "developer", "job", "position"]):
        if "sde" in target_role.lower() or "software development" in target_role.lower():
            main_content = f"""### 👨‍💻 Complete Guide: **Software Development Engineer (SDE)** Role

A **Software Development Engineer (SDE)** is a core software engineering professional responsible for designing, developing, scaling, and maintaining software applications, robust backend microservices, and distributed cloud systems.

---

#### 📌 1. Core Responsibilities
* **Architecture & Development**: Write clean, modular, high-performance code in modern languages (Python, Java, Go, TypeScript, C++).
* **System Design (HLD/LLD)**: Architect scalable REST/gRPC APIs, database schemas (SQL/NoSQL), and caching layers.
* **Reliability & Scalability**: Build fault-tolerant systems with high availability (99.99% uptime), idempotency, and automated CI/CD deployment pipelines.
* **Testing & Quality Assurance**: Write rigorous unit, integration, and contract tests (Pytest, Jest, Docker testcontainers).

---

#### 📈 2. SDE Career Hierarchy & Levels
| Level | Title | Primary Focus & Expectations |
| :--- | :--- | :--- |
| **SDE-1** | Junior / Entry-Level | Focus on task execution, bug fixes, unit testing, and mastering DSA & framework conventions. |
| **SDE-2** | Mid-Level Engineer | Autonomous feature ownership, Low-Level Design (LLD), DB indexing, and microservice integration. |
| **SDE-3** | Senior Engineer | Distributed High-Level Design (HLD), architectural RFCs, performance optimizations, and team mentorship. |
| **Staff / Principal** | Technical Leader | Multi-team system architecture, cross-organizational technical roadmap, and engineering culture. |

---

#### 🛠️ 3. SDE Interview Assessment Rounds
1. **Online Assessment (OA)**: 2–3 algorithmic Data Structures & Algorithms problems (LeetCode Medium-Hard).
2. **Technical Problem Solving (DSA)**: Binary Trees, Graphs, Dynamic Programming, Heap/Two-Pointer optimization.
3. **System Design (LLD & HLD)**: Designing a Rate Limiter, URL Shortener, Uber Matching Engine, or E-Commerce Cart.
4. **Behavioral & Leadership (STAR Method)**: Deep-dive into technical disagreements, production outage retrospectives, and ownership.

---

#### 💡 4. How Your Resume Aligns with SDE:
* **Current Core Strengths**: {', '.join(skills[:4])}
* **Recommended Next Step**: Practice High-Level System Design and add Redis/Kubernetes metrics to reach top candidate percentiles.
"""
            chatgpt_perspective = "ChatGPT-4o: For SDE applications, recruiters look for 2 things immediately: solid DSA fundamentals and clear quantifiable STAR metrics on past software deliverables."
            claude_perspective = "Claude 3.5 Sonnet: SDE-2+ interviews heavily weigh systems thinking: explain trade-offs (e.g. CAP theorem, caching strategies, and eventual vs strong consistency)."
            gemini_perspective = "Gemini Flash / Pro: Current industry demand for SDEs favors engineers proficient in cloud-native microservices, async APIs, and PostgreSQL/vector search architectures."
            
            suggested_actions = [
                {"title": "Analyze My Skill Gaps for SDE", "action": "What are my exact skill gaps for the SDE role?"},
                {"title": "Simulate SDE System Design Question", "action": "Ask me an SDE System Design interview question"},
                {"title": "Generate SDE STAR Resume Bullets", "action": "Rewrite my resume experience bullets for an SDE position"}
            ]

        else:
            # Generic Role Overview for any other role
            main_content = f"""### 🎯 Complete Overview: **{target_role}**

A **{target_role}** is responsible for delivering end-to-end technical solutions, driving feature velocity, and ensuring platform reliability.

#### 📌 Key Responsibilities:
1. **Engineering Execution**: Architecting scalable components, APIs, and infrastructure.
2. **Technical Standards**: Code reviews, automated testing, and CI/CD pipelines.
3. **Collaboration**: Partnering with product, design, and operations teams to translate business requirements into software.

#### 🛠️ Essential Tech Stack:
* **Core Technologies**: {', '.join(skills[:5])}
* **Cloud & Infrastructure**: Docker, Kubernetes, AWS/GCP, Redis, PostgreSQL.
"""
            chatgpt_perspective = f"ChatGPT-4o: Focus on ATS keyword alignment and quantified project outcomes for {target_role}."
            claude_perspective = f"Claude 3.5 Sonnet: Emphasize trade-offs, architecture patterns, and resilience for {target_role}."
            gemini_perspective = f"Gemini Flash: Industry demand index for {target_role} is high with top recruiter calibration scores."
            
            suggested_actions = [
                {"title": f"Skill Gaps for {target_role}", "action": f"What are my exact skill gaps for {target_role}?"},
                {"title": f"30-Day {target_role} Roadmap", "action": f"Create a 30-day learning roadmap for {target_role}"}
            ]

    # INTENT 2: Skill Gap Analysis
    elif any(w in msg_lower for w in ["gap", "missing", "lacking", "weakness", "how do i qualify"]):
        main_content = f"""### 🎯 Precision Skill Gap Breakdown for **{target_role}**

Based on your current resume profile and benchmark job requirements for **{target_role}**, here is your exact gap analysis:

#### 1. Critical Missing Competencies
* **{missing[0] if len(missing) > 0 else 'Kubernetes & Container Orchestration'}**: High priority in modern cloud deployments. Required for container scaling and microservices architecture.
* **{missing[1] if len(missing) > 1 else 'Redis & Distributed Caching'}**: Essential for reducing DB latency on high-throughput read paths.
* **{missing[2] if len(missing) > 2 else 'System Design (HLD/LLD)'}**: Differentiator for SDE-2 / Senior engineering bands and compensation calibrations.

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
            {"title": "Practice SDE System Design", "action": "Simulate mock design interview for rate limiters"},
            {"title": "Add Missing Skills to Resume", "action": "Show me how to add Redis and Kubernetes to my resume"},
            {"title": "Explore SDE Learning Roadmap", "action": f"Create a 30-day upskilling roadmap for {target_role}"}
        ]

    # INTENT 3: Resume Rewriting / STAR Metrics
    elif any(w in msg_lower for w in ["upskill", "resume", "bullet", "star", "rewrite", "experience"]):
        main_content = f"""### 📝 AI Resume Transformation & STAR Metric Optimization for **{target_role}**

Here is how to rewrite your engineering bullet points to achieve an **Elite 95+ ATS Score**:

#### ❌ Before (Passive / Weak):
> "Worked on backend APIs with FastAPI and fixed database query bugs for the web application."

#### ✅ After (Calibrated STAR Architecture for {target_role}):
> "Architected 14+ asynchronous RESTful endpoints with **FastAPI** and **PostgreSQL**, optimizing unindexed foreign key joins to reduce p99 latency by **38%** for 50,000+ daily active requests."

#### 🚀 Key Power Formulas Applied:
1. **Active Power Verb**: *Architected*, *Engineered*, *Orchestrated*, *Optimized*
2. **Context & Tech Stack**: *FastAPI*, *PostgreSQL*, *Docker*, *Redis*
3. **Quantifiable Business Outcome**: *38% latency reduction*, *50k+ daily requests*
"""
        chatgpt_perspective = "ChatGPT-4o: Always lead with quantifiable business metric in the first 8 words. Recruiters scan resumes in under 6 seconds."
        claude_perspective = "Claude 3.5 Sonnet: Ensure the bullet clearly shows why the technical decision mattered to platform reliability and user experience."
        gemini_perspective = "Gemini Flash: Highlight modern CI/CD, telemetry (OpenTelemetry/Prometheus), and async paradigms to match top-decile hiring rubrics."

        suggested_actions = [
            {"title": "Copy Optimized STAR Bullet", "action": "Paste directly into your Experience section"},
            {"title": "Run Full Resume Rescan", "action": "Check updated ATS score on Resume Analyzer"}
        ]

    # INTENT 4: Learning Roadmap
    elif any(w in msg_lower for w in ["roadmap", "learn", "study", "plan", "curriculum", "schedule"]):
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

    # INTENT 5: Interview Simulation & Questions
    elif any(w in msg_lower for w in ["interview", "mock", "question", "simulate", "test me"]):
        main_content = f"""### 🎙️ Technical Interview Simulation for **{target_role}**

Here is a classic Senior {target_role} interview question from top tech companies (FAANG / Tier 1 Startups):

#### ❓ Question:
> *"How would you design a distributed, fault-tolerant **Rate Limiter** service that handles 100,000 requests per second across multiple data centers?"*

#### 💡 Multi-AI Evaluation Rubric:
1. **Algorithms**: Token Bucket vs Leaky Bucket vs Sliding Window Counter algorithms.
2. **Data Layer**: Redis cluster with Lua scripts for atomic increments.
3. **Failure Modes**: What happens when Redis is unreachable? (Graceful fallback / local token cache).
4. **Consistency vs Latency**: Low-latency local sync vs global precision.

*Would you like to write your answer, or shall I provide the benchmark high-scoring answer?*
"""
        chatgpt_perspective = "ChatGPT-4o: Explain why Token Bucket is ideal for bursty traffic before writing any code."
        claude_perspective = "Claude 3.5 Sonnet: Address clock drift, atomic Redis operations (Lua scripts), and network partition trade-offs."
        gemini_perspective = "Gemini Flash: Mention sliding window log memory overhead and how Redis HyperLogLog / Token Bucket optimizes space."

        suggested_actions = [
            {"title": "Show High-Scoring Solution", "action": "Explain the ideal solution for the Distributed Rate Limiter interview question"},
            {"title": "Practice Next SDE Question", "action": "Give me another SDE system design interview question"}
        ]

    # INTENT 6: Default Conversational Assistant
    else:
        main_content = f"""### 🤖 Aven — AI Career & Upskilling Copilot

Hello! I am **Aven**, your AI career copilot, powered by multi-model intelligence (**ChatGPT-4o**, **Claude 3.5 Sonnet**, and **Google Gemini**).

Here are key ways I can help you secure your next role as **{target_role}**:

1. 👨‍💻 **Role Breakdown & Career Guidance**: Ask me *"Tell me about the SDE role"* or *"What is expected of an SDE-2?"*
2. 🎯 **Role-Specific Skill Gap Analysis**: Discover exact technical competencies required by recruiters.
3. 📝 **STAR Resume Rewriter**: Turn generic job descriptions into high-impact metric bullets.
4. 🚀 **Accelerated Learning Roadmap**: Personalized 30-day skill sprints to close technical gaps.
5. 🎙️ **Live Interview Simulation**: Practice technical and behavioral questions with multi-AI scoring.

*What would you like to work on right now? Ask any question or select a shortcut below!*
"""
        chatgpt_perspective = "ChatGPT-4o: Ask me to draft tailored cover letters or rewrite your project bullets for maximum ATS ranking."
        claude_perspective = "Claude 3.5 Sonnet: Ask me for deep architectural breakdown of technical system design interview topics."
        gemini_perspective = "Gemini Flash: Ask me to benchmark your current resume skills against live market hiring standards."

        suggested_actions = [
            {"title": f"Tell Me About the {target_role} Role", "action": f"Tell me about the {target_role} role and expectations"},
            {"title": f"Analyze Gaps for {target_role}", "action": f"What are my exact skill gaps for {target_role}?"},
            {"title": "Generate STAR Resume Bullets", "action": "Rewrite my software experience bullets using STAR metrics"}
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
        {"id": "sess-1", "title": "🎯 Skill Gap Analysis for SDE Role", "created_at": "Today", "message_count": 6},
        {"id": "sess-2", "title": "📝 STAR Resume Metric Polishing", "created_at": "Yesterday", "message_count": 4},
        {"id": "sess-3", "title": "🚀 30-Day Kubernetes Upskilling Plan", "created_at": "3 days ago", "message_count": 8}
    ]

@router.delete("/clear")
def clear_chat_history():
    return {"success": True, "message": "Chat history cleared successfully"}
