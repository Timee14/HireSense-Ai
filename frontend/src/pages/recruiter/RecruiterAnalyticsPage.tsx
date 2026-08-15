import React from 'react';
import { BarChart3, Users, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';
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
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 text-white">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#064e3b] border border-[#34d399]/40 font-bold text-xs text-[#34d399]">
          <Sparkles className="w-4 h-4 text-[#34d399]" />
          <span className="uppercase tracking-wider font-mono">Talent Funnel Intelligence</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white font-outfit mt-2">Recruitment Analytics</h1>
        <p className="text-sm text-emerald-100/70 mt-1">Conversion funnel metrics, match score distribution, and requested skill frequencies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pipeline Funnel */}
        <div className="emerald-card space-y-6">
          <h3 className="text-base font-bold text-white uppercase tracking-wider font-outfit">Hiring Pipeline Conversion Funnel</h3>
          
          <div className="space-y-4">
            {[
              { label: 'Applications Received', count: stages.applied || 50, color: 'bg-[#10b981]' },
              { label: 'Under Review', count: stages.under_review || 22, color: 'bg-[#34d399]' },
              { label: 'AI Shortlisted (>85% Match)', count: stages.shortlisted || 14, color: 'bg-[#38bdf8]' },
              { label: 'Interviews Scheduled', count: stages.interview || 8, color: 'bg-[#6ee7b7]' },
              { label: 'Declined', count: stages.rejected || 6, color: 'bg-rose-500' },
            ].map((st, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-emerald-100/70">{st.label}</span>
                  <span className="text-white font-mono">{st.count} Candidates</span>
                </div>
                <div className="w-full bg-[#022c22] h-3 rounded-full overflow-hidden border border-[#34d399]/30">
                  <div className={`${st.color} h-full rounded-full`} style={{ width: `${Math.min(100, (st.count / 50) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Demand Distribution */}
        <div className="emerald-card space-y-6">
          <h3 className="text-base font-bold text-white uppercase tracking-wider font-outfit">Top Requested Technical Competencies</h3>

          <div className="space-y-4">
            {[
              { skill: 'Python (FastAPI / AI)', pct: 95 },
              { skill: 'React & TypeScript', pct: 88 },
              { skill: 'PostgreSQL & pgvector', pct: 80 },
              { skill: 'Docker & Microservices', pct: 72 },
              { skill: 'AWS Cloud & Redis', pct: 65 }
            ].map((sk, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-emerald-100/70">{sk.skill}</span>
                  <span className="text-[#34d399] font-mono">{sk.pct}% Demand</span>
                </div>
                <div className="w-full bg-[#022c22] h-3 rounded-full overflow-hidden border border-[#34d399]/30">
                  <div className="bg-gradient-to-r from-[#10b981] to-[#38bdf8] h-full rounded-full" style={{ width: `${sk.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
