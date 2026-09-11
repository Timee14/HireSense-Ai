import React, { useState, useEffect } from 'react';
import {
  X, Building2, MapPin, DollarSign, Briefcase, Award, CheckCircle2,
  AlertTriangle, Sparkles, Send, BrainCircuit, MessageSquare, ArrowRight,
  ShieldCheck, Layers, ChevronRight, Clock, Users, Gift, Check, Flame,
  Share2, Bookmark, BookmarkCheck, Globe, HelpCircle, ExternalLink,
  Laptop, CheckCheck, Sparkle, ArrowUpRight
} from 'lucide-react';
import { JobRecommendation } from '../../types';

interface JobDetailModalProps {
  rec: JobRecommendation | null;
  onClose: () => void;
  onApply?: (jobId: string) => void;
  isApplied?: boolean;
  onNavigateToInterview?: (roleTitle: string, jobDesc: string) => void;
  onNavigateToChat?: (roleTitle: string) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  rec,
  onClose,
  onApply,
  isApplied = false,
  onNavigateToInterview,
  onNavigateToChat,
}) => {
  const [appliedLocal, setAppliedLocal] = useState(isApplied);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [aiGeneratingNote, setAiGeneratingNote] = useState(false);

  useEffect(() => {
    setAppliedLocal(Boolean(isApplied));
  }, [isApplied, rec]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!rec) return null;

  const rawRec = rec as any;
  const job = rawRec.job || rawRec;
  const m = rawRec.match_details || null;

  const jobId = job?.id || "job-01";
  const jobTitle = job?.title || "Software Developer";
  const companyName = job?.company_name || "Decipher Zone";
  const location = job?.location || "Jaipur / Remote";
  const experienceLevel = job?.experience_level || "1-4 Years";
  const salaryRange = job?.salary_range || "$11k – $12k • No equity";
  const employmentType = job?.employment_type || "Full-Time";
  const department = job?.department || "Enterprise Software Engineering & Scalable Multi-Agent AI Architectures";
  const description = job?.description || `We are looking for a skilled and motivated ${jobTitle} to join our engineering development team. The ideal candidate will be responsible for designing, developing, testing, and maintaining scalable and high-performance applications.`;

  const skillsList: string[] = job?.required_skills && job.required_skills.length > 0
    ? job.required_skills
    : ["Java", "Springboot", "RESTful APIs", "SQL", "Git", "Problem Solving"];

  const preferredSkillsList: string[] = job?.preferred_skills && job.preferred_skills.length > 0
    ? job.preferred_skills
    : ["Spring Security", "Hibernate/JPA", "Docker", "CI/CD", "AWS", "Kafka", "Agile/Scrum"];

  const responsibilities: string[] = job?.responsibilities && job.responsibilities.length > 0
    ? job.responsibilities
    : [
        `Develop, test, and maintain high-quality ${jobTitle} applications and microservices.`,
        `Design and implement scalable, resilient, and reliable software architectures.`,
        `Write clean, efficient, reusable, and well-documented production code.`,
        `Develop and integrate high-throughput RESTful APIs, webhooks, and backend services.`,
        `Work with relational and distributed databases such as MySQL, PostgreSQL, or MongoDB.`,
        `Troubleshoot, debug, and resolve complex application bugs and performance bottlenecks.`,
        `Collaborate closely with developers, QA engineers, product managers, and UI/UX designers.`,
        `Participate actively in code reviews and uphold engineering excellence and security best practices.`,
        `Optimize application performance, system latency, and containerized deployment pipelines.`
      ];

  const qualifications: string[] = job?.qualifications && job.qualifications.length > 0
    ? job.qualifications
    : [
        `Bachelor's degree in Computer Science, Information Technology, Engineering, or a related field.`,
        `Relevant professional hands-on experience in ${jobTitle} or software engineering.`,
        `Strong analytical problem-solving, communication, and teamwork skills.`
      ];

  const preferredQualifications: string[] = job?.preferred_qualifications && job.preferred_qualifications.length > 0
    ? job.preferred_qualifications
    : preferredSkillsList.map(s => `Hands-on knowledge or production experience with ${s}.`);

  const benefits: string[] = job?.benefits && job.benefits.length > 0
    ? job.benefits
    : [
        `Competitive compensation package (${salaryRange}).`,
        `Opportunity to work on challenging, high-impact multi-agent AI & enterprise projects.`,
        `Continuous learning, upskilling, and rapid professional growth opportunities.`,
        `Collaborative, supportive, and engineering-first work culture.`,
        `Flexible remote working options and generous wellness support.`
      ];

  const handleApply = () => {
    if (onApply && !appliedLocal) {
      onApply(jobId);
      setAppliedLocal(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAutoGenerateNote = () => {
    setAiGeneratingNote(true);
    setTimeout(() => {
      setCoverNote(`Hi ${companyName} team,\n\nI am thrilled to apply for the ${jobTitle} role. With my background in ${skillsList.slice(0, 3).join(', ')} and building resilient software architectures, I am confident I can immediately contribute to your team's mission. I look forward to connecting!`);
      setAiGeneratingNote(false);
    }, 450);
  };

  // Other jobs at same company sample
  const relatedCompanyJobs = [
    { title: "Software Developer", location: "Remote only • Everywhere", salary: "$11k – $12k • No equity", posted: "3 days ago" },
    { title: "Business Analyst", location: "Remote only • Everywhere", salary: "$60k – $70k", posted: "1 month ago" },
  ];

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn text-white cursor-pointer"
    >
      <div className="relative w-full max-w-6xl bg-[#0b0e14] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl max-h-[94vh] flex flex-col overflow-hidden cursor-default">
        
        {/* Top Floating Action Bar */}
        <div className="px-6 py-4 bg-[#0e121b] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/10 text-[11px] font-mono text-slate-300 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Job Opening ID: {jobId}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1.5"
              title="Share job opening"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">{copiedLink ? "Link Copied!" : "Share"}</span>
            </button>

            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
                isSaved
                  ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
              }`}
              title="Save opening"
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4 text-slate-400" />}
              <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-slate-400 hover:text-white transition-colors ml-2"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body (Scrollable Split Two-Column Layout) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Deep Job Specifications, About the Role, Responsibilities, Qualifications (8 Cols) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Header Company Card */}
              <div className="p-6 rounded-2xl bg-[#111522] border border-white/10 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-500 flex items-center justify-center p-2.5 shadow-lg shrink-0 border border-white/20">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold text-white font-sans">{companyName}</h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Actively Hiring
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {department}
                    </p>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 pt-0.5">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>51-200 Employees • Tech & Product Engineering</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-1.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
                    {jobTitle}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-300 font-mono">
                    <span className="text-cyan-300 font-semibold">Remote only</span>
                    <span>•</span>
                    <span>{location}</span>
                    <span>•</span>
                    <span className="font-bold text-emerald-400">{salaryRange}</span>
                    <span>•</span>
                    <span className="text-slate-300">{experienceLevel}</span>
                    <span>•</span>
                    <span className="text-slate-300">{employmentType}</span>
                  </div>
                  <div className="text-[11px] text-emerald-400/90 font-mono font-bold pt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>POSTED RECENTLY • RECRUITER ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* 6-Grid Quick Specifications Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">Hires Remotely In</span>
                  <span className="text-sm font-semibold text-white">Everywhere / Worldwide</span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">Remote Work Policy</span>
                  <span className="text-sm font-semibold text-white">Remote only (100% Distributed)</span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">Company Location</span>
                  <span className="text-sm font-semibold text-white">{location}</span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">Visa Sponsorship</span>
                  <span className="text-sm font-semibold text-white">Direct Contract / Available</span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">Preferred Timezones</span>
                  <span className="text-sm font-semibold text-white">Flexible / Indochina / IST / UTC</span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">Relocation</span>
                  <span className="text-sm font-semibold text-white">Not Required (Remote First)</span>
                </div>
              </div>

              {/* Primary Tech Stack & Core Competencies */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Primary Skills & Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-200 font-mono text-xs font-semibold border border-cyan-400/25 shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                  {preferredSkillsList.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.04] text-slate-300 font-mono text-xs border border-white/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Comprehensive "About the job" Section */}
              <div className="space-y-6 pt-4 border-t border-white/10">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white font-sans">
                    About the job
                  </h3>
                  <div className="p-4 rounded-xl bg-white/[0.025] border border-white/10 space-y-1 text-xs text-slate-300 font-mono">
                    <div><span className="text-slate-400 font-bold">Job Title:</span> <span className="text-white font-bold">{jobTitle}</span></div>
                    <div><span className="text-slate-400 font-bold">Location:</span> <span className="text-white">{location}</span></div>
                    <div><span className="text-slate-400 font-bold">Employment Type:</span> <span className="text-white">{employmentType}</span></div>
                    <div><span className="text-slate-400 font-bold">Experience:</span> <span className="text-white">{experienceLevel}</span></div>
                  </div>
                </div>

                {/* About the Role */}
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-white font-sans">
                    About the Role
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {description}
                  </p>
                </div>

                {/* Key Responsibilities */}
                <div className="space-y-3">
                  <h4 className="text-base font-bold text-white font-sans">
                    Key Responsibilities
                  </h4>
                  <div className="space-y-2.5">
                    {responsibilities.map((resp, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                        <span className="font-mono font-bold text-cyan-400 shrink-0 text-xs mt-0.5">{idx + 1}.</span>
                        <p className="leading-relaxed">{resp}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preferred Skills */}
                <div className="space-y-3">
                  <h4 className="text-base font-bold text-white font-sans">
                    Preferred Skills & Bonus Tooling
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-200">
                    {preferredQualifications.map((pq, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                        <span>{pq}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Qualifications */}
                <div className="space-y-3">
                  <h4 className="text-base font-bold text-white font-sans">
                    Qualifications & Core Requirements
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-200">
                    {qualifications.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What We Offer */}
                <div className="space-y-3">
                  <h4 className="text-base font-bold text-white font-sans">
                    What We Offer & Compensation
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-200">
                    {benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* How to Apply */}
                <div className="p-4 rounded-xl bg-white/[0.025] border border-white/10 space-y-1">
                  <h5 className="text-xs font-bold text-white uppercase font-mono">How to Apply:</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Interested candidates can apply directly with 1-click below. Our talent team reviews profiles within 24-48 hours and shortlisted candidates will be scheduled for technical discovery rounds.
                  </p>
                </div>
              </div>

              {/* Company Profile Card */}
              <div className="p-6 rounded-2xl bg-[#0e121d] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-bold font-mono text-lg">
                    {companyName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{companyName}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </h4>
                    <p className="text-xs text-slate-400">{department}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-white/5 text-slate-300 font-mono">Enterprise Software</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/5 text-slate-300 font-mono">AI Architecture</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/5 text-slate-300 font-mono">Web Development</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/5 text-slate-300 font-mono">Cloud Systems</span>
                </div>
              </div>

              {/* Recent Jobs at this Company */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                  Recent Jobs at {companyName}
                </h4>
                <div className="space-y-2.5">
                  {relatedCompanyJobs.map((rj, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-4">
                      <div>
                        <h5 className="font-bold text-sm text-white">{rj.title}</h5>
                        <p className="text-xs text-slate-400">{rj.location} • {rj.salary}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">{rj.posted}</span>
                        <button
                          onClick={handleApply}
                          className="btn-luma-glass text-xs px-3 py-1.5"
                        >
                          {appliedLocal ? "Applied ✓" : "Apply"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Interactive Sticky Apply & AI Score Sidebar (4 Cols) */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* Main Apply Card */}
              <div className="p-6 rounded-2xl bg-[#121624] border border-white/15 shadow-xl space-y-5 sticky top-0">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white font-sans">
                    Apply to {companyName}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Is your profile up to date? Verify your resume alignment and stand out directly to recruiters.
                  </p>
                </div>

                {/* AI Odds & Match Score Callout */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-950/20 to-transparent border border-amber-400/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5 uppercase">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Improve your odds
                    </span>
                    {m && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs border border-cyan-400/30">
                        {m.overall_score}% FIT
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {m?.ai_explanation || `Highlight your experience with ${skillsList.slice(0, 2).join(' & ')} in the note below to demonstrate strong alignment.`}
                  </p>
                </div>

                {/* Pitch / Cover Note Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-200">
                      What interests you about working here?
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoGenerateNote}
                      disabled={aiGeneratingNote}
                      className="text-[11px] text-cyan-300 hover:text-white flex items-center gap-1 font-mono hover:underline"
                    >
                      <Sparkle className="w-3 h-3 text-cyan-400" />
                      <span>{aiGeneratingNote ? "Generating..." : "AI Draft Pitch"}</span>
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Introduce yourself, mention key projects, and explain why you're a great fit for this team..."
                    className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 transition-all resize-none"
                  />
                </div>

                {/* Primary Apply Button */}
                <button
                  onClick={handleApply}
                  disabled={appliedLocal}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                    appliedLocal
                      ? 'bg-emerald-500 text-black font-extrabold cursor-default'
                      : 'btn-luma-primary !py-3.5'
                  }`}
                >
                  {appliedLocal ? (
                    <>
                      <CheckCheck className="w-4 h-4 text-black" />
                      <span>Applied to Position ✓</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-black" />
                      <span>1-Click Apply Now</span>
                    </>
                  )}
                </button>

                {/* AI Practice & Prep Shortcuts */}
                <div className="space-y-2 pt-3 border-t border-white/10">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    AI Preparation Hub
                  </span>
                  
                  {onNavigateToInterview && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToInterview(jobTitle, description);
                      }}
                      className="w-full p-2.5 rounded-xl bg-white/[0.03] hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-400/30 text-xs text-left text-cyan-300 flex items-center justify-between transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <BrainCircuit className="w-4 h-4 text-cyan-400" />
                        <span>AI Mock Interview for this Role</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {onNavigateToChat && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToChat(jobTitle);
                      }}
                      className="w-full p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-left text-slate-300 hover:text-white flex items-center justify-between transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        <span>Ask Aven Copilot About this Role</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
