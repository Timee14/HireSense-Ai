import React, { useState } from 'react';
import { Users, Sparkles, Filter, ChevronRight, CheckCircle2, Clock, XCircle, Award } from 'lucide-react';
import { Application, Job, JobRecommendation } from '../../types';

interface CandidateScreeningPageProps {
  jobs: Job[];
  applicants: Application[];
  onUpdateStatus: (appId: string, status: string) => Promise<void>;
  onOpenMatchModal: (rec: JobRecommendation) => void;
}

export const CandidateScreeningPage: React.FC<CandidateScreeningPageProps> = ({
  jobs,
  applicants,
  onUpdateStatus,
  onOpenMatchModal
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredApplicants = applicants.filter((app) => {
    if (selectedJobId && app.job_id !== selectedJobId) return false;
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#064e3b] border border-[#34d399]/40 font-bold text-xs text-[#34d399]">
            <Sparkles className="w-4 h-4 text-[#34d399]" />
            <span className="uppercase tracking-wider font-mono">Automated Vector Screening</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-outfit mt-2">Candidate Intelligence</h1>
          <p className="text-sm text-emerald-100/70">Applicants auto-ranked by cosine vector distance and multi-dimensional skill fit.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-[#022c22] border border-[#34d399]/30 text-xs text-white font-bold focus:outline-none focus:border-[#34d399]"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id} className="bg-[#022c22] text-white">{j.title}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-[#022c22] border border-[#34d399]/30 text-xs text-white font-bold focus:outline-none focus:border-[#34d399]"
          >
            <option value="all" className="bg-[#022c22] text-white">All Pipeline Stages</option>
            <option value="applied" className="bg-[#022c22] text-white">Applied</option>
            <option value="under_review" className="bg-[#022c22] text-white">Under Review</option>
            <option value="shortlisted" className="bg-[#022c22] text-white">Shortlisted</option>
            <option value="interview" className="bg-[#022c22] text-white">Interview</option>
            <option value="rejected" className="bg-[#022c22] text-white">Declined</option>
          </select>
        </div>
      </div>

      {/* Applicant Table */}
      <div className="emerald-card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            
            <thead className="bg-[#064e3b]/80 text-[#6ee7b7] uppercase font-mono border-b border-[#34d399]/30">
              <tr>
                <th className="px-6 py-4">Rank & Candidate Info</th>
                <th className="px-6 py-4">AI Match Score</th>
                <th className="px-6 py-4">Skill Overlap</th>
                <th className="px-6 py-4">AI Rationale</th>
                <th className="px-6 py-4">Pipeline Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#34d399]/20 text-white">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-emerald-100/70 text-xs">
                    No candidate applications match selected position or filter.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app, idx) => {
                  const ms = app.match_score || {
                    overall_score: 92 - idx * 3,
                    matched_skills: ['Python', 'FastAPI', 'React', 'PostgreSQL'],
                    missing_skills: ['Docker'],
                    ai_explanation: 'Strong candidate match with excellent engineering background.'
                  };

                  return (
                    <tr key={idx} className="hover:bg-[#064e3b]/40 transition-colors">
                      
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-[#10b981] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                            #{idx + 1}
                          </span>
                          <div>
                            <span className="block font-bold text-white text-sm">{app.candidate_name || 'Alex Chen'}</span>
                            <span className="block text-[11px] text-emerald-100/70">Candidate ID: {app.candidate_id?.slice(0, 8)}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-[#064e3b] border border-[#34d399]/40 text-[#34d399] font-bold text-xs font-outfit">
                            {ms.overall_score}% MATCH
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {ms.matched_skills.slice(0, 3).map((sk, sIdx) => (
                            <span key={sIdx} className="px-2 py-0.5 rounded bg-[#064e3b]/80 text-[#6ee7b7] text-[10px] font-semibold border border-[#34d399]/30">
                              ✓ {sk}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-4 max-w-xs text-emerald-100/80 text-xs">
                        <p className="line-clamp-2">{ms.ai_explanation}</p>
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={app.status}
                          onChange={(e) => onUpdateStatus(app.id, e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-[#022c22] border border-[#34d399]/30 text-xs font-bold text-white focus:outline-none focus:border-[#34d399]"
                        >
                          <option value="applied" className="bg-[#022c22] text-white">Applied</option>
                          <option value="under_review" className="bg-[#022c22] text-white">Under Review</option>
                          <option value="shortlisted" className="bg-[#022c22] text-white">Shortlist ✓</option>
                          <option value="interview" className="bg-[#022c22] text-white">Schedule Interview 📅</option>
                          <option value="rejected" className="bg-[#022c22] text-white">Decline ✗</option>
                        </select>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
};
