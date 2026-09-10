import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Award, ChevronRight, Send, CheckCircle2, Sparkles, SlidersHorizontal, ArrowUpRight, Eye, Briefcase } from 'lucide-react';
import { JobRecommendation } from '../../types';

interface JobRecommendationsPageProps {
  recommendations: JobRecommendation[];
  onApply: (jobId: string) => void;
  onOpenMatchModal?: (rec: JobRecommendation) => void;
  onOpenJobDetail?: (rec: JobRecommendation) => void;
}

const DEFAULT_JOBS: JobRecommendation[] = [
  {
    job: {
      id: "job-01",
      recruiter_id: "rec-01",
      company_name: "Tech Innovations Inc.",
      title: "Senior Full-Stack Engineer",
      location: "Bengaluru / Remote",
      employment_type: "Full-time",
      experience_level: "Senior (4+ yrs)",
      salary_range: "₹28,00,000 - ₹34,00,000",
      description: "Seeking an experienced Senior Full-Stack Engineer to lead high-throughput web architectures, asynchronous FastAPI microservices, and reactive TypeScript frontends. You will architect mission-critical features, optimize pgvector cosine search embeddings, and mentor junior engineers.",
      department: "Core Platform & Infrastructure",
      responsibilities: [
        "Architect and scale microservices with Python (FastAPI), asyncio worker queues, and PostgreSQL.",
        "Build responsive, high-performance UI workflows using React 18, TypeScript, and modern component systems.",
        "Implement and optimize vector search indexing with pgvector for low-latency similarity matching.",
        "Lead code reviews, define CI/CD testing gates, and uphold software engineering best practices.",
        "Collaborate closely with product management and AI engineers to deliver end-to-end features."
      ],
      qualifications: [
        "4+ years of professional full-stack software development experience.",
        "Strong proficiency in Python (FastAPI/Django), React, TypeScript, and SQL databases.",
        "Deep understanding of distributed systems, REST API architecture, and database indexing.",
        "Experience with containerized deployment using Docker and cloud platforms (AWS / GCP)."
      ],
      preferred_qualifications: [
        "Experience with pgvector, Pinecone, or other vector databases in production.",
        "Familiarity with Kubernetes orchestration, Redis caching, and Celery asynchronous tasks.",
        "Prior experience leading technical design RFCs and mentoring engineering teams."
      ],
      benefits: [
        "Top-tier competitive base salary + lucrative equity grants.",
        "100% remote-first flexibility with home office ergonomics stipend.",
        "Comprehensive health & dental insurance for employee and dependents.",
        "Annual ₹1,50,000 learning & conference budget."
      ],
      status: "active",
      required_skills: ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "Redis"],
      preferred_skills: ["Kubernetes", "pgvector", "AWS", "TypeScript"],
      created_at: new Date().toISOString()
    },
    match_details: {
      overall_score: 94,
      skills_score: 95,
      experience_score: 88,
      projects_score: 90,
      education_score: 92,
      certifications_score: 85,
      matched_skills: ["Python", "FastAPI", "React", "PostgreSQL", "Docker"],
      missing_skills: ["Kubernetes"],
      ai_explanation: "Exceptional match (94%) with your verified Python, FastAPI, and React experience. High vector alignment across backend and frontend engineering."
    }
  },
  {
    job: {
      id: "job-02",
      recruiter_id: "rec-01",
      company_name: "CloudScale Systems",
      title: "Software Development Engineer (SDE-2)",
      location: "Hyderabad / Hybrid",
      employment_type: "Full-time",
      experience_level: "Mid-Level (2-5 yrs)",
      salary_range: "₹22,00,000 - ₹28,00,000",
      description: "Core backend & microservice API development in Python, asynchronous worker queues, and distributed data pipelines. You will take ownership of backend services powering millions of daily requests with high reliability.",
      department: "Distributed Backend Services",
      responsibilities: [
        "Design, build, and maintain high-concurrency RESTful APIs and backend services using FastAPI and Python.",
        "Design resilient database schemas, optimize SQL queries, and implement Redis caching layers.",
        "Implement background task workers and event-driven data streaming pipelines.",
        "Write comprehensive unit and integration tests (pytest) to maintain 85%+ test coverage."
      ],
      qualifications: [
        "2-5 years of backend engineering experience with Python or Node.js.",
        "Hands-on experience with PostgreSQL, relational modeling, and query tuning.",
        "Familiarity with REST APIs, authentication (JWT/OAuth), and Docker containerization."
      ],
      preferred_qualifications: [
        "Experience with message brokers like RabbitMQ or Apache Kafka.",
        "Familiarity with AWS cloud primitives (EC2, S3, RDS, Lambda)."
      ],
      benefits: [
        "Competitive salary + annual performance bonuses.",
        "Hybrid work flexibility with flexible working hours.",
        "Comprehensive health insurance and annual wellness stipend."
      ],
      status: "active",
      required_skills: ["Python", "FastAPI", "PostgreSQL", "System Design", "AWS"],
      preferred_skills: ["Kafka", "Docker", "Redis"],
      created_at: new Date().toISOString()
    },
    match_details: {
      overall_score: 89,
      skills_score: 92,
      experience_score: 86,
      projects_score: 88,
      education_score: 90,
      certifications_score: 80,
      matched_skills: ["Python", "FastAPI", "PostgreSQL", "AWS"],
      missing_skills: ["Kafka"],
      ai_explanation: "Strong alignment with core backend engineering and API design requirements."
    }
  },
  {
    job: {
      id: "job-03",
      recruiter_id: "rec-02",
      company_name: "NexusAI Labs",
      title: "AI / ML Systems Engineer",
      location: "San Francisco / Remote",
      employment_type: "Full-time",
      experience_level: "Mid-Senior (3+ yrs)",
      salary_range: "$140,000 - $175,000",
      description: "Building production LLM orchestration layers, pgvector embeddings search, and low-latency inference pipelines. You will interface deep learning models with scalable web backends and vector search indexes.",
      department: "Applied AI & Vector Systems",
      responsibilities: [
        "Develop high-performance inference pipelines connecting LLM models with production applications.",
        "Implement semantic vector retrieval pipelines with pgvector and hybrid keyword search.",
        "Optimize latency for real-time AI reasoning and multi-modal document extraction.",
        "Build monitoring tools for hallucination detection and response quality evaluation."
      ],
      qualifications: [
        "3+ years software engineering experience with strong Python and PyTorch / HuggingFace foundations.",
        "Demonstrated experience deploying machine learning services via FastAPI microservices.",
        "Solid grounding in linear algebra, embeddings, and vector similarity metrics."
      ],
      preferred_qualifications: [
        "Experience with LangChain, LlamaIndex, vLLM, or TensorRT-LLM.",
        "Knowledge of distributed GPU training and model quantization (GGUF / AWQ)."
      ],
      benefits: [
        "Silicon Valley tier compensation + venture-backed stock options.",
        "Generous GPU cloud credits and hardware workstation stipend.",
        "Full health, dental, and vision insurance with 100% employer contribution."
      ],
      status: "active",
      required_skills: ["Python", "PyTorch", "pgvector", "FastAPI", "Docker"],
      preferred_skills: ["LangChain", "Kubernetes", "vLLM"],
      created_at: new Date().toISOString()
    },
    match_details: {
      overall_score: 86,
      skills_score: 88,
      experience_score: 84,
      projects_score: 87,
      education_score: 85,
      certifications_score: 80,
      matched_skills: ["Python", "FastAPI", "pgvector", "Docker"],
      missing_skills: ["PyTorch"],
      ai_explanation: "Great potential match for generative AI and vector search infrastructure."
    }
  }
];

export const JobRecommendationsPage: React.FC<JobRecommendationsPageProps> = ({
  recommendations = [],
  onApply,
  onOpenMatchModal,
  onOpenJobDetail,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedMap, setAppliedMap] = useState<Record<string, boolean>>({});

  const handleOpenDetail = (rec: JobRecommendation) => {
    if (onOpenJobDetail) {
      onOpenJobDetail(rec);
    } else if (onOpenMatchModal) {
      onOpenMatchModal(rec);
    }
  };

  const activeRecs = recommendations && recommendations.length > 0 ? recommendations : DEFAULT_JOBS;

  const handleApplyClick = (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onApply(jobId);
    setAppliedMap((prev) => ({ ...prev, [jobId]: true }));
  };

  const filtered = activeRecs.filter((r) =>
    (r.job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.job.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.job.required_skills || []).some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const featured = filtered[0];
  const remaining = filtered.slice(1);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 text-white animate-fade-in">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 font-mono font-semibold text-xs text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="uppercase tracking-wider">Active Job Openings & AI Matching</span>
          </div>
          <h1 className="font-editorial text-3xl md:text-5xl font-normal text-white tracking-tight mt-2">
            Recommended Positions
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Click any opening below to view full role descriptions, responsibilities, compensation, and AI radar.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search role, skills, or company..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
      </div>

      {/* Featured #1 Recommendation Card */}
      {featured && (
        <div 
          onClick={() => handleOpenDetail(featured)}
          className="luma-card p-6 md:p-8 space-y-6 border border-white/20 shadow-2xl hover:border-white/35 transition-all cursor-pointer group relative"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-mono font-bold">
                  FEATURED #1 MATCH
                </span>
                <span className="text-xs font-bold text-slate-300 font-mono">{featured.job.company_name}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-mono">
                  {featured.job.employment_type || "Full-time"}
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans group-hover:text-cyan-200 transition-colors flex items-center gap-2">
                <span>{featured.job.title}</span>
                <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> {featured.job.location}</span>
                <span>•</span>
                <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" /> {featured.job.salary_range}
                </span>
                <span>•</span>
                <span className="text-slate-300">{featured.job.experience_level}</span>
              </div>
            </div>

            {/* Giant Score Callout */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDetail(featured);
              }}
              className="px-6 py-4 rounded-2xl bg-white/[0.035] border border-white/10 text-center hover:bg-white/[0.08] transition-all group shrink-0"
            >
              <div className="flex items-center justify-center gap-1 text-slate-300 font-bold text-xs">
                <Award className="w-4 h-4 text-cyan-400" /> AI MATCH
              </div>
              <span className="text-4xl sm:text-5xl font-black text-white font-outfit block">{featured.match_details.overall_score}%</span>
              <span className="text-[10px] text-cyan-300 font-mono flex items-center justify-center gap-1 mt-1">
                View Role & Radar <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
            {featured.job.description}
          </p>

          <div className="luma-card-subtle p-4 rounded-xl space-y-1">
            <span className="font-bold text-cyan-300">AI Rationale:</span> <span className="text-slate-300 text-xs">{featured.match_details.ai_explanation || 'High compatibility score across technical skills and experience level.'}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap gap-1.5">
              {(featured.job.required_skills || []).map((s, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-mono text-slate-300">
                  {s}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDetail(featured);
                }}
                className="btn-luma-glass text-xs px-4 py-2.5 flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>View Full Opening</span>
              </button>

              <button
                onClick={(e) => handleApplyClick(featured.job.id, e)}
                disabled={appliedMap[featured.job.id]}
                className={`btn-luma-primary text-xs px-6 py-2.5 shrink-0 ${appliedMap[featured.job.id] ? 'opacity-70 !bg-emerald-500 !text-black' : ''}`}
              >
                {appliedMap[featured.job.id] ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-black" />
                    <span>Applied</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-black" />
                    <span>1-Click Apply</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Grid of Remaining Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {remaining.map((rec) => (
          <div 
            key={rec.job.id} 
            onClick={() => handleOpenDetail(rec)}
            className="luma-card p-6 space-y-4 hover:border-white/30 transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-white font-sans group-hover:text-cyan-200 transition-colors flex items-center gap-1.5">
                    <span>{rec.job.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-300 transition-colors" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{rec.job.company_name} • {rec.job.location}</p>
                </div>
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDetail(rec);
                  }}
                  className="cursor-pointer px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/15 text-center shrink-0 hover:bg-white/20 transition-all"
                >
                  <span className="font-mono font-bold text-sm text-cyan-300">{rec.match_details.overall_score}%</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {rec.job.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {(rec.job.required_skills || []).slice(0, 5).map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[10px] font-mono text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span className="text-xs font-mono font-bold text-white">{rec.job.salary_range}</span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDetail(rec);
                  }}
                  className="text-xs text-cyan-300 hover:text-white px-2.5 py-1.5 font-medium flex items-center gap-1"
                >
                  <span>Role Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={(e) => handleApplyClick(rec.job.id, e)}
                  disabled={appliedMap[rec.job.id]}
                  className={`btn-luma-glass text-xs px-4 py-2 ${appliedMap[rec.job.id] ? 'opacity-70 !text-emerald-300' : ''}`}
                >
                  {appliedMap[rec.job.id] ? 'Applied ✓' : 'Apply'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* When no jobs match search */}
      {filtered.length === 0 && (
        <div className="luma-card p-12 text-center space-y-4 border border-white/15 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mx-auto text-cyan-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">No Matching Openings Found</h3>
          <p className="text-slate-400 text-xs max-w-md mx-auto">
            Try searching for a different skill, title, or click reset to view all top-ranked recommendations.
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="btn-luma-primary text-xs px-5 py-2 !inline-flex"
          >
            Reset Search Filter
          </button>
        </div>
      )}

    </div>
  );
};

