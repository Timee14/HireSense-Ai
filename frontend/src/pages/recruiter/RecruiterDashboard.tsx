import React from 'react';
import { Users, FileCheck, Award, ArrowUpRight, TrendingUp, Sparkles, PlusCircle } from 'lucide-react';
import { RecruiterProfile, Job, Application, RecruiterAnalytics } from '../../types';

interface RecruiterDashboardProps {
  profile: RecruiterProfile | null;
  jobs: Job[];
  applications?: Application[];
  analytics?: RecruiterAnalytics | null;
  onNavigate: (tab: string) => void;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({
  profile,
  jobs,
  applications = [],
  analytics,
  onNavigate
}) => {
  const kpis = analytics?.kpis || {
    total_jobs: jobs.length,
    active_jobs: jobs.length,
    total_applicants: 50,
    shortlisted_count: 14,
    interview_count: 8,
    avg_match_score: 84
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 text-white animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 font-mono font-semibold text-xs text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="uppercase tracking-wider font-mono">Talent Intelligence Command Center</span>
          </div>
          <h1 className="font-editorial text-3xl md:text-5xl font-normal text-white tracking-tight mt-2">
            Talent Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1">{profile?.company_name || 'Tech Innovations Inc.'} • Automated multi-vector applicant ranking.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('create_job')}
            className="btn-luma-primary w-full sm:w-auto flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-black" />
            <span>Create AI Job Posting</span>
          </button>
        </div>
      </div>

      {/* Hero Metric & Asymmetric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        
        {/* Large Hero Metric Box: 1,248 Candidates Analyzed */}
        <div className="sm:col-span-2 luma-card p-6 space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Total Candidates Evaluated</span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-5xl md:text-6xl font-black text-white font-outfit tracking-tight">1,248</span>
              <span className="text-xs text-cyan-300 font-bold font-mono">+128 this week</span>
            </div>
          </div>
          <div className="luma-card-subtle p-3.5 rounded-xl space-y-1">
            <span className="font-bold text-cyan-300">AI Screening Status:</span> <span className="text-slate-300 text-xs">50 active candidate applications parsed and vector-matched across 10 open job requisitions.</span>
          </div>
        </div>

        {/* Medium Cards */}
        <div className="luma-card p-6 space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Shortlisted Fit</span>
            <span className="text-4xl sm:text-5xl font-black text-white font-outfit block mt-2">{kpis.shortlisted_count}</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Candidates matching &gt;85% vector similarity</p>
        </div>

        <div className="luma-card p-6 space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Avg Match Fit</span>
            <span className="text-4xl sm:text-5xl font-black text-cyan-300 font-outfit block mt-2">{kpis.avg_match_score}%</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Overall technical & experience match score</p>
        </div>

      </div>

      {/* Action Pipeline Navigation Banner */}
      <div className="luma-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white font-sans">Candidate Screening Pipeline</h3>
          <p className="text-xs text-slate-400">Review candidate ranks, view AI rationale explanations, and transition candidates through pipeline stages.</p>
        </div>

        <button
          onClick={() => onNavigate('screening')}
          className="btn-luma-primary w-full sm:w-auto shrink-0 flex items-center justify-center gap-2"
        >
          <span>Open Screening Dashboard</span>
          <ArrowUpRight className="w-4 h-4 text-black" />
        </button>
      </div>

    </div>
  );
};
