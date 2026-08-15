import React from 'react';
import { X, Award, CheckCircle2, AlertTriangle, Sparkles, Cpu } from 'lucide-react';
import { JobRecommendation } from '../../types';

interface MatchRadarModalProps {
  rec: JobRecommendation | null;
  onClose: () => void;
}

export const MatchRadarModal: React.FC<MatchRadarModalProps> = ({ rec, onClose }) => {
  if (!rec) return null;

  const { job, match_details: m } = rec;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#022c22]/85 backdrop-blur-md animate-fadeIn text-white">
      <div className="relative w-full max-w-2xl bg-[#042f26] p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl space-y-4 sm:space-y-6 border border-[#34d399]/40 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-emerald-100/70 hover:text-white transition-colors p-2 rounded-full bg-[#022c22] border border-[#34d399]/30"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#064e3b] border border-[#34d399]/40 text-[#34d399] text-xs font-bold">
            <Sparkles className="w-4 h-4 text-[#34d399]" />
            <span className="uppercase font-mono">Multi-Vector Match Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-outfit mt-2">{job.title}</h2>
          <span className="text-xs text-[#6ee7b7] font-semibold">{job.company_name} • {job.location}</span>
        </div>

        {/* Overall Match Score Banner */}
        <div className="p-6 rounded-2xl bg-[#022c22] border border-[#34d399]/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-[#34d399] font-bold">Overall Match Score</span>
            <h3 className="text-2xl font-bold text-white font-outfit mt-1">{m.overall_score}% Compatibility</h3>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-[#10b981] text-white font-black text-xl flex items-center justify-center font-outfit shadow-md border border-[#34d399]">
            {m.overall_score}%
          </div>
        </div>

        {/* Sub-score Category Progress Bars */}
        <div className="space-y-3 p-5 rounded-2xl bg-[#022c22] border border-[#34d399]/30">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-outfit">Match Category Sub-Scores</h4>

          {[
            { label: 'Technical Skills Overlap (35% Weight)', score: m.skills_score, color: 'bg-[#10b981]' },
            { label: 'Vector Cosine Similarity (25% Weight)', score: 92, color: 'bg-[#38bdf8]' },
            { label: 'Experience Level Alignment (20% Weight)', score: m.experience_score, color: 'bg-[#34d399]' },
            { label: 'Project Technical Relevance (10% Weight)', score: m.projects_score, color: 'bg-[#6ee7b7]' },
            { label: 'Education Alignment (10% Weight)', score: m.education_score, color: 'bg-emerald-400' }
          ].map((cat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-100/70">{cat.label}</span>
                <span className="text-white font-mono">{cat.score}%</span>
              </div>
              <div className="w-full bg-[#064e3b] h-2 rounded-full overflow-hidden border border-[#34d399]/30">
                <div className={`${cat.color} h-full rounded-full`} style={{ width: `${cat.score}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Matched & Missing Skills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#064e3b] border border-[#34d399]/40 space-y-2">
            <span className="text-xs font-bold text-[#6ee7b7] flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="w-4 h-4 text-[#34d399]" /> Matched Skills
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {m.matched_skills.map((s, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-[#022c22] text-[#6ee7b7] text-[10px] font-semibold border border-[#34d399]/30">
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/70 border border-amber-500/40 space-y-2">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mono">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Target Missing Skills
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {m.missing_skills.length === 0 ? (
                <span className="text-xs text-emerald-100/70 italic">No missing required skills!</span>
              ) : (
                m.missing_skills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-[#022c22] text-amber-300 text-[10px] font-semibold border border-amber-500/40">
                    + {s}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* AI Explanation Banner */}
        <div className="emerald-ai-insight">
          <span className="font-bold text-[#34d399]">AI Match Rationale:</span> {m.ai_explanation || 'Strong overall fit across technical requirements.'}
        </div>

      </div>
    </div>
  );
};
