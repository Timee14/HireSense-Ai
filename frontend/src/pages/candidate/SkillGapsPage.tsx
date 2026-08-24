import React from 'react';
import { Target, TrendingUp, Sparkles, BookOpen, CheckCircle, Cpu, ArrowUpRight } from 'lucide-react';

export const SkillGapsPage: React.FC = () => {
  const gaps = [
    { skill: 'Docker & Kubernetes', demand: 12, rec: 'Adding container orchestration skills will boost your infrastructure match score by 14% across posted senior roles.' },
    { skill: 'AWS Cloud Services', demand: 9, rec: 'AWS Solutions Architect fundamentals closely match recruiter requirements for cloud backend positions.' },
    { skill: 'Redis Caching', demand: 7, rec: 'In-memory caching experience aligns with high-throughput backend developer roles.' },
    { skill: 'GraphQL APIs', demand: 5, rec: 'Complements existing REST API experience for modern full-stack web applications.' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 text-white animate-fade-in">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 font-mono font-semibold text-xs text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="uppercase tracking-wider font-mono">Market Skill Intelligence</span>
        </div>
        <h1 className="font-editorial text-3xl md:text-5xl font-normal text-white tracking-tight mt-2">Your next advantage.</h1>
        <p className="text-sm text-slate-400 mt-1">Aggregated skill demand analysis across active recruiter postings in your domain.</p>
      </div>

      {/* Market Skill Cluster */}
      <div className="luma-card p-6 md:p-8 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">Target Domain Skill Cluster</h3>
        <div className="flex flex-wrap gap-2.5">
          <span className="px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-slate-200 text-xs font-mono font-semibold">Python (Present)</span>
          <span className="px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-slate-200 text-xs font-mono font-semibold">FastAPI (Present)</span>
          <span className="px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-slate-200 text-xs font-mono font-semibold">React (Present)</span>
          <span className="px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-slate-200 text-xs font-mono font-semibold">PostgreSQL (Present)</span>
          <span className="px-3.5 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold">Docker (Missing)</span>
          <span className="px-3.5 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold">Kubernetes (Missing)</span>
          <span className="px-3.5 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold">AWS (Missing)</span>
          <span className="px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-slate-200 text-xs font-mono font-semibold">TypeScript (Present)</span>
        </div>
      </div>

      {/* Skill Gap Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gaps.map((g, idx) => (
          <div key={idx} className="luma-card p-6 md:p-8 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">Missing Competency</span>
                  <h3 className="text-xl font-bold text-white font-sans mt-0.5">{g.skill}</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white text-xs font-mono font-bold shrink-0">
                  {g.demand} Active Jobs Requesting
                </span>
              </div>

              <div className="luma-card-subtle p-4 rounded-xl space-y-1">
                <span className="font-bold text-cyan-300">AI Impact Insight:</span> <span className="text-slate-300 text-xs">{g.rec}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300 font-semibold"><TrendingUp className="w-4 h-4 text-cyan-400" /> High Career Growth Impact</span>
              <span className="text-white font-bold cursor-pointer hover:underline flex items-center gap-1">Recommended Learning <ArrowUpRight className="w-3.5 h-3.5" /></span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
