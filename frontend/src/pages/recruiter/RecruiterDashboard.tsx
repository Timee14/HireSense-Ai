import React from 'react';
import { Briefcase, Users, CheckCircle2, Sparkles, BarChart3, PlusCircle, ArrowUpRight, Cpu } from 'lucide-react';
import { RecruiterProfile, Job, RecruiterAnalytics } from '../../types';

interface RecruiterDashboardProps {
  profile: RecruiterProfile | null;
  analytics: RecruiterAnalytics | null;
  jobs: Job[];
  onNavigate: (tab: string) => void;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({
  profile,
  analytics,
  jobs,
  onNavigate
}) => {
  const kpis = analytics?.kpis || {
    total_jobs: jobs.length || 10,
    active_jobs: jobs.length || 10,
    total_applicants: 50,
    shortlisted_count: 14,
    interview_count: 8,
    avg_match_score: 88
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#064e3b] border border-[#34d399]/40 font-bold text-xs text-[#34d399]">
            <Sparkles className="w-4 h-4 text-[#34d399]" />
            <span className="uppercase tracking-wider font-mono">Talent Intelligence Command Center</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-outfit mt-2">
            Talent Intelligence
          </h1>
          <p className="text-sm text-emerald-100/70 mt-1">{profile?.company_name || 'Tech Innovations Inc.'} • Automated multi-vector applicant ranking.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('create_job')}
            className="btn-sky-blue w-full sm:w-auto"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>Create AI Job Posting</span>
          </button>
        </div>
      </div>

      {/* Hero Metric & Asymmetric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        
        {/* Large Hero Metric Box: 1,248 Candidates Analyzed */}
        <div className="sm:col-span-2 emerald-card space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-[#34d399] uppercase tracking-widest">Total Candidates Evaluated</span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-5xl md:text-6xl font-black text-white font-outfit tracking-tight">1,248</span>
              <span className="text-xs text-[#6ee7b7] font-bold font-mono">+128 this week</span>
            </div>
          </div>
          <div className="emerald-ai-insight">
            <span className="font-bold text-[#34d399]">AI Screening Status:</span> 50 active candidate applications parsed and vector-matched across 10 open job requisitions.
          </div>
        </div>

        {/* Medium Cards */}
        <div className="emerald-card space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-[#38bdf8] uppercase tracking-wider">Shortlisted Fit</span>
            <span className="text-5xl font-black text-white font-outfit block mt-2">{kpis.shortlisted_count}</span>
          </div>
          <p className="text-xs text-emerald-100/70 font-medium">Candidates matching &gt;85% vector similarity</p>
        </div>

        <div className="emerald-card space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-[#34d399] uppercase tracking-wider">Avg Match Fit</span>
            <span className="text-5xl font-black text-white font-outfit block mt-2">{kpis.avg_match_score}%</span>
          </div>
          <p className="text-xs text-emerald-100/70 font-medium">Overall technical & experience match score</p>
        </div>

      </div>

      {/* Action Pipeline Navigation Banner */}
      <div className="emerald-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white font-outfit">Candidate Screening Pipeline</h3>
          <p className="text-xs text-emerald-100/70">Review candidate ranks, view AI rationale explanations, and transition candidates through pipeline stages.</p>
        </div>

        <button
          onClick={() => onNavigate('screening')}
          className="btn-sky-blue w-full sm:w-auto shrink-0"
        >
          <span>Open Screening Dashboard</span>
          <ArrowUpRight className="w-4 h-4 text-white" />
        </button>
      </div>

    </div>
  );
};
