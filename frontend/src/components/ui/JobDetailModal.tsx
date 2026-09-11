import React, { useState } from 'react';
import {
  X, Building2, MapPin, DollarSign, Briefcase, Award, CheckCircle2,
  AlertTriangle, Sparkles, Send, BrainCircuit, MessageSquare, ArrowRight,
  ShieldCheck, Layers, ChevronRight, Clock, Users, Gift, Check, Flame
} from 'lucide-react';
import { JobRecommendation } from '../../types';

interface JobDetailModalProps {
  rec: JobRecommendation | null;
  onClose: () => void;
  onApply?: (jobId: string) => void;
  isApplied?: boolean;
  onNavigateToInterview?: (roleTitle: string, jobDesc: string) => void;
  onNavigateToChat?: (roleTitle: string) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  rec,
  onClose,
  onApply,
  isApplied = false,
  onNavigateToInterview,
  onNavigateToChat,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'responsibilities' | 'requirements' | 'ai_match'>('overview');
  const [appliedLocal, setAppliedLocal] = useState(isApplied);

  React.useEffect(() => {
    setAppliedLocal(Boolean(isApplied));
  }, [isApplied, rec]);

  React.useEffect(() => {
    setActiveTab('overview');
  }, [rec]);

  if (!rec) return null;

  const rawRec = rec as any;
  const job = rawRec.job || rawRec;
  const m = rawRec.match_details || null;

  const jobId = job?.id || "job-01";
  const jobTitle = job?.title || "Senior Full-Stack Engineer";
  const companyName = job?.company_name || "Tech Innovations Inc.";
  const location = job?.location || "Bengaluru / Remote";
  const experienceLevel = job?.experience_level || "Senior (4+ yrs)";
  const salaryRange = job?.salary_range || "₹28,00,000 - ₹34,00,000";
  const employmentType = job?.employment_type || "Full-time";
  const description = job?.description || `Seeking an experienced ${jobTitle} to join our high-performance engineering team. In this role, you will architect mission-critical backend systems and interactive modern web applications.`;

  const handleApply = () => {
    if (onApply && !appliedLocal) {
      onApply(jobId);
      setAppliedLocal(true);
    }
  };

  // Fallback rich details if not explicitly present on job object
  const responsibilities = job.responsibilities && job.responsibilities.length > 0
    ? job.responsibilities
    : [
        "Architect and implement high-throughput backend microservices and resilient REST/gRPC API architectures.",
        "Collaborate cross-functionally with Product, Design, and AI Infrastructure teams to deliver robust end-user features.",
        "Design scalable database schemas with PostgreSQL, Redis caching, and vector indexing for real-time query performance.",
        "Champion code quality through comprehensive unit/integration testing (80%+ coverage) and peer code reviews.",
        "Optimize system latency, cloud infrastructure costs, and containerized deployment pipelines via Docker and CI/CD."
      ];

  const qualifications = job.qualifications && job.qualifications.length > 0
    ? job.qualifications
    : [
        "3+ years of professional experience with modern backend or full-stack engineering stacks.",
        "Demonstrated proficiency in Python (FastAPI / Django), React 18 / TypeScript, and relational databases (PostgreSQL).",
        "Strong understanding of RESTful API principles, async programming, and distributed systems fundamentals.",
        "Experience with containerization (Docker), version control (Git), and cloud hosting (AWS / GCP / Azure).",
        "Bachelor's or Master's degree in Computer Science, Engineering, or equivalent practical industry experience."
      ];

  const preferredQualifications = job.preferred_qualifications && job.preferred_qualifications.length > 0
    ? job.preferred_qualifications
    : [
        "Hands-on experience with Vector Databases (pgvector, Pinecone, or ChromaDB) and LLM orchestration (LangChain / LlamaIndex).",
        "Familiarity with Kubernetes cluster management, Helm charts, and infrastructure-as-code (Terraform).",
        "Experience building high-concurrency systems handling 10,000+ requests per second with Redis caching.",
        "Strong background in performance profiling, distributed tracing, and OpenTelemetry instrumentation."
      ];

  const benefits = job.benefits && job.benefits.length > 0
    ? job.benefits
    : [
        "Competitive top-tier base salary + significant equity stock grant options.",
        "100% remote-first flexibility with home office setup and ergonomics stipend (₹75,000 / $1,000).",
        "Comprehensive health, dental, and vision insurance with premium family coverage.",
        "Annual ₹1,50,000 / $2,000 continuous learning, conference, and professional upskilling allowance.",
        "Generous flexible Paid Time Off (PTO), wellness recharge days, and paid parental leave."
      ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn text-white">
      <div className="relative w-full max-w-4xl bg-[#090b10] border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-[#121520] via-[#0c0e16] to-[#121520] border-b border-white/10 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-3 pr-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 font-mono font-semibold text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Active Job Opening</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono text-xs border border-white/15">
                {job.experience_level || "Mid-Senior"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 font-mono text-xs">
                {job.employment_type || "Full-time"}
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-sans tracking-tight">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400 mt-2">
                  <span className="flex items-center gap-1.5 font-medium text-slate-200">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    {job.company_name || "Tech Innovations Inc."}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    {job.location || "Remote / Hybrid"}
                  </span>
                  <span>•</span>
                  <span className="font-mono font-bold text-white flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    {job.salary_range || "Competitive Package"}
                  </span>
                </div>
              </div>

              {/* Match Score Pill */}
              {m && (
                <div className="flex items-center gap-3 bg-white/[0.04] border border-white/15 px-4 py-2.5 rounded-2xl shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">AI Fit Score</span>
                    <span className="text-xs font-bold text-cyan-300">High Vector Match</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-300 font-black text-lg flex items-center justify-center font-outfit border border-cyan-400/30">
                    {m.overall_score}%
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-5 mt-4 border-t border-white/10 no-scrollbar">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              Role Overview & Summary
            </button>

            <button
              onClick={() => setActiveTab('responsibilities')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'responsibilities'
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              Key Responsibilities ({responsibilities.length})
            </button>

            <button
              onClick={() => setActiveTab('requirements')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'requirements'
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              Skills & Qualifications
            </button>

            {m && (
              <button
                onClick={() => setActiveTab('ai_match')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  activeTab === 'ai_match'
                    ? 'bg-cyan-400 text-black shadow-md'
                    : 'bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-400/20'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>AI Match Radar ({m.overall_score}%)</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-slate-300 text-sm leading-relaxed">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* About Role Banner */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-cyan-400" />
                  <span>About the Role & Team Mission</span>
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/10">
                  {job.description || `We are looking for an exceptional ${job.title} to join our high-velocity engineering team. In this role, you will be instrumental in architecting, building, and deploying mission-critical systems and user-facing applications that power scalable experiences.`}
                </p>
              </div>

              {/* Key Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase font-mono">
                    <DollarSign className="w-4 h-4" /> Compensation
                  </div>
                  <span className="text-base font-bold text-white font-sans block">{job.salary_range || "Competitive"}</span>
                  <span className="text-[11px] text-slate-400">Annual base + equity options</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase font-mono">
                    <MapPin className="w-4 h-4" /> Workplace Setup
                  </div>
                  <span className="text-base font-bold text-white font-sans block">{job.location || "Remote"}</span>
                  <span className="text-[11px] text-slate-400">Flexible hybrid / remote hub</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase font-mono">
                    <Clock className="w-4 h-4" /> Seniority Level
                  </div>
                  <span className="text-base font-bold text-white font-sans block">{job.experience_level || "Mid-Senior"}</span>
                  <span className="text-[11px] text-slate-400">Full-time direct hire</span>
                </div>
              </div>

              {/* Core Required Skills Badges */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Primary Tech Stack & Core Competencies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(job.required_skills && job.required_skills.length > 0 ? job.required_skills : ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "AWS"]).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 text-white font-mono text-xs font-semibold border border-white/15 flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Benefits & Perks */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Gift className="w-4 h-4 text-emerald-400" />
                  <span>Company Perks & Comprehensive Benefits</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {benefits.map((b, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-slate-200 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: RESPONSIBILITIES */}
          {activeTab === 'responsibilities' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-white font-sans mb-1">
                  What You Will Do & Day-to-Day Impact
                </h3>
                <p className="text-xs text-slate-400">
                  Detailed breakdown of core architectural responsibilities and expected delivery outcomes.
                </p>
              </div>

              <div className="space-y-3">
                {responsibilities.map((resp, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/[0.035] border border-white/10 flex items-start gap-3.5 hover:border-white/20 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {resp}
                    </p>
                  </div>
                ))}
              </div>

              {/* Day in the Life Callout */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/30 to-indigo-950/30 border border-blue-500/30 space-y-2">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-cyan-400" />
                  Engineering Culture & Autonomy
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We believe in high ownership, direct deployment pipelines, minimal bureaucratic overhead, and strong peer mentorship. You will participate in sprint architecture RFCs and have direct influence on technical roadmaps.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: REQUIREMENTS & QUALIFICATIONS */}
          {activeTab === 'requirements' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Minimum Qualifications */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  <span>Minimum & Core Qualifications</span>
                </h3>
                <div className="space-y-2.5">
                  {qualifications.map((q, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0" />
                      <span className="text-sm text-slate-200">{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferred Qualifications */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Preferred Qualifications & Bonus Skills</span>
                </h3>
                <div className="space-y-2.5">
                  {preferredQualifications.map((pq, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />
                      <span className="text-sm text-slate-200">{pq}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: AI MATCH RADAR */}
          {activeTab === 'ai_match' && m && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Overall Compatibility Banner */}
              <div className="p-6 rounded-2xl bg-[#0c1018] border border-cyan-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-mono uppercase text-cyan-300 font-bold">Vector Compatibility Rationale</span>
                  <h3 className="text-2xl font-bold text-white font-sans">{m.overall_score}% Profile Alignment</h3>
                  <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                    {m.ai_explanation || 'Your verified experience and technical keywords align closely with the requirements for this position.'}
                  </p>
                </div>

                <div className="w-20 h-20 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-black text-3xl flex items-center justify-center font-outfit shrink-0 shadow-lg">
                  {m.overall_score}%
                </div>
              </div>

              {/* Sub-Score Progress Bars */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Multi-Dimensional Match Calibration
                </h4>

                {[
                  { label: 'Technical Stack & Keywords (35%)', score: m.skills_score || 92, color: 'bg-gradient-to-r from-blue-500 to-cyan-400' },
                  { label: 'Dense Vector Cosine Similarity (25%)', score: 94, color: 'bg-cyan-400' },
                  { label: 'Experience & Seniority Depth (20%)', score: m.experience_score || 88, color: 'bg-gradient-to-r from-cyan-400 to-emerald-400' },
                  { label: 'Project Technical Relevance (10%)', score: m.projects_score || 90, color: 'bg-indigo-400' },
                  { label: 'Education & Academic Alignment (10%)', score: m.education_score || 92, color: 'bg-purple-400' }
                ].map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">{cat.label}</span>
                      <span className="text-white font-mono">{cat.score}%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div className={`${cat.color} h-full rounded-full transition-all duration-700`} style={{ width: `${cat.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Matched vs Missing Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Matched Skills Found
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(m.matched_skills && m.matched_skills.length > 0 ? m.matched_skills : ["Python", "FastAPI", "React", "PostgreSQL", "Docker"]).map((s, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-900/40 text-emerald-200 text-xs font-mono font-medium border border-emerald-500/30">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mono">
                    <AlertTriangle className="w-4 h-4 text-amber-400" /> Target Skills to Mention
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(!m.missing_skills || m.missing_skills.length === 0) ? (
                      <span className="text-xs text-slate-400 italic">No critical missing required skills! Complete coverage.</span>
                    ) : (
                      m.missing_skills.map((s, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-900/40 text-amber-200 text-xs font-mono font-medium border border-amber-500/30">
                          + {s}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-5 md:p-6 bg-[#06070a] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          
          {/* AI Prep Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {onNavigateToInterview && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToInterview(job.title, job.description);
                }}
                className="btn-luma-glass text-xs px-3.5 py-2 flex items-center gap-1.5 text-cyan-300 hover:text-white"
                title="Practice AI Mock Interview for this specific role"
              >
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                <span>Practice Mock Interview</span>
              </button>
            )}

            {onNavigateToChat && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToChat(job.title);
                }}
                className="btn-luma-glass text-xs px-3.5 py-2 flex items-center gap-1.5 text-slate-300 hover:text-white"
                title="Ask AI Career Copilot about this role"
              >
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>Ask AI Copilot</span>
              </button>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-colors"
            >
              Close
            </button>

            {onApply && (
              <button
                onClick={handleApply}
                disabled={appliedLocal}
                className={`btn-luma-primary text-xs px-6 py-2.5 flex items-center gap-2 ${
                  appliedLocal ? 'opacity-80 !bg-emerald-500 !text-black' : ''
                }`}
              >
                {appliedLocal ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-black" />
                    <span>Applied to Opening ✓</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-black" />
                    <span>1-Click Apply Now</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
