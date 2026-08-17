import React, { useState, useEffect } from 'react';
import {
  Users, Sparkles, Filter, ChevronRight, CheckCircle2, Clock, XCircle,
  Award, Mail, Video, Calendar, Send, ExternalLink, X, Copy, Check,
  AlertCircle, MessageSquare, Briefcase, UserCheck, Star, Eye, Layers
} from 'lucide-react';
import { Application, Job, JobRecommendation } from '../../types';
import { scheduleInterview } from '../../api/client';

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
  // Job & Pipeline Filters
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [localApplicants, setLocalApplicants] = useState<Application[]>(applicants);
  const [statusToast, setStatusToast] = useState<{ msg: string; type: string } | null>(null);

  // Synchronize local applicants when parent applicants update
  useEffect(() => {
    setLocalApplicants(applicants);
  }, [applicants]);

  // Interview & Gmail Dispatch Modal State
  const [activeApplicantForInterview, setActiveApplicantForInterview] = useState<Application | null>(null);
  const [interviewType, setInterviewType] = useState<string>('Technical Round 1 (Live Coding & Architecture)');
  const [scheduledAt, setScheduledAt] = useState<string>('Tomorrow at 2:00 PM EST');
  const [meetingLink, setMeetingLink] = useState<string>('https://meet.google.com/hms-recr-invite');
  const [recruiterNotes, setRecruiterNotes] = useState<string>(
    'Congratulations on clearing the resume screening! We were impressed by your technical depth and would love to discuss next steps.'
  );
  const [isSubmittingInterview, setIsSubmittingInterview] = useState(false);
  const [interviewSuccessMsg, setInterviewSuccessMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  // Filtered applicants list
  const filteredApplicants = localApplicants.filter((app) => {
    if (selectedJobId !== 'all' && app.job_id !== selectedJobId) return false;
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    return true;
  });

  const stageCounts = {
    all: localApplicants.length,
    applied: localApplicants.filter(a => a.status === 'applied').length,
    under_review: localApplicants.filter(a => a.status === 'under_review').length,
    shortlisted: localApplicants.filter(a => a.status === 'shortlisted').length,
    interview: localApplicants.filter(a => a.status === 'interview').length,
    rejected: localApplicants.filter(a => a.status === 'rejected').length
  };

  const handleOpenInterviewModal = (app: Application) => {
    setActiveApplicantForInterview(app);
    setInterviewSuccessMsg(null);
    setCopiedLink(false);
    const cleanName = (app.candidate_name || 'cand').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 4);
    setMeetingLink(`https://meet.google.com/hms-${cleanName}-meet`);
  };

  // Immediate Optimistic Status Update with Feedback
  const handleStatusChange = async (appId: string, candidateName: string, newStatus: string) => {
    const app = localApplicants.find(a => a.id === appId);
    if (newStatus === 'interview' && app) {
      handleOpenInterviewModal(app);
      return;
    }

    // 1. Instant optimistic state update
    setLocalApplicants(prev =>
      prev.map(a => (a.id === appId ? { ...a, status: newStatus as any } : a))
    );

    const friendlyName = newStatus === 'shortlisted'
      ? 'Shortlisted ✓'
      : newStatus === 'under_review'
      ? 'Under Review ⏳'
      : newStatus === 'rejected'
      ? 'Declined ✗'
      : 'Applied';

    setStatusToast({
      msg: `${candidateName || 'Candidate'} moved to ${friendlyName}`,
      type: newStatus === 'shortlisted' ? 'emerald' : newStatus === 'rejected' ? 'rose' : 'amber'
    });

    setTimeout(() => setStatusToast(null), 3500);

    // 2. Persist to backend
    try {
      await onUpdateStatus(appId, newStatus);
    } catch (err: any) {
      console.error(err);
      setStatusToast({ msg: 'Failed to sync status to backend: ' + err.message, type: 'rose' });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleConfirmInterview = async () => {
    if (!activeApplicantForInterview) return;
    setIsSubmittingInterview(true);
    try {
      await scheduleInterview({
        application_id: activeApplicantForInterview.id,
        interview_type: interviewType,
        scheduled_at: scheduledAt,
        location_or_link: meetingLink,
        notes: recruiterNotes,
        send_email: true
      });

      // Update local state to 'interview'
      setLocalApplicants(prev =>
        prev.map(a => (a.id === activeApplicantForInterview.id ? { ...a, status: 'interview' } : a))
      );

      await onUpdateStatus(activeApplicantForInterview.id, 'interview');
      setInterviewSuccessMsg(`Interview scheduled and notification delivered to ${activeApplicantForInterview.candidate_name}'s mailbox!`);

      setTimeout(() => {
        setIsSubmittingInterview(false);
        setActiveApplicantForInterview(null);
        setInterviewSuccessMsg(null);
      }, 2500);
    } catch (err: any) {
      console.error(err);
      alert('Failed to schedule interview: ' + (err.message || 'Server error'));
      setIsSubmittingInterview(false);
    }
  };

  const handleOpenGmail = () => {
    if (!activeApplicantForInterview) return;
    const candEmail = activeApplicantForInterview.candidate_email || 'candidate@example.com';
    const candName = activeApplicantForInterview.candidate_name || 'Candidate';
    const jobTitle = activeApplicantForInterview.job_title || selectedJob?.title || 'Software Engineering Role';
    const companyName = activeApplicantForInterview.company_name || selectedJob?.company_name || 'HireSense AI Partner';

    const subject = encodeURIComponent(`Interview Invitation: ${jobTitle} at ${companyName}`);
    const emailBody = encodeURIComponent(
`Hi ${candName},

Congratulations! We were thoroughly impressed by your profile and resume screening results for the ${jobTitle} role at ${companyName}.

We would like to invite you for the next round of our interview process:
- Interview Stage: ${interviewType}
- Proposed Date & Time: ${scheduledAt}
- Video Meeting Link: ${meetingLink}

Notes from Hiring Team:
${recruiterNotes}

Please confirm if this time works for you or reply with your preferred availability.

Best regards,
The Talent Acquisition Team
${companyName}`
    );

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(candEmail)}&su=${subject}&body=${emailBody}`;
    window.open(gmailUrl, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return { label: 'Shortlisted ✓', bg: 'bg-[#064e3b] text-[#34d399] border-[#34d399]/40' };
      case 'interview':
        return { label: 'Interview 📅', bg: 'bg-purple-950/80 text-purple-300 border-purple-500/40' };
      case 'under_review':
        return { label: 'Under Review ⏳', bg: 'bg-amber-950/80 text-amber-300 border-amber-500/40' };
      case 'rejected':
        return { label: 'Declined ✗', bg: 'bg-rose-950/80 text-rose-300 border-rose-500/40' };
      default:
        return { label: 'Applied', bg: 'bg-slate-900 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 text-white animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#064e3b] border border-[#34d399]/40 font-bold text-xs text-[#34d399]">
            <Sparkles className="w-4 h-4 text-[#34d399]" />
            <span className="uppercase tracking-wider font-mono">Automated Vector Screening & Pipeline Command</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white font-outfit mt-2">Candidate Intelligence</h1>
          <p className="text-sm text-emerald-100/70">Applicants auto-ranked by cosine vector distance and multi-dimensional skill fit.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-[#022c22] border border-[#34d399]/30 text-xs text-white font-bold focus:outline-none focus:border-[#34d399] shadow-md"
          >
            <option value="all" className="bg-[#022c22] text-white">All Job Postings ({jobs.length})</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id} className="bg-[#022c22] text-white">{j.title} ({j.company_name || 'Active'})</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-[#022c22] border border-[#34d399]/30 text-xs text-white font-bold focus:outline-none focus:border-[#34d399] shadow-md"
          >
            <option value="all" className="bg-[#022c22] text-white">All Stages ({stageCounts.all})</option>
            <option value="shortlisted" className="bg-[#022c22] text-white">Shortlisted ✓ ({stageCounts.shortlisted})</option>
            <option value="under_review" className="bg-[#022c22] text-white">Under Review ⏳ ({stageCounts.under_review})</option>
            <option value="interview" className="bg-[#022c22] text-white">Interview 📅 ({stageCounts.interview})</option>
            <option value="applied" className="bg-[#022c22] text-white">Applied ({stageCounts.applied})</option>
            <option value="rejected" className="bg-[#022c22] text-white">Declined ✗ ({stageCounts.rejected})</option>
          </select>
        </div>
      </div>

      {/* Dynamic Toast Status Notification Banner */}
      {statusToast && (
        <div className={`p-4 rounded-2xl border-2 text-sm font-bold flex items-center justify-between gap-3 shadow-xl animate-fade-in ${
          statusToast.type === 'emerald'
            ? 'bg-[#064e3b] border-[#34d399] text-white'
            : statusToast.type === 'rose'
            ? 'bg-rose-950 border-rose-500 text-rose-200'
            : 'bg-amber-950 border-amber-500 text-amber-200'
        }`}>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#34d399] shrink-0" />
            <span>{statusToast.msg}</span>
          </div>
          <button onClick={() => setStatusToast(null)} className="text-white/60 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stage Summary Tabs Bar */}
      <div className="flex flex-wrap gap-2 pt-1">
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
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 border ${
              statusFilter === tab.key
                ? 'bg-[#10b981] text-white border-[#34d399] shadow-lg shadow-[#10b981]/20'
                : 'bg-[#022c22] text-emerald-100/70 border-[#34d399]/20 hover:bg-[#064e3b] hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              statusFilter === tab.key ? 'bg-black/30 text-white' : 'bg-black/40 text-[#6ee7b7]'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Applicant Table */}
      <div className="emerald-card overflow-hidden !p-0 border border-[#34d399]/30 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            
            <thead className="bg-[#064e3b]/90 text-[#6ee7b7] uppercase font-mono border-b border-[#34d399]/30">
              <tr>
                <th className="px-6 py-4">Rank & Candidate Info</th>
                <th className="px-6 py-4">AI Match Score</th>
                <th className="px-6 py-4">Skill Overlap</th>
                <th className="px-6 py-4">Current Stage</th>
                <th className="px-6 py-4 text-center">Pipeline Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#34d399]/20 text-white">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-emerald-100/70 text-xs">
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
                    <tr key={app.id || idx} className="hover:bg-[#064e3b]/40 transition-colors">
                      
                      {/* Candidate Name & Info */}
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-[#10b981] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-md border border-[#34d399]">
                            #{idx + 1}
                          </span>
                          <div>
                            <span className="block font-bold text-white text-sm font-outfit">
                              {app.candidate_name || 'Candidate'}
                            </span>
                            <span className="block text-[11px] text-emerald-100/70 truncate max-w-[200px]">
                              {app.job_title || selectedJob?.title || 'Engineering Role'}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-[#6ee7b7] font-mono flex items-center gap-1">
                                <Mail className="w-3 h-3 text-[#34d399]" />
                                {candidateEmail}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* AI Match Score */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full font-bold text-xs font-outfit border ${
                            ms.overall_score >= 70
                              ? 'bg-[#064e3b] border-[#34d399]/40 text-[#34d399]'
                              : ms.overall_score >= 45
                              ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                              : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                          }`}>
                            {ms.overall_score}% MATCH
                          </span>
                        </div>
                      </td>

                      {/* Matched Skills */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {ms.matched_skills.slice(0, 3).map((sk, sIdx) => (
                            <span key={sIdx} className="px-2 py-0.5 rounded bg-[#064e3b]/80 text-[#6ee7b7] text-[10px] font-semibold border border-[#34d399]/30">
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
                            className="px-3 py-1.5 rounded-lg bg-[#022c22] border border-[#34d399]/40 text-xs font-bold text-white focus:outline-none focus:border-[#34d399] shadow-sm hover:border-[#34d399] transition-all"
                          >
                            <option value="applied" className="bg-[#022c22] text-white">Applied</option>
                            <option value="under_review" className="bg-[#022c22] text-white">Under Review ⏳</option>
                            <option value="shortlisted" className="bg-[#022c22] text-white">Shortlist ✓</option>
                            <option value="interview" className="bg-[#022c22] text-white">Schedule Interview 📅</option>
                            <option value="rejected" className="bg-[#022c22] text-white">Decline ✗</option>
                          </select>

                          {/* Quick 1-Click Shortlist Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(app.id, app.candidate_name || '', app.status === 'shortlisted' ? 'under_review' : 'shortlisted')}
                            className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                              app.status === 'shortlisted'
                                ? 'bg-[#10b981] text-white border-[#34d399] shadow-md'
                                : 'bg-[#022c22] text-[#34d399] border-[#34d399]/30 hover:bg-[#064e3b]'
                            }`}
                            title={app.status === 'shortlisted' ? 'Already Shortlisted' : '1-Click Shortlist Candidate'}
                          >
                            <Star className={`w-4 h-4 ${app.status === 'shortlisted' ? 'fill-white' : ''}`} />
                          </button>

                          {/* Quick Interview / Gmail Dispatch Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenInterviewModal(app)}
                            className="p-1.5 rounded-lg bg-[#064e3b] border border-[#34d399]/40 text-[#34d399] hover:bg-[#10b981] hover:text-white transition-all shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#022c22] border-2 border-[#34d399] rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#34d399]/30 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#064e3b] border border-[#34d399]/40 text-[#34d399] text-xs font-bold font-mono">
                  <Video className="w-3.5 h-3.5" />
                  <span>CANDIDATE INTERVIEW DISPATCH</span>
                </div>
                <h3 className="text-2xl font-black text-white font-outfit">
                  Invite {activeApplicantForInterview.candidate_name} to Interview
                </h3>
                <p className="text-xs text-emerald-100/70">
                  Sends an instant in-app notification to candidate's mailbox and connects directly with their Gmail.
                </p>
              </div>

              <button
                onClick={() => setActiveApplicantForInterview(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/20 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {interviewSuccessMsg ? (
              <div className="p-6 rounded-2xl bg-[#064e3b] border border-[#34d399] text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#34d399] mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-white">Interview Invitation Dispatched!</h4>
                <p className="text-xs text-emerald-100/90">{interviewSuccessMsg}</p>
              </div>
            ) : (
              <div className="space-y-5 text-xs">
                
                {/* Candidate & Position Metadata Card */}
                <div className="p-4 rounded-2xl bg-[#064e3b]/60 border border-[#34d399]/30 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Candidate Email</span>
                    <span className="text-sm font-bold text-[#34d399] font-mono">{activeApplicantForInterview.candidate_email || 'alex.dev@example.com'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Position & Company</span>
                    <span className="text-sm font-bold text-white font-outfit">
                      {activeApplicantForInterview.job_title || selectedJob?.title} ({activeApplicantForInterview.company_name || selectedJob?.company_name || 'HireSense Partner'})
                    </span>
                  </div>
                </div>

                {/* Interview Stage Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#34d399]" />
                    <span>Interview Stage / Type</span>
                  </label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#011a14] border border-[#34d399]/40 text-xs text-white font-bold focus:outline-none focus:border-[#34d399]"
                  >
                    <option value="Technical Round 1 (Live Coding & Architecture)">Technical Round 1 (Live Coding & Architecture)</option>
                    <option value="HR & Cultural Fit Discussion">HR & Cultural Fit Discussion</option>
                    <option value="System Design & Technical Deep-Dive">System Design & Technical Deep-Dive</option>
                    <option value="Final Executive Round with Engineering Lead">Final Executive Round with Engineering Lead</option>
                  </select>
                </div>

                {/* Proposed Date & Time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#34d399]" />
                    <span>Proposed Date & Time</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {['Tomorrow at 2:00 PM EST', 'Wednesday at 11:00 AM EST', 'Thursday at 4:00 PM EST'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setScheduledAt(preset)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          scheduledAt === preset
                            ? 'bg-[#10b981] text-white border border-[#34d399]'
                            : 'bg-white/5 text-emerald-100/70 border border-white/10 hover:bg-white/10'
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
                    className="w-full px-4 py-2.5 rounded-xl bg-[#011a14] border border-[#34d399]/40 text-xs text-white font-medium focus:outline-none focus:border-[#34d399]"
                  />
                </div>

                {/* Video Meeting Link (Google Meet) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-[#34d399]" />
                    <span>Google Meet Video Link</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#011a14] border border-[#34d399]/40 text-xs text-[#34d399] font-mono font-bold focus:outline-none focus:border-[#34d399]"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-3 py-2.5 rounded-xl bg-[#064e3b] border border-[#34d399]/40 text-xs font-bold text-[#34d399] hover:bg-[#10b981] hover:text-white transition-all flex items-center gap-1 shrink-0"
                    >
                      {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Recruiter Notes / Instructions */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#34d399]" />
                    <span>Personalized Note for Candidate</span>
                  </label>
                  <textarea
                    rows={3}
                    value={recruiterNotes}
                    onChange={(e) => setRecruiterNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#011a14] border border-[#34d399]/40 text-xs text-white leading-relaxed focus:outline-none focus:border-[#34d399]"
                  />
                </div>

                {/* Dispatch Action Buttons */}
                <div className="pt-3 border-t border-[#34d399]/30 flex flex-col sm:flex-row items-center justify-end gap-3">
                  
                  {/* Button 1: Open Directly in Gmail */}
                  <button
                    type="button"
                    onClick={handleOpenGmail}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#064e3b] border border-[#34d399]/40 text-white hover:bg-[#047857] transition-all font-bold flex items-center justify-center gap-2 shadow-lg text-xs"
                  >
                    <Mail className="w-4 h-4 text-[#34d399]" />
                    <span>Open & Send via Gmail</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                  </button>

                  {/* Button 2: Send In-App & Email Notification */}
                  <button
                    type="button"
                    onClick={handleConfirmInterview}
                    disabled={isSubmittingInterview}
                    className="w-full sm:w-auto btn-emerald-cta text-xs px-6 py-2.5 shadow-xl"
                  >
                    {isSubmittingInterview ? (
                      <span>Dispatching Notification...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-white" />
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
