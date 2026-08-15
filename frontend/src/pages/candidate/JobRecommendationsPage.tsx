import React, { useState } from 'react';
import { Search, Briefcase, MapPin, DollarSign, Sparkles, CheckCircle2, ChevronRight, Filter, Award } from 'lucide-react';
import { JobRecommendation } from '../../types';

interface JobRecommendationsPageProps {
  recommendations: JobRecommendation[];
  onApply: (jobId: string) => void;
  onOpenMatchModal: (rec: JobRecommendation) => void;
}

export const JobRecommendationsPage: React.FC<JobRecommendationsPageProps> = ({
  recommendations,
  onApply,
  onOpenMatchModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedJobs, setAppliedJobs] = useState<Record<string, boolean>>({});

  const handleApplyClick = (jobId: string) => {
    onApply(jobId);
    setAppliedJobs((prev) => ({ ...prev, [jobId]: true }));
  };

  const filtered = recommendations.filter((rec) =>
    rec.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (rec.job.company_name && rec.job.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const featured = filtered[0];
  const remaining = filtered.slice(1);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#064e3b] border border-[#34d399]/40 font-bold text-xs text-[#34d399]">
            <Sparkles className="w-4 h-4 text-[#34d399]" />
            <span className="uppercase tracking-wider">AI Semantic Match Engine</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-outfit mt-2">Recommended Positions</h1>
          <p className="text-sm text-emerald-100/70">Ranked by dense vector similarity, required skill overlap, and experience fit.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-100/50" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search role, skills, or company..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#022c22] border border-[#34d399]/30 text-xs text-white placeholder-emerald-100/40 focus:outline-none focus:border-[#34d399]"
          />
        </div>
      </div>

      {/* Featured #1 Recommendation Card */}
      {featured && (
        <div className="emerald-card space-y-6 border-2 border-[#34d399]">
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#064e3b] text-[#34d399] border border-[#34d399]/40 text-xs font-mono font-bold">FEATURED #1 MATCH</span>
                <span className="text-xs font-bold text-[#6ee7b7] font-mono">{featured.job.company_name}</span>
              </div>
              <h2 className="text-3xl font-bold text-white font-outfit">{featured.job.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-100/80">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#38bdf8]" /> {featured.job.location}</span>
                <span>•</span>
                <span className="font-mono font-bold text-white">{featured.job.salary_range}</span>
                <span>•</span>
                <span className="text-emerald-100/80">{featured.job.experience_level}</span>
              </div>
            </div>

            {/* Giant Score Callout */}
            <div 
              onClick={() => onOpenMatchModal(featured)}
              className="cursor-pointer px-6 py-4 rounded-2xl bg-[#022c22] border border-[#34d399]/40 text-center hover:bg-[#064e3b] transition-all group shrink-0"
            >
              <div className="flex items-center justify-center gap-1 text-[#34d399] font-bold text-xs">
                <Award className="w-4 h-4" /> AI MATCH
              </div>
              <span className="text-5xl font-black text-white font-outfit block">{featured.match_details.overall_score}%</span>
              <span className="text-[10px] text-[#6ee7b7] font-mono flex items-center justify-center gap-1 mt-1">
                View Radar <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>

          <div className="emerald-ai-insight">
            <span className="font-bold text-[#34d399]">AI Rationale:</span> {featured.match_details.ai_explanation || 'High compatibility score across technical skills and experience level.'}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap gap-1.5">
              {featured.job.required_skills?.map((sk, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-[#064e3b]/80 border border-[#34d399]/30 text-[#6ee7b7] text-xs font-semibold">
                  {sk}
                </span>
              ))}
            </div>

            <button
              onClick={() => handleApplyClick(featured.job.id)}
              disabled={appliedJobs[featured.job.id]}
              className={`btn-sky-blue w-full sm:w-auto ${appliedJobs[featured.job.id] ? '!bg-[#10b981] cursor-default' : ''}`}
            >
              {appliedJobs[featured.job.id] ? 'Applied ✓' : 'Apply Now'}
            </button>
          </div>

        </div>
      )}

      {/* Grid of Remaining Jobs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {remaining.map((rec) => {
          const jId = rec.job.id;
          return (
            <div key={jId} className="emerald-card flex flex-col justify-between space-y-4">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#064e3b] text-[#34d399] border border-[#34d399]/40 text-xs font-bold font-mono">
                    {rec.match_details.overall_score}% MATCH
                  </span>
                  <button
                    onClick={() => onOpenMatchModal(rec)}
                    className="text-xs text-[#34d399] font-bold hover:underline"
                  >
                    Radar
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white font-outfit">{rec.job.title}</h3>
                  <p className="text-xs text-emerald-100/70 font-medium">{rec.job.company_name} • {rec.job.location}</p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {rec.job.required_skills?.slice(0, 3).map((sk, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-[#064e3b]/80 border border-[#34d399]/30 text-[#6ee7b7] text-[11px] font-semibold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#34d399]/20 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white font-mono">{rec.job.salary_range}</span>
                <button
                  onClick={() => handleApplyClick(jId)}
                  disabled={appliedJobs[jId]}
                  className={`btn-sky-blue !h-9 !px-4 !text-xs ${appliedJobs[jId] ? '!bg-[#10b981]' : ''}`}
                >
                  {appliedJobs[jId] ? 'Applied ✓' : 'Apply'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
