import React from 'react';
import { FileText, Briefcase, Award, ArrowUpRight, Target, Sparkles, CheckCircle2, Cpu, ArrowRight } from 'lucide-react';
import { CandidateProfile, Resume, JobRecommendation } from '../../types';

interface CandidateDashboardProps {
  profile: CandidateProfile | null;
  resume: Resume | null;
  recommendations: JobRecommendation[];
  onNavigate: (tab: string) => void;
  onApply: (jobId: string) => void;
}

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({
  profile,
  resume,
  recommendations,
  onNavigate,
  onApply
}) => {
  const resumeScore = resume?.analysis?.overall_score || 87;
  const topMatchScore = recommendations[0]?.match_details.overall_score || 94;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#064e3b] border border-[#34d399]/40 font-bold text-xs text-[#34d399]">
            <Sparkles className="w-4 h-4 text-[#34d399]" />
            <span className="uppercase tracking-wider">Career Intelligence Command Center</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white font-outfit mt-2">
            Good morning, {profile?.full_name?.split(' ')[0] || 'Alex'}.
          </h1>
          <p className="text-sm text-emerald-100/70 mt-1">Here's what your career intelligence looks like today.</p>
        </div>

        <button
          onClick={() => onNavigate('resume_analyzer')}
          className="btn-emerald-cta w-full sm:w-auto"
        >
          <FileText className="w-5 h-5 text-white" />
          <span>Analyze Resume PDF</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="emerald-card space-y-2">
          <span className="text-xs font-mono font-bold text-[#34d399] uppercase tracking-wider">Resume Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-white font-outfit tracking-tight">{resumeScore}</span>
            <span className="text-xs text-[#34d399] font-bold">/ 100</span>
          </div>
          <p className="text-xs text-emerald-100/70">High ATS & Skills Index</p>
        </div>

        <div className="emerald-card space-y-2">
          <span className="text-xs font-mono font-bold text-[#6ee7b7] uppercase tracking-wider">Best Job Match</span>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-white font-outfit tracking-tight">{topMatchScore}%</span>
            <span className="text-xs text-[#6ee7b7] font-bold">Top Fit</span>
          </div>
          <p className="text-xs text-emerald-100/70">Senior Full-Stack Engineer</p>
        </div>

        <div className="emerald-card space-y-2">
          <span className="text-xs font-mono font-bold text-[#34d399] uppercase tracking-wider">Relevant Jobs</span>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-white font-outfit tracking-tight">{recommendations.length}</span>
            <span className="text-xs text-emerald-100/70 font-bold">Active</span>
          </div>
          <p className="text-xs text-emerald-100/70">Aligned with your skills</p>
        </div>

        <div className="emerald-card space-y-2">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">Skill Gaps</span>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-white font-outfit tracking-tight">6</span>
            <span className="text-xs text-amber-400 font-bold">Identified</span>
          </div>
          <p className="text-xs text-emerald-100/70">Docker, Kubernetes, AWS</p>
        </div>

      </div>

      {/* Asymmetric Panel Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Resume Score Ring */}
        <div className="md:col-span-2 emerald-card space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-outfit">Resume Intelligence Breakdown</h2>
            <span className="px-3 py-1 rounded-full bg-[#064e3b] border border-[#34d399]/40 text-[#34d399] text-xs font-bold">
              PARSED BY AI
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            
            {/* Score Ring */}
            <div className="relative inline-flex items-center justify-center w-36 h-36 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="58" stroke="rgba(52, 211, 153, 0.2)" strokeWidth="10" fill="transparent" />
                <circle
                  cx="72"
                  cy="72"
                  r="58"
                  stroke="#34d399"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="364"
                  strokeDashoffset={364 - (364 * resumeScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-white font-outfit">{resumeScore}</span>
                <span className="text-[10px] text-emerald-100/70 font-bold">OVERALL</span>
              </div>
            </div>

            <div className="space-y-3 flex-1 w-full text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-emerald-100/70">ATS Keyword Density</span>
                  <span className="text-[#34d399]">90%</span>
                </div>
                <div className="w-full bg-[#022c22] h-2 rounded-full overflow-hidden border border-[#34d399]/30">
                  <div className="bg-[#34d399] h-full rounded-full" style={{ width: '90%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-emerald-100/70">Technical Skill Alignment</span>
                  <span className="text-[#6ee7b7]">94%</span>
                </div>
                <div className="w-full bg-[#022c22] h-2 rounded-full overflow-hidden border border-[#34d399]/30">
                  <div className="bg-[#6ee7b7] h-full rounded-full" style={{ width: '94%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-emerald-100/70">Experience Timeline Fit</span>
                  <span className="text-emerald-400">88%</span>
                </div>
                <div className="w-full bg-[#022c22] h-2 rounded-full overflow-hidden border border-[#34d399]/30">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '88%' }} />
                </div>
              </div>
            </div>

          </div>

          <div className="emerald-ai-insight">
            <div className="text-xs font-bold text-[#34d399] uppercase tracking-wider mb-1">AI CAREER RECOMMENDATION</div>
            <p className="text-xs text-white leading-relaxed">
              Your profile shows strong Python, FastAPI, and React proficiency. Adding AWS deployment metrics could increase your recruiter shortlist rate by 35%.
            </p>
          </div>
        </div>

        {/* Right Col: Top Recommended Jobs */}
        <div className="emerald-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-outfit">Top Job Matches</h2>
            <button
              onClick={() => onNavigate('job_recs')}
              className="text-xs font-bold text-[#34d399] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec) => (
              <div key={rec.job?.id} className="p-4 rounded-xl bg-[#022c22] border border-[#34d399]/30 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white font-outfit">{rec.job?.title || 'Senior Software Engineer'}</h4>
                    <span className="text-xs text-[#6ee7b7] font-medium">{rec.job?.company_name || 'Tech Partner'}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#10b981] text-white text-[10px] font-bold">
                    {rec.match_details.overall_score}% MATCH
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-emerald-100/70 font-medium">{rec.job?.location || 'Remote'}</span>
                  <button
                    onClick={() => onApply(rec.job?.id || '')}
                    className="text-xs font-bold text-[#34d399] hover:underline flex items-center gap-1"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
