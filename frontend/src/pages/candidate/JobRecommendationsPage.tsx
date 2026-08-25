import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Award, ChevronRight, Send, CheckCircle2, Sparkles, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { JobRecommendation } from '../../types';

interface JobRecommendationsPageProps {
  recommendations: JobRecommendation[];
  onApply: (jobId: string) => void;
  onOpenMatchModal: (rec: JobRecommendation) => void;
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
      description: "Seeking an experienced Full-Stack Engineer skilled in Python, FastAPI, React, and PostgreSQL vector search architectures to lead scalable cloud services.",
      status: "active",
      required_skills: ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "Redis"],
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
      ai_explanation: "Exceptional match (94%) with your verified Python, FastAPI, and React experience. Highly recommended for 1-click apply."
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
      description: "Core backend & microservice API development in Python, asynchronous worker queues, and distributed data pipelines.",
      status: "active",
      required_skills: ["Python", "FastAPI", "PostgreSQL", "System Design", "AWS"],
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
      experience_level: "Mid-Senior",
      salary_range: "$140,000 - $175,000",
      description: "Building production LLM orchestration layers, pgvector embeddings search, and low-latency inference pipelines.",
      status: "active",
      required_skills: ["Python", "PyTorch", "pgvector", "FastAPI", "Docker"],
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
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedMap, setAppliedMap] = useState<Record<string, boolean>>({});

  const activeRecs = recommendations && recommendations.length > 0 ? recommendations : DEFAULT_JOBS;

  const handleApplyClick = (jobId: string) => {
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
            <span className="uppercase tracking-wider">AI Semantic Match Engine</span>
          </div>
          <h1 className="font-editorial text-3xl md:text-5xl font-normal text-white tracking-tight mt-2">Recommended Positions</h1>
          <p className="text-sm text-slate-400 mt-1">Ranked by dense vector similarity, required skill overlap, and experience fit.</p>
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
        <div className="luma-card p-6 md:p-8 space-y-6 border border-white/20 shadow-2xl">
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-white/15 text-xs font-mono font-bold">FEATURED #1 MATCH</span>
                <span className="text-xs font-bold text-slate-400 font-mono">{featured.job.company_name}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">{featured.job.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> {featured.job.location}</span>
                <span>•</span>
                <span className="font-mono font-bold text-white">{featured.job.salary_range}</span>
                <span>•</span>
                <span className="text-slate-400">{featured.job.experience_level}</span>
              </div>
            </div>

            {/* Giant Score Callout */}
            <div 
              onClick={() => onOpenMatchModal(featured)}
              className="cursor-pointer px-6 py-4 rounded-2xl bg-white/[0.035] border border-white/10 text-center hover:bg-white/[0.08] transition-all group shrink-0"
            >
              <div className="flex items-center justify-center gap-1 text-slate-300 font-bold text-xs">
                <Award className="w-4 h-4 text-cyan-400" /> AI MATCH
              </div>
              <span className="text-4xl sm:text-5xl font-black text-white font-outfit block">{featured.match_details.overall_score}%</span>
              <span className="text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1 mt-1">
                View Radar <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>

          <div className="luma-card-subtle p-4 rounded-xl space-y-1">
            <span className="font-bold text-cyan-300">AI Rationale:</span> <span className="text-slate-300 text-xs">{featured.match_details.ai_explanation || 'High compatibility score across technical skills and experience level.'}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap gap-1.5">
              {featured.job.required_skills.map((s, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-mono text-slate-300">
                  {s}
                </span>
              ))}
            </div>

            <button
              onClick={() => handleApplyClick(featured.job.id)}
              disabled={appliedMap[featured.job.id]}
              className={`btn-luma-primary text-xs px-6 py-2.5 shrink-0 ${appliedMap[featured.job.id] ? 'opacity-70 !bg-slate-300' : ''}`}
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
      )}

      {/* Grid of Remaining Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {remaining.map((rec) => (
          <div key={rec.job.id} className="luma-card p-6 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-white font-sans">{rec.job.title}</h3>
                  <p className="text-xs text-slate-400">{rec.job.company_name} • {rec.job.location}</p>
                </div>
                <div 
                  onClick={() => onOpenMatchModal(rec)}
                  className="cursor-pointer px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/15 text-center shrink-0 hover:bg-white/20 transition-all"
                >
                  <span className="font-mono font-bold text-sm">{rec.match_details.overall_score}%</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {rec.job.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {rec.job.required_skills.slice(0, 4).map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[10px] font-mono text-slate-400">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span className="text-xs font-mono font-bold text-white">{rec.job.salary_range}</span>
              <button
                onClick={() => handleApplyClick(rec.job.id)}
                disabled={appliedMap[rec.job.id]}
                className={`btn-luma-glass text-xs px-4 py-2 ${appliedMap[rec.job.id] ? 'opacity-70' : ''}`}
              >
                {appliedMap[rec.job.id] ? 'Applied ✓' : 'Apply'}
              </button>
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
