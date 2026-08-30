import React from 'react';
import { FileText, Briefcase, Award, ArrowUpRight, Target, Sparkles, CheckCircle2, Cpu, ArrowRight, TrendingUp, BrainCircuit, Mic, Zap } from 'lucide-react';
import { User, CandidateProfile, Resume, JobRecommendation } from '../../types';

interface CandidateDashboardProps {
  user?: User | null;
  profile: CandidateProfile | null;
  resume: Resume | null;
  recommendations: JobRecommendation[];
  onNavigate: (tab: string) => void;
  onApply: (jobId: string) => void;
}

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({
  user,
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

  const displayName = user?.name || profile?.full_name || 'Candidate';
  const firstName = displayName.trim().split(' ')[0] || 'Candidate';

  const getScoreColor = (val: number) => {
    if (val >= 80) return '#38bdf8';
    if (val >= 65) return '#60a5fa';
    if (val >= 40) return '#f59e0b';
    return '#f43f5e';
  };

  const scoreStroke = getScoreColor(resumeScore);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 text-white animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 font-mono font-semibold text-xs text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="uppercase tracking-wider">Candidate Intelligence</span>
          </div>
          <h1 className="font-editorial text-3xl md:text-5xl font-normal text-white tracking-tight">
            Welcome back, {firstName}.
          </h1>
          <p className="text-sm text-slate-400">
            Career Tier: <strong className="text-white">{careerLevel}</strong> • High-Dimensional Vector Calibrated
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('ai_interview')}
            className="btn-luma-primary flex items-center gap-2"
          >
            <BrainCircuit className="w-4 h-4 text-black" />
            <span>AI Mock Studio</span>
          </button>

          <button
            onClick={() => onNavigate('resume_analyzer')}
            className="btn-luma-glass flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-slate-300" />
            <span>ATS Scanner</span>
          </button>
        </div>
      </div>

      {/* AI Interview Studio Hero Banner */}
      <div className="luma-card p-6 border border-white/15 bg-gradient-to-r from-[#12141d]/90 via-[#0e1018]/90 to-[#12141d]/90 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center shrink-0 shadow-lg text-cyan-300">
            <BrainCircuit className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-slate-300 text-[10px] font-mono font-semibold uppercase tracking-wider">
                Interactive Studio
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-[10px] font-mono">
                Speech-to-Text & STAR Rubrics
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
              AI Interview Practice & Skill-Up Studio
            </h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Practice live role-specific interview questions with speech transcription, 30-second silence cues, and instant quantitative feedback.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('ai_interview')}
          className="btn-luma-primary px-5 py-2.5 text-xs sm:text-sm shrink-0 flex items-center gap-2 font-bold cursor-pointer"
        >
          <Mic className="w-4 h-4 text-black" />
          <span>Launch AI Interview</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        <div className="luma-card p-5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">ATS Score</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/10">
              {scoreTier}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-white font-outfit tracking-tight">{resumeScore}</span>
            <span className="text-xs text-slate-400 font-mono font-bold">/ 100</span>
          </div>
          <p className="text-xs text-slate-400">
            {resumeScore < 45 ? "Needs metric & impact fixes" : "Calibrated against top ATS benchmarks"}
          </p>
        </div>

        <div className="luma-card p-5 space-y-2">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Top Job Match</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-cyan-300 font-outfit tracking-tight">{topMatchScore}%</span>
            <span className="text-xs text-slate-400 font-mono font-bold">Fit</span>
          </div>
          <p className="text-xs text-slate-400 truncate">{topMatchTitle}</p>
        </div>

        <div className="luma-card p-5 space-y-2">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Matched Openings</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-white font-outfit tracking-tight">{recommendations.length}</span>
            <span className="text-xs text-slate-400 font-mono font-bold">Active</span>
          </div>
          <p className="text-xs text-slate-400">Ranked by cosine vector distance</p>
        </div>

        <div className="luma-card p-5 space-y-2">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">Recruiter Checks</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-white font-outfit tracking-tight">
              {analysis?.recruiter_checks?.filter(c => c.status !== 'passed').length ?? 3}
            </span>
            <span className="text-xs text-amber-400 font-bold">Suggestions</span>
          </div>
          <p className="text-xs text-slate-400">Action verbs & quantified metrics</p>
        </div>

      </div>

      {/* Asymmetric Panel Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Resume Score Ring */}
        <div className="md:col-span-2 luma-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Screening Rubric</span>
              <h2 className="text-xl font-bold text-white font-sans">Resume Intelligence Breakdown</h2>
            </div>
            <button
              onClick={() => onNavigate('resume_analyzer')}
              className="text-xs font-bold text-cyan-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>View Full Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            
            {/* Score Ring */}
            <div className="relative inline-flex items-center justify-center w-36 h-36 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="58" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="8" fill="transparent" />
                <circle
                  cx="72"
                  cy="72"
                  r="58"
                  stroke={scoreStroke}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="364"
                  strokeDashoffset={364 - (364 * resumeScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-white font-outfit">{resumeScore}</span>
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">SCORE</span>
              </div>
            </div>

            <div className="space-y-3.5 flex-1 w-full text-xs">
              <div>
                <div className="flex justify-between font-medium mb-1.5">
                  <span className="text-slate-300">Impact & Quantified Outcomes</span>
                  <span className="text-white font-mono font-bold">{impactScore}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700" style={{ width: `${impactScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1.5">
                  <span className="text-slate-300">Technical Skills Coverage</span>
                  <span className="text-white font-mono font-bold">{skillsScore}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-700" style={{ width: `${skillsScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1.5">
                  <span className="text-slate-300">Experience & Seniority Depth</span>
                  <span className="text-white font-mono font-bold">{experienceScore}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-700" style={{ width: `${experienceScore}%` }} />
                </div>
              </div>
            </div>

          </div>

          <div className="luma-card-subtle p-4 rounded-xl space-y-1">
            <div className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI CAREER & RESUME ROADMAP</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {analysis?.suggestions?.[0] || "Quantify your project outcomes with metrics, %, and scale to gain +15-20 ATS points."}
            </p>
          </div>
        </div>

        {/* Right Col: Top Recommended Jobs */}
        <div className="luma-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-sans">Top Job Matches</h2>
            <button
              onClick={() => onNavigate('job_recs')}
              className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec) => (
              <div
                key={rec.job.id}
                className="p-3.5 rounded-xl bg-white/[0.035] border border-white/10 hover:border-white/20 transition-all space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-white font-sans">{rec.job.title}</h3>
                    <p className="text-xs text-slate-400">{rec.job.company_name} • {rec.job.location}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-mono text-xs font-bold border border-white/15 shrink-0">
                    {rec.match_details.overall_score}%
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {rec.job.experience_level}
                  </span>
                  <button
                    onClick={() => onApply(rec.job.id)}
                    className="text-xs font-bold text-white hover:underline flex items-center gap-1"
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
