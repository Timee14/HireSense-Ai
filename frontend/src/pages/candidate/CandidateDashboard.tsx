import React from 'react';
import { FileText, Briefcase, Award, ArrowUpRight, Target, Sparkles, CheckCircle2, Cpu, ArrowRight, TrendingUp } from 'lucide-react';
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
  const analysis = resume?.analysis;
  const resumeScore = analysis?.overall_score ?? (resume ? 35 : 0);
  const scoreTier = analysis?.score_tier || (resumeScore >= 80 ? "Elite" : resumeScore >= 65 ? "Competitive" : resumeScore >= 40 ? "Developing" : "Needs Work");
  const careerLevel = analysis?.career_level || "Entry-Level Candidate";
  const topMatchScore = recommendations[0]?.match_details.overall_score || 70;
  const topMatchTitle = recommendations[0]?.job.title || "Software Developer";

  const impactScore = analysis?.impact_score ?? 15;
  const skillsScore = analysis?.skills_score ?? 85;
  const experienceScore = analysis?.experience_score ?? 20;

  const getScoreColor = (val: number) => {
    if (val >= 80) return '#10b981';
    if (val >= 65) return '#14b8a6';
    if (val >= 40) return '#f59e0b';
    return '#f43f5e';
  };

  const scoreStroke = getScoreColor(resumeScore);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 text-white animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#064e3b] border border-[#34d399]/40 font-bold text-xs text-[#34d399]">
            <Sparkles className="w-4 h-4 text-[#34d399]" />
            <span className="uppercase tracking-wider">Career Intelligence Command Center</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white font-outfit mt-2">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Candidate'}.
          </h1>
          <p className="text-sm text-emerald-100/70 mt-1">
            Career Tier: <strong className="text-emerald-300">{careerLevel}</strong> • ATS Benchmark Calibrated
          </p>
        </div>

        <button
          onClick={() => onNavigate('resume_analyzer')}
          className="btn-emerald-cta w-full sm:w-auto"
        >
          <FileText className="w-5 h-5 text-white" />
          <span>Detailed ATS Intelligence</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="emerald-card space-y-2 border border-[#34d399]/30">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-[#34d399] uppercase tracking-wider">ATS Score</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
              {scoreTier}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-white font-outfit tracking-tight">{resumeScore}</span>
            <span className="text-xs text-[#34d399] font-bold">/ 100</span>
          </div>
          <p className="text-xs text-emerald-100/70">
            {resumeScore < 45 ? "Needs metric & impact fixes" : "Calibrated against ATS benchmarks"}
          </p>
        </div>

        <div className="emerald-card space-y-2 border border-[#34d399]/30">
          <span className="text-xs font-mono font-bold text-[#6ee7b7] uppercase tracking-wider">Top Job Match</span>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-white font-outfit tracking-tight">{topMatchScore}%</span>
            <span className="text-xs text-[#6ee7b7] font-bold">Fit</span>
          </div>
          <p className="text-xs text-emerald-100/70 truncate">{topMatchTitle}</p>
        </div>

        <div className="emerald-card space-y-2 border border-[#34d399]/30">
          <span className="text-xs font-mono font-bold text-[#34d399] uppercase tracking-wider">Matched Openings</span>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-white font-outfit tracking-tight">{recommendations.length}</span>
            <span className="text-xs text-emerald-100/70 font-bold">Active</span>
          </div>
          <p className="text-xs text-emerald-100/70">Ranked by seniority fit</p>
        </div>

        <div className="emerald-card space-y-2 border border-[#34d399]/30">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">Recruiter Fixes</span>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-white font-outfit tracking-tight">
              {analysis?.recruiter_checks?.filter(c => c.status !== 'passed').length ?? 3}
            </span>
            <span className="text-xs text-amber-400 font-bold">Issues</span>
          </div>
          <p className="text-xs text-emerald-100/70">Quantified metrics & action verbs</p>
        </div>

      </div>

      {/* Asymmetric Panel Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Resume Score Ring */}
        <div className="md:col-span-2 emerald-card space-y-6 border border-[#34d399]/30">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-[#34d399] uppercase tracking-wider">Screening Rubric</span>
              <h2 className="text-xl font-bold text-white font-outfit">Resume Intelligence Breakdown</h2>
            </div>
            <button
              onClick={() => onNavigate('resume_analyzer')}
              className="text-xs font-bold text-[#34d399] hover:underline flex items-center gap-1"
            >
              <span>View Full Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            
            {/* Score Ring */}
            <div className="relative inline-flex items-center justify-center w-36 h-36 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="58" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="10" fill="transparent" />
                <circle
                  cx="72"
                  cy="72"
                  r="58"
                  stroke={scoreStroke}
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="364"
                  strokeDashoffset={364 - (364 * resumeScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-white font-outfit">{resumeScore}</span>
                <span className="text-[10px] text-slate-300 font-bold uppercase">OVERALL</span>
              </div>
            </div>

            <div className="space-y-3 flex-1 w-full text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-emerald-100/70">Impact & Quantified Outcomes</span>
                  <span className={impactScore >= 50 ? "text-[#34d399]" : "text-rose-400"}>{impactScore}%</span>
                </div>
                <div className="w-full bg-[#022c22] h-2 rounded-full overflow-hidden border border-[#34d399]/30">
                  <div className={`h-full rounded-full transition-all duration-700 ${impactScore >= 50 ? "bg-[#34d399]" : "bg-rose-500"}`} style={{ width: `${impactScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-emerald-100/70">Technical Skills Coverage</span>
                  <span className="text-[#6ee7b7]">{skillsScore}%</span>
                </div>
                <div className="w-full bg-[#022c22] h-2 rounded-full overflow-hidden border border-[#34d399]/30">
                  <div className="bg-[#6ee7b7] h-full rounded-full transition-all duration-700" style={{ width: `${skillsScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-emerald-100/70">Experience & Seniority Depth</span>
                  <span className={experienceScore >= 50 ? "text-emerald-400" : "text-amber-400"}>{experienceScore}%</span>
                </div>
                <div className="w-full bg-[#022c22] h-2 rounded-full overflow-hidden border border-[#34d399]/30">
                  <div className={`h-full rounded-full transition-all duration-700 ${experienceScore >= 50 ? "bg-emerald-400" : "bg-amber-500"}`} style={{ width: `${experienceScore}%` }} />
                </div>
              </div>
            </div>

          </div>

          <div className="emerald-ai-insight">
            <div className="text-xs font-bold text-[#34d399] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#34d399]" />
              <span>AI CAREER & RESUME ROADMAP</span>
            </div>
            <p className="text-xs text-white leading-relaxed">
              {analysis?.suggestions?.[0] || "Quantify your project outcomes with metrics, %, and scale to gain +15-20 ATS points."}
            </p>
          </div>
        </div>

        {/* Right Col: Top Recommended Jobs */}
        <div className="emerald-card space-y-4 border border-[#34d399]/30">
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
              <div
                key={rec.job.id}
                className="p-3.5 rounded-xl bg-[#022c22] border border-[#34d399]/30 hover:border-[#34d399] transition-all space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-white font-outfit">{rec.job.title}</h3>
                    <p className="text-xs text-emerald-100/70">{rec.job.company_name} • {rec.job.location}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#064e3b] text-[#34d399] font-mono text-xs font-bold border border-[#34d399]/30 shrink-0">
                    {rec.match_details.overall_score}%
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {rec.job.experience_level}
                  </span>
                  <button
                    onClick={() => onApply(rec.job.id)}
                    className="text-xs font-bold text-[#34d399] hover:underline flex items-center gap-1"
                  >
                    <span>Apply</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
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
