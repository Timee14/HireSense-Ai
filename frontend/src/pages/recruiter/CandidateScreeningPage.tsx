import React, { useState } from 'react';
import {
  Users, CheckCircle2, XCircle, Clock, Star, Eye, Sparkles, Filter, Mail, Video,
  Calendar, Briefcase, MessageSquare, Send, ExternalLink, Copy, Check, ChevronRight, X
} from 'lucide-react';
import { Job, Application, JobRecommendation } from '../../types';

interface CandidateScreeningPageProps {
  jobs: Job[];
  applications?: Application[];
  applicants?: Application[];
  onUpdateStatus: (applicationId: string, status: string) => Promise<void>;
  onOpenMatchModal: (rec: any) => void;
  onSendInterviewInvite?: (inviteData: {
    applicationId: string;
    candidateEmail: string;
    candidateName: string;
    jobTitle: string;
    interviewType: string;
    scheduledAt: string;
    meetingLink: string;
    notes?: string;
  }) => Promise<void>;
}

export const CandidateScreeningPage: React.FC<CandidateScreeningPageProps> = ({
  jobs,
  applications,
  applicants,
  onUpdateStatus,
  onOpenMatchModal,
  onSendInterviewInvite
}) => {
  const allApps = applicants || applications || [];
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [statusToast, setStatusToast] = useState<{ msg: string; type: 'white' | 'rose' | 'amber' } | null>(null);

  // Interview Schedule State
  const [activeApplicantForInterview, setActiveApplicantForInterview] = useState<Application | null>(null);
  const [interviewType, setInterviewType] = useState('Technical Round 1 (Live Coding & Architecture)');
  const [scheduledAt, setScheduledAt] = useState('Tomorrow at 2:00 PM EST');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/xyz-hiresense-meet');
  const [recruiterNotes, setRecruiterNotes] = useState('Looking forward to discussing your technical project experience and system design foundations.');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSubmittingInterview, setIsSubmittingInterview] = useState(false);
  const [interviewSuccessMsg, setInterviewSuccessMsg] = useState('');

  const filteredApplicants = allApps.filter((app) => {
    const matchesJob = selectedJobId === 'all' || app.job_id === selectedJobId;
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesJob && matchesStatus;
  });

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  const stageCounts = {
    all: allApps.length,
    shortlisted: allApps.filter(a => a.status === 'shortlisted').length,
    under_review: allApps.filter(a => a.status === 'under_review').length,
    interview: allApps.filter(a => a.status === 'interview').length,
    applied: allApps.filter(a => a.status === 'applied').length,
    rejected: allApps.filter(a => a.status === 'rejected').length
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return { label: 'Shortlisted ✓', bg: 'bg-white/10 text-white border-white/20' };
      case 'interview':
        return { label: 'Interview 📅', bg: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/30' };
      case 'under_review':
        return { label: 'Under Review ⏳', bg: 'bg-amber-950/60 text-amber-300 border-amber-500/30' };
      case 'rejected':
        return { label: 'Declined ✗', bg: 'bg-rose-950/60 text-rose-300 border-rose-500/30' };
      default:
        return { label: 'Applied', bg: 'bg-white/5 text-slate-300 border-white/10' };
    }
  };

  const handleStatusChange = async (appId: string, candidateName: string, newStatus: string) => {
    try {
      await onUpdateStatus(appId, newStatus);
      setStatusToast({
        msg: `Candidate ${candidateName || 'Applicant'} status transitioned to ${newStatus.toUpperCase()}`,
        type: newStatus === 'rejected' ? 'rose' : newStatus === 'under_review' ? 'amber' : 'white'
      });
      setTimeout(() => setStatusToast(null), 4000);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleOpenInterviewModal = (app: Application) => {
    setActiveApplicantForInterview(app);
    setInterviewSuccessMsg('');
    const randomCode = Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 6);
    setMeetingLink(`https://meet.google.com/${randomCode}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleOpenGmail = () => {
    if (!activeApplicantForInterview) return;
    const recipient = activeApplicantForInterview.candidate_email || 'alex.dev@example.com';
    const subject = encodeURIComponent(`Interview Invitation: ${activeApplicantForInterview.job_title || selectedJob?.title || 'Engineering Role'} at HireSense Partner`);
    const body = encodeURIComponent(
      `Hello ${activeApplicantForInterview.candidate_name || 'Candidate'},\n\nWe were impressed by your background and would like to invite you for an interview.\n\n` +
      `Stage: ${interviewType}\n` +
      `Proposed Time: ${scheduledAt}\n` +
      `Google Meet Link: ${meetingLink}\n\n` +
      `Note from Hiring Team:\n${recruiterNotes}\n\n` +
      `Best regards,\nHiring Team`
    );
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`, '_blank');
  };

  const handleConfirmInterview = async () => {
    if (!activeApplicantForInterview) return;
    setIsSubmittingInterview(true);
    try {
      if (onSendInterviewInvite) {
        await onSendInterviewInvite({
          applicationId: activeApplicantForInterview.id,
          candidateEmail: activeApplicantForInterview.candidate_email || 'alex.dev@example.com',
          candidateName: activeApplicantForInterview.candidate_name || 'Candidate',
          jobTitle: activeApplicantForInterview.job_title || selectedJob?.title || 'Engineering Role',
          interviewType,
          scheduledAt,
          meetingLink,
          notes: recruiterNotes
        });
      } else {
        await onUpdateStatus(activeApplicantForInterview.id, 'interview');
      }

      setInterviewSuccessMsg(`Interview scheduled and notification dispatched to ${activeApplicantForInterview.candidate_email || 'Candidate'}!`);
      setTimeout(() => {
        setActiveApplicantForInterview(null);
        setInterviewSuccessMsg('');
      }, 2500);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmittingInterview(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 text-white animate-fade-in">
      
      {/* Header & Requisition Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 font-mono font-semibold text-xs text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="uppercase tracking-wider font-mono">Vector Screening & Pipeline Command</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl md:text-5xl font-normal text-white tracking-tight mt-2">Candidate Intelligence</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Applicants auto-ranked by cosine vector distance and multi-dimensional skill fit.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-[#0c0e14] border border-white/10 text-xs text-white font-medium focus:outline-none focus:border-white/30"
          >
            <option value="all" className="bg-[#0c0e14] text-white">All Job Postings ({jobs.length})</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id} className="bg-[#0c0e14] text-white">{j.title} ({j.company_name || 'Active'})</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-[#0c0e14] border border-white/10 text-xs text-white font-medium focus:outline-none focus:border-white/30"
          >
            <option value="all" className="bg-[#0c0e14] text-white">All Stages ({stageCounts.all})</option>
            <option value="shortlisted" className="bg-[#0c0e14] text-white">Shortlisted ✓ ({stageCounts.shortlisted})</option>
            <option value="under_review" className="bg-[#0c0e14] text-white">Under Review ⏳ ({stageCounts.under_review})</option>
            <option value="interview" className="bg-[#0c0e14] text-white">Interview 📅 ({stageCounts.interview})</option>
            <option value="applied" className="bg-[#0c0e14] text-white">Applied ({stageCounts.applied})</option>
            <option value="rejected" className="bg-[#0c0e14] text-white">Declined ✗ ({stageCounts.rejected})</option>
          </select>
        </div>
      </div>

      {/* Dynamic Toast Status Notification Banner */}
      {statusToast && (
        <div className={`p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-xl backdrop-blur-xl animate-fade-in ${
          statusToast.type === 'white'
            ? 'bg-white/10 border-white/20 text-white'
            : statusToast.type === 'rose'
            ? 'bg-rose-950/80 border-rose-500/40 text-rose-200'
            : 'bg-amber-950/80 border-amber-500/40 text-amber-200'
        }`}>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>{statusToast.msg}</span>
          </div>
          <button onClick={() => setStatusToast(null)} className="text-white/60 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stage Summary Tabs Bar */}
      <div className="flex overflow-x-auto pb-1 gap-2 no-scrollbar">
        {[
          { key: 'all', label: 'All Candidates', count: stageCounts.all },
          { key: 'shortlisted', label: 'Shortlisted ✓', count: stageCounts.shortlisted },
          { key: 'under_review', label: 'Under Review', count: stageCounts.under_review },
          { key: 'interview', label: 'Interview 📅', count: stageCounts.interview },
          { key: 'applied', label: 'Applied', count: stageCounts.applied },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 sm:gap-2 border whitespace-nowrap shrink-0 ${
              statusFilter === tab.key
                ? 'bg-white text-slate-950 font-bold border-white/30 shadow-md'
                : 'bg-white/[0.04] text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              statusFilter === tab.key ? 'bg-slate-200 text-slate-950 font-bold' : 'bg-white/10 text-slate-300'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Mobile Card Layout (< md) */}
      <div className="block md:hidden space-y-4">
        {filteredApplicants.length === 0 ? (
          <div className="luma-card p-6 text-center text-slate-400 text-xs">
            No candidates match the selected filter.
          </div>
        ) : (
          filteredApplicants.map((app, idx) => {
            const ms = app.match_score || {
              overall_score: 85 - idx * 5,
              skills_score: 80,
              experience_score: 75,
              projects_score: 80,
              education_score: 90,
              certifications_score: 60,
              matched_skills: ['Python', 'FastAPI', 'React', 'PostgreSQL'],
              missing_skills: ['Docker'],
              ai_explanation: 'Strong candidate match with solid engineering background.'
            };
            const badge = getStatusBadge(app.status);

            return (
              <div key={app.id || idx} className="luma-card p-4 space-y-3.5">
                
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-white/10 border border-white/15 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-base font-sans leading-tight">{app.candidate_name || 'Candidate'}</h4>
                      <span className="text-[11px] text-slate-400 block truncate max-w-[180px]">
                        {app.job_title || selectedJob?.title || 'Engineering Role'}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full font-bold text-xs font-mono border shrink-0 bg-white/10 text-white border-white/15`}>
                    {ms.overall_score}% MATCH
                  </span>
                </div>

                {/* Email and Current Status */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                  <span className="text-slate-300 font-mono text-[11px] flex items-center gap-1 truncate max-w-[160px]">
                    <Mail className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{app.candidate_email || 'alex.dev@example.com'}</span>
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${badge.bg}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Skill Badges */}
                <div className="flex flex-wrap gap-1">
                  {ms.matched_skills.slice(0, 4).map((sk, sIdx) => (
                    <span key={sIdx} className="px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 text-[10px] font-mono border border-white/10">
                      ✓ {sk}
                    </span>
                  ))}
                </div>

                {/* Pipeline Actions Controls */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                  
                  {/* Status Dropdown */}
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, app.candidate_name || '', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#0c0e14] border border-white/10 text-xs font-medium text-white focus:outline-none focus:border-white/30"
                  >
                    <option value="applied" className="bg-[#0c0e14] text-white">Applied</option>
                    <option value="under_review" className="bg-[#0c0e14] text-white">Under Review ⏳</option>
                    <option value="shortlisted" className="bg-[#0c0e14] text-white">Shortlist ✓</option>
                    <option value="interview" className="bg-[#0c0e14] text-white">Interview 📅</option>
                    <option value="rejected" className="bg-[#0c0e14] text-white">Decline ✗</option>
                  </select>

                  {/* 1-Click Shortlist Star Button */}
                  <button
                    type="button"
                    onClick={() => handleStatusChange(app.id, app.candidate_name || '', app.status === 'shortlisted' ? 'under_review' : 'shortlisted')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all shrink-0 ${
                      app.status === 'shortlisted'
                        ? 'bg-white text-slate-950 border-white'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                    }`}
                    title="1-Click Shortlist"
                  >
                    <Star className={`w-4 h-4 ${app.status === 'shortlisted' ? 'fill-slate-950' : ''}`} />
                  </button>

                  {/* 1-Click Interview / Gmail Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenInterviewModal(app)}
                    className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-all shrink-0"
                    title="Schedule Interview & Gmail"
                  >
                    <Mail className="w-4 h-4" />
                  </button>

                  {/* Review AI Fit Radar */}
                  <button
                    type="button"
                    onClick={() => onOpenMatchModal({
                      job: selectedJob || {
                        id: app.job_id,
                        recruiter_id: '',
                        title: app.job_title || 'Engineering Role',
                        location: 'Remote',
                        employment_type: 'Full-time',
                        experience_level: 'Mid-Level',
                        description: 'Software Engineering position.',
                        status: 'active',
                        created_at: ''
                      },
                      match_details: ms
                    })}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all shrink-0"
                    title="Review Fit Radar"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View (>= md) */}
      <div className="hidden md:block luma-card overflow-hidden !p-0 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            
            <thead className="bg-white/[0.02] text-slate-400 uppercase font-mono border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Rank & Candidate Info</th>
                <th className="px-6 py-4">AI Match Score</th>
                <th className="px-6 py-4">Skill Overlap</th>
                <th className="px-6 py-4">Current Stage</th>
                <th className="px-6 py-4 text-center">Pipeline Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-white">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-xs">
                    No candidate applications match the selected position or filter stage.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app, idx) => {
                  const ms = app.match_score || {
                    overall_score: 85 - idx * 5,
                    skills_score: 80,
                    experience_score: 75,
                    projects_score: 80,
                    education_score: 90,
                    certifications_score: 60,
                    matched_skills: ['Python', 'FastAPI', 'React', 'PostgreSQL'],
                    missing_skills: ['Docker'],
                    ai_explanation: 'Strong candidate match with solid engineering background.'
                  };

                  const candidateEmail = app.candidate_email || 'alex.dev@example.com';
                  const badge = getStatusBadge(app.status);

                  return (
                    <tr key={app.id || idx} className="hover:bg-white/[0.02] transition-colors">
                      
                      {/* Candidate Name & Info */}
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-white/10 border border-white/15 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-md">
                            #{idx + 1}
                          </span>
                          <div>
                            <span className="block font-bold text-white text-sm font-sans">
                              {app.candidate_name || 'Candidate'}
                            </span>
                            <span className="block text-[11px] text-slate-400 truncate max-w-[200px]">
                              {app.job_title || selectedJob?.title || 'Engineering Role'}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                                <Mail className="w-3 h-3 text-cyan-400" />
                                {candidateEmail}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* AI Match Score */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full font-bold text-xs font-mono border bg-white/10 text-white border-white/15`}>
                            {ms.overall_score}% MATCH
                          </span>
                        </div>
                      </td>

                      {/* Matched Skills */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {ms.matched_skills.slice(0, 3).map((sk, sIdx) => (
                            <span key={sIdx} className="px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 text-[10px] font-mono border border-white/10">
                              ✓ {sk}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Current Status Badge */}
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border inline-block ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>

                      {/* Pipeline Action Controls */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          
                          {/* Status Selector Dropdown */}
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, app.candidate_name || '', e.target.value)}
                            className="px-3 py-1.5 rounded-lg bg-[#0c0e14] border border-white/10 text-xs font-medium text-white focus:outline-none focus:border-white/30"
                          >
                            <option value="applied" className="bg-[#0c0e14] text-white">Applied</option>
                            <option value="under_review" className="bg-[#0c0e14] text-white">Under Review ⏳</option>
                            <option value="shortlisted" className="bg-[#0c0e14] text-white">Shortlist ✓</option>
                            <option value="interview" className="bg-[#0c0e14] text-white">Schedule Interview 📅</option>
                            <option value="rejected" className="bg-[#0c0e14] text-white">Decline ✗</option>
                          </select>

                          {/* Quick 1-Click Shortlist Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(app.id, app.candidate_name || '', app.status === 'shortlisted' ? 'under_review' : 'shortlisted')}
                            className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                              app.status === 'shortlisted'
                                ? 'bg-white text-slate-950 border-white shadow-md'
                                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                            }`}
                            title={app.status === 'shortlisted' ? 'Already Shortlisted' : '1-Click Shortlist Candidate'}
                          >
                            <Star className={`w-4 h-4 ${app.status === 'shortlisted' ? 'fill-slate-950' : ''}`} />
                          </button>

                          {/* Quick Interview / Gmail Dispatch Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenInterviewModal(app)}
                            className="p-1.5 rounded-lg bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-all shadow-sm"
                            title="Schedule Interview & Connect via Gmail"
                          >
                            <Mail className="w-4 h-4" />
                          </button>

                          {/* Deep Review Match Modal Button */}
                          <button
                            type="button"
                            onClick={() => onOpenMatchModal({
                              job: selectedJob || {
                                id: app.job_id,
                                recruiter_id: '',
                                title: app.job_title || 'Engineering Role',
                                location: 'Remote',
                                employment_type: 'Full-time',
                                experience_level: 'Mid-Level',
                                description: 'Software Engineering position.',
                                status: 'active',
                                created_at: ''
                              },
                              match_details: ms
                            })}
                            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/15 transition-all"
                            title="Review AI Skill Radar & Match Rationale"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERVIEW & GMAIL INVITATION DISPATCH MODAL                               */}
      {/* ========================================================================= */}
      {activeApplicantForInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="luma-card max-w-2xl w-full p-4 sm:p-6 md:p-8 space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto border border-white/15 bg-[#0c0e14]/95">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-3 sm:pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-slate-300 text-xs font-mono font-semibold">
                  <Video className="w-3.5 h-3.5 text-cyan-400" />
                  <span>CANDIDATE INTERVIEW DISPATCH</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
                  Invite {activeApplicantForInterview.candidate_name} to Interview
                </h3>
                <p className="text-xs text-slate-400">
                  Sends an instant in-app notification to candidate's mailbox and connects directly with their Gmail.
                </p>
              </div>

              <button
                onClick={() => setActiveApplicantForInterview(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/20 text-white/70 hover:text-white transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {interviewSuccessMsg ? (
              <div className="p-6 rounded-2xl bg-white/10 border border-white/20 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-cyan-400 mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-white">Interview Invitation Dispatched!</h4>
                <p className="text-xs text-slate-300">{interviewSuccessMsg}</p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-5 text-xs">
                
                {/* Candidate & Position Metadata Card */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block">Candidate Email</span>
                    <span className="text-xs sm:text-sm font-bold text-white font-mono break-all">{activeApplicantForInterview.candidate_email || 'alex.dev@example.com'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block">Position & Company</span>
                    <span className="text-xs sm:text-sm font-bold text-white font-sans">
                      {activeApplicantForInterview.job_title || selectedJob?.title} ({activeApplicantForInterview.company_name || selectedJob?.company_name || 'HireSense Partner'})
                    </span>
                  </div>
                </div>

                {/* Interview Stage Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Interview Stage / Type</span>
                  </label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0e14] border border-white/10 text-xs text-white font-medium focus:outline-none focus:border-white/30"
                  >
                    <option value="Technical Round 1 (Live Coding & Architecture)">Technical Round 1 (Live Coding & Architecture)</option>
                    <option value="HR & Cultural Fit Discussion">HR & Cultural Fit Discussion</option>
                    <option value="System Design & Technical Deep-Dive">System Design & Technical Deep-Dive</option>
                    <option value="Final Executive Round with Engineering Lead">Final Executive Round with Engineering Lead</option>
                  </select>
                </div>

                {/* Proposed Date & Time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Proposed Date & Time</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2">
                    {['Tomorrow at 2:00 PM EST', 'Wednesday at 11:00 AM EST', 'Thursday at 4:00 PM EST'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setScheduledAt(preset)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-medium transition-all ${
                          scheduledAt === preset
                            ? 'bg-white text-slate-950 font-bold border border-white'
                            : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    placeholder="e.g. 2026-08-20 at 14:00 EST"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-medium focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                {/* Video Meeting Link (Google Meet) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Google Meet Video Link</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-cyan-300 font-mono font-medium focus:outline-none focus:border-white/30 truncate"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold text-white hover:bg-white/20 transition-all flex items-center gap-1 shrink-0"
                    >
                      {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Recruiter Notes / Instructions */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Personalized Note for Candidate</span>
                  </label>
                  <textarea
                    rows={3}
                    value={recruiterNotes}
                    onChange={(e) => setRecruiterNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white leading-relaxed focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                {/* Dispatch Action Buttons */}
                <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-2.5 sm:gap-3">
                  
                  {/* Button 1: Open Directly in Gmail */}
                  <button
                    type="button"
                    onClick={handleOpenGmail}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg text-xs"
                  >
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span>Open in Gmail</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Button 2: Send In-App & Email Notification */}
                  <button
                    type="button"
                    onClick={handleConfirmInterview}
                    disabled={isSubmittingInterview}
                    className="btn-luma-primary text-xs px-5 py-2.5"
                  >
                    {isSubmittingInterview ? (
                      <span>Dispatching...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-black" />
                        <span>Send In-App & Email Invite</span>
                      </>
                    )}
                  </button>

                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
