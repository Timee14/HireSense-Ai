import React from 'react';
import { Target, TrendingUp, Sparkles, BookOpen, CheckCircle, Cpu } from 'lucide-react';

export const SkillGapsPage: React.FC = () => {
  const gaps = [
    { skill: 'Docker & Kubernetes', demand: 12, rec: 'Adding container orchestration skills will boost your infrastructure match score by 14% across posted senior roles.' },
    { skill: 'AWS Cloud Services', demand: 9, rec: 'AWS Solutions Architect fundamentals closely match recruiter requirements for cloud backend positions.' },
    { skill: 'Redis Caching', demand: 7, rec: 'In-memory caching experience aligns with high-throughput backend developer roles.' },
    { skill: 'GraphQL APIs', demand: 5, rec: 'Complements existing REST API experience for modern full-stack web applications.' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 text-white">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#064e3b] border border-[#34d399]/40 font-bold text-xs text-[#34d399]">
          <Sparkles className="w-4 h-4 text-[#34d399]" />
          <span className="uppercase tracking-wider font-mono">Market Skill Intelligence</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white font-outfit mt-2">Your next advantage.</h1>
        <p className="text-sm text-emerald-100/70 mt-1">Aggregated skill demand analysis across active recruiter postings in your domain.</p>
      </div>

      {/* Market Skill Cluster */}
      <div className="emerald-card space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-outfit">Target Domain Skill Cluster</h3>
        <div className="flex flex-wrap gap-2.5">
          <span className="px-4 py-2 rounded-full bg-[#064e3b] border border-[#34d399]/40 text-[#6ee7b7] text-xs font-bold">Python (Present)</span>
          <span className="px-4 py-2 rounded-full bg-[#064e3b] border border-[#34d399]/40 text-[#6ee7b7] text-xs font-bold">FastAPI (Present)</span>
          <span className="px-4 py-2 rounded-full bg-[#064e3b] border border-[#34d399]/40 text-[#6ee7b7] text-xs font-bold">React (Present)</span>
          <span className="px-4 py-2 rounded-full bg-[#064e3b] border border-[#34d399]/40 text-[#6ee7b7] text-xs font-bold">PostgreSQL (Present)</span>
          <span className="px-4 py-2 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs font-bold">Docker (Missing)</span>
          <span className="px-4 py-2 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs font-bold">Kubernetes (Missing)</span>
          <span className="px-4 py-2 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs font-bold">AWS (Missing)</span>
          <span className="px-4 py-2 rounded-full bg-[#064e3b] border border-[#34d399]/40 text-[#6ee7b7] text-xs font-bold">TypeScript (Present)</span>
        </div>
      </div>

      {/* Skill Gap Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gaps.map((g, idx) => (
          <div key={idx} className="emerald-card space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider block">Missing Competency</span>
                  <h3 className="text-xl font-bold text-white font-outfit mt-0.5">{g.skill}</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono shrink-0">
                  {g.demand} Active Jobs Requesting
                </span>
              </div>

              <div className="emerald-ai-insight">
                <span className="font-bold text-[#34d399]">AI Impact Insight:</span> {g.rec}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-100/70">
              <span className="flex items-center gap-1.5 text-[#34d399] font-bold"><TrendingUp className="w-4 h-4" /> High Career Growth Impact</span>
              <span className="text-[#38bdf8] font-bold cursor-pointer hover:underline">Recommended Learning →</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
