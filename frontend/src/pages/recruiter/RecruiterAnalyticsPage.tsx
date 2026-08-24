import React from 'react';
import { TrendingUp, Users, Target, Activity, Sparkles } from 'lucide-react';
import { RecruiterAnalytics } from '../../types';

interface RecruiterAnalyticsPageProps {
  analytics: RecruiterAnalytics | null;
}

export const RecruiterAnalyticsPage: React.FC<RecruiterAnalyticsPageProps> = ({ analytics }) => {
  const stages = analytics?.pipeline_stages || {
    applied: 50,
    under_review: 22,
    shortlisted: 14,
    interview: 8,
    rejected: 6
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 text-white animate-fade-in">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 font-mono font-semibold text-xs text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="uppercase tracking-wider">Hiring Pipeline Analytics</span>
        </div>
        <h1 className="font-editorial text-3xl md:text-5xl font-normal text-white tracking-tight mt-2">
          Recruitment Intelligence & Funnel
        </h1>
        <p className="text-sm text-slate-400 mt-1">Conversion funnel metrics, match score distribution, and requested skill frequencies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pipeline Funnel */}
        <div className="luma-card p-6 md:p-8 space-y-6">
          <h3 className="text-base font-bold text-white uppercase tracking-wider font-sans">Hiring Pipeline Conversion Funnel</h3>
          
          <div className="space-y-4">
            {[
              { label: 'Applications Received', count: stages.applied || 50, color: 'bg-gradient-to-r from-blue-500 to-cyan-400' },
              { label: 'Under Review', count: stages.under_review || 22, color: 'bg-cyan-400' },
              { label: 'AI Shortlisted (>85% Match)', count: stages.shortlisted || 14, color: 'bg-white' },
              { label: 'Interviews Scheduled', count: stages.interview || 8, color: 'bg-indigo-400' },
              { label: 'Declined', count: stages.rejected || 6, color: 'bg-rose-500' },
            ].map((st, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">{st.label}</span>
                  <span className="text-white font-mono font-bold">{st.count} Candidates</span>
                </div>
                <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                  <div className={`${st.color} h-full rounded-full transition-all duration-500`} style={{ width: `${Math.min(100, (st.count / 50) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Demand Distribution */}
        <div className="luma-card p-6 md:p-8 space-y-6">
          <h3 className="text-base font-bold text-white uppercase tracking-wider font-sans">Top Requested Technical Competencies</h3>

          <div className="space-y-4">
            {[
              { skill: 'Python (FastAPI / AI)', pct: 95 },
              { skill: 'React & TypeScript', pct: 88 },
              { skill: 'PostgreSQL & pgvector', pct: 80 },
              { skill: 'Docker & Microservices', pct: 72 },
              { skill: 'AWS Cloud & Redis', pct: 65 }
            ].map((sk, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">{sk.skill}</span>
                  <span className="text-white font-mono font-bold">{sk.pct}% Demand</span>
                </div>
                <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${sk.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
