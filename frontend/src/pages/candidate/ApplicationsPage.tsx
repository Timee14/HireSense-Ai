import React from 'react';
import { FileText, Clock, CheckCircle2, XCircle, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Application } from '../../types';

interface ApplicationsPageProps {
  applications: Application[];
}

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({ applications }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return (
          <span className="px-3 py-1 rounded-full bg-[#064e3b] text-[#34d399] border border-[#34d399]/40 text-xs font-bold flex items-center gap-1.5 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399]" /> Shortlisted
          </span>
        );
      case 'interview':
        return (
          <span className="px-3 py-1 rounded-full bg-[#064e3b] text-[#38bdf8] border border-[#38bdf8]/40 text-xs font-bold flex items-center gap-1.5 w-fit">
            <Clock className="w-3.5 h-3.5" /> Interview Scheduled
          </span>
        );
      case 'under_review':
        return (
          <span className="px-3 py-1 rounded-full bg-[#064e3b] text-[#6ee7b7] border border-[#34d399]/40 text-xs font-bold flex items-center gap-1.5 w-fit">
            <Clock className="w-3.5 h-3.5" /> Under Review
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 w-fit">
            <XCircle className="w-3.5 h-3.5" /> Declined
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-[#022c22] text-emerald-100/80 border border-[#34d399]/30 text-xs font-bold flex items-center gap-1.5 w-fit">
            <FileText className="w-3.5 h-3.5" /> Application Submitted
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 text-white">
      
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white font-outfit">Submitted Applications</h1>
        <p className="text-sm text-emerald-100/70 mt-1">Track your application stage and view recruiter review status</p>
      </div>

      <div className="emerald-card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            
            <thead className="bg-[#064e3b]/80 text-[#6ee7b7] uppercase font-mono border-b border-[#34d399]/30">
              <tr>
                <th className="px-6 py-4">Job Title & Company</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">AI Match Score</th>
                <th className="px-6 py-4">Status Pipeline</th>
                <th className="px-6 py-4">Applied Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#34d399]/20 text-white">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-emerald-100/70 text-xs">
                    No active job applications found. Explore recommended jobs to apply!
                  </td>
                </tr>
              ) : (
                applications.map((app, idx) => (
                  <tr key={idx} className="hover:bg-[#064e3b]/40 transition-colors">
                    
                    <td className="px-6 py-4 font-medium">
                      <span className="block font-bold text-white text-sm">{app.job?.title || 'Senior Software Engineer'}</span>
                      <span className="block text-[11px] text-[#34d399] font-bold">{app.job?.company_name || 'HireSense Partner'}</span>
                    </td>

                    <td className="px-6 py-4 text-emerald-100/70">
                      {app.job?.location || 'Remote'}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-[#064e3b] border border-[#34d399]/40 text-[#34d399] font-bold text-xs font-outfit">
                        {app.match_score?.overall_score || 88}% Match
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(app.status)}
                    </td>

                    <td className="px-6 py-4 font-mono text-emerald-100/70 text-[11px]">
                      {new Date(app.applied_at).toLocaleDateString()}
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
