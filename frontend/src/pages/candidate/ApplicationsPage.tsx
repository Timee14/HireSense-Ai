import React from 'react';
import { FileText, Clock, CheckCircle2, XCircle, AlertCircle, ArrowUpRight, MapPin, Calendar, Building, Sparkles } from 'lucide-react';
import { Application } from '../../types';

interface ApplicationsPageProps {
  applications: Application[];
}

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({ applications }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return (
          <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-mono font-bold flex items-center gap-1.5 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Shortlisted
          </span>
        );
      case 'interview':
        return (
          <span className="px-3 py-1 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold flex items-center gap-1.5 w-fit">
            <Clock className="w-3.5 h-3.5 text-indigo-400" /> Interview Scheduled
          </span>
        );
      case 'under_review':
        return (
          <span className="px-3 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold flex items-center gap-1.5 w-fit">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Under Review
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 rounded-full bg-rose-950/60 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold flex items-center gap-1.5 w-fit">
            <XCircle className="w-3.5 h-3.5 text-rose-400" /> Declined
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 text-xs font-mono font-medium flex items-center gap-1.5 w-fit">
            <FileText className="w-3.5 h-3.5 text-slate-400" /> Application Submitted
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 text-white animate-fade-in">
      
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 font-mono font-semibold text-xs text-slate-300 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="uppercase tracking-wider">Candidate Pipeline</span>
        </div>
        <h1 className="font-editorial text-2xl sm:text-3xl md:text-5xl font-normal text-white tracking-tight">Submitted Applications</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Track your real-time application stage and recruiter screening status.</p>
      </div>

      {/* Mobile Card View (< md) */}
      <div className="block md:hidden space-y-4">
        {applications.length === 0 ? (
          <div className="luma-card p-6 text-center text-slate-400 text-xs">
            No active job applications found. Explore recommended jobs to apply!
          </div>
        ) : (
          applications.map((app, idx) => (
            <div key={idx} className="luma-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-white text-base font-sans">{app.job?.title || 'Software Engineer'}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mt-0.5">
                    <Building className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                    <span>{app.job?.company_name || 'HireSense Partner'}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-white font-mono font-bold text-xs shrink-0">
                  {app.match_score?.overall_score || 88}% Match
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <div className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{app.job?.location || 'Remote'}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{new Date(app.applied_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-1">
                {getStatusBadge(app.status)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View (>= md) */}
      <div className="hidden md:block luma-card overflow-hidden !p-0 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Role & Company</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Applied Date</th>
                <th className="px-6 py-4">Vector Match</th>
                <th className="px-6 py-4">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-xs">
                    No submitted applications recorded yet.
                  </td>
                </tr>
              ) : (
                applications.map((app, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm font-sans">{app.job?.title || 'Software Engineer'}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{app.job?.company_name || 'HireSense Partner'}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{app.job?.location || 'Remote'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono">
                      {new Date(app.applied_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white font-mono font-bold text-xs">
                        {app.match_score?.overall_score || 88}% Match
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(app.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
