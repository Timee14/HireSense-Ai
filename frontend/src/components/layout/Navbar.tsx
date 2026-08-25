import React, { useState } from 'react';
import {
  Sparkles, LogOut, User as UserIcon, Briefcase, FileText, LayoutDashboard,
  Target, Users, BarChart3, PlusCircle, Menu, X, Bell, Video, Mail,
  CheckCircle2, ExternalLink, Calendar, MessageSquare, BrainCircuit, Bot
} from 'lucide-react';
import { User, NotificationItem } from '../../types';
import { ExpandableTabs, TabItem } from '../ui/expandable-tabs';

interface NavbarProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  notifications?: NotificationItem[];
  onMarkNotificationRead?: (id: string) => Promise<void>;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  notifications = [],
  onMarkNotificationRead
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter(n => n.is_read === 0).length;

  const candidateTabs: TabItem[] = [
    { title: "Dashboard", icon: LayoutDashboard },
    { title: "Aven AI", icon: Bot },
    { title: "AI Interview", icon: BrainCircuit },
    { title: "Resume Analyzer", icon: FileText },
    { title: "Job Matches", icon: Briefcase },
    { type: "separator" },
    { title: "Skill Gaps", icon: Target },
    { title: "Applications", icon: FileText },
  ];

  const candidateTabItems = [
    { key: 'candidate_dash', title: "Dashboard", icon: LayoutDashboard },
    { key: 'ai_chatbot', title: "Aven AI Career Hub", icon: Bot },
    { key: 'ai_interview', title: "AI Interview Studio", icon: BrainCircuit },
    { key: 'resume_analyzer', title: "Resume Analyzer", icon: FileText },
    { key: 'job_recs', title: "Job Matches", icon: Briefcase },
    { key: 'skill_gaps', title: "Skill Gaps", icon: Target },
    { key: 'applications', title: "Applications", icon: FileText },
  ];

  const candidateTabKeys = ['candidate_dash', 'ai_chatbot', 'ai_interview', 'resume_analyzer', 'job_recs', 'separator', 'skill_gaps', 'applications'];


  const recruiterTabs: TabItem[] = [
    { title: "Dashboard", icon: LayoutDashboard },
    { title: "Candidate Screening", icon: Users },
    { type: "separator" },
    { title: "Create Job", icon: PlusCircle },
    { title: "Analytics", icon: BarChart3 },
  ];

  const recruiterTabItems = [
    { key: 'recruiter_dash', title: "Dashboard", icon: LayoutDashboard },
    { key: 'screening', title: "Candidate Screening", icon: Users },
    { key: 'create_job', title: "Create Job", icon: PlusCircle },
    { key: 'analytics', title: "Analytics", icon: BarChart3 },
  ];

  const recruiterTabKeys = ['recruiter_dash', 'screening', 'separator', 'create_job', 'analytics'];

  const getCandidateIndex = (key: string) => {
    const idx = candidateTabKeys.indexOf(key);
    return idx >= 0 ? idx : 0;
  };

  const getRecruiterIndex = (key: string) => {
    const idx = recruiterTabKeys.indexOf(key);
    return idx >= 0 ? idx : 0;
  };

  const handleCandidateTabChange = (index: number | null) => {
    if (index !== null && candidateTabKeys[index] && candidateTabKeys[index] !== 'separator') {
      setActiveTab(candidateTabKeys[index]);
    }
  };

  const handleRecruiterTabChange = (index: number | null) => {
    if (index !== null && recruiterTabKeys[index] && recruiterTabKeys[index] !== 'separator') {
      setActiveTab(recruiterTabKeys[index]);
    }
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (notif.is_read === 0 && onMarkNotificationRead) {
      await onMarkNotificationRead(notif.id);
    }
  };

  return (
    <header className="sticky top-2 sm:top-4 z-50 max-w-7xl mx-auto px-2 sm:px-4">
      <nav className="bg-[#0c0e14]/85 backdrop-blur-2xl rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 shadow-2xl border border-white/10 flex-nowrap relative">
        
        {/* Brand Logo */}
        <div 
          onClick={() => {
            setActiveTab(user ? (user.role === 'candidate' ? 'candidate_dash' : 'recruiter_dash') : 'landing');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 animate-pulse" />
          </div>
          <div className="shrink-0">
            <span className="text-base sm:text-lg font-black tracking-tight text-white font-sans block leading-tight">
              HireSense <span className="text-cyan-400">*</span>
            </span>
            <span className="block text-[8px] sm:text-[9px] text-slate-400 font-mono tracking-wider uppercase font-bold leading-tight">
              Vector Intelligence
            </span>
          </div>
        </div>

        {/* Dynamic Expandable Tabs Component (Desktop) */}
        {user && (
          <div className="hidden lg:block shrink-0">
            {user.role === 'candidate' ? (
              <ExpandableTabs 
                tabs={candidateTabs} 
                onChange={handleCandidateTabChange}
                selectedIndex={getCandidateIndex(activeTab)}
                activeColor="text-white"
              />
            ) : (
              <ExpandableTabs 
                tabs={recruiterTabs} 
                onChange={handleRecruiterTabChange}
                selectedIndex={getRecruiterIndex(activeTab)}
                activeColor="text-white"
              />
            )}
          </div>
        )}

        {/* Right Section: Notification Bell + User Status / Login Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Notification Mailbox Bell (Candidates & Recruiters) */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`p-2 rounded-xl border transition-all relative ${
                    unreadCount > 0
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-lg shadow-cyan-500/20 animate-pulse'
                      : 'bg-white/10 text-white/80 border-white/10 hover:bg-white/20'
                  }`}
                  title="Interview Notifications & Mailbox"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-black flex items-center justify-center shadow-md animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Popover Dropdown */}
                {notificationsOpen && (
                  <div className="fixed sm:absolute right-3 sm:right-0 top-16 sm:top-auto sm:mt-3 w-[calc(100vw-24px)] sm:w-96 max-w-md bg-[#0c0e14]/95 border border-white/15 rounded-2xl shadow-2xl p-4 z-50 space-y-3 animate-fade-in backdrop-blur-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-xs font-bold text-white uppercase font-mono">Mailbox & Alerts</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-cyan-300 text-[10px] font-mono font-bold">
                        {unreadCount} Unread
                      </span>
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2.5 divide-y divide-white/5">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-400">
                          <CheckCircle2 className="w-6 h-6 text-slate-500 mx-auto mb-1 opacity-60" />
                          <span>No interview notifications yet.</span>
                        </div>
                      ) : (
                        notifications.map((notif) => {
                          const data = notif.parsed_data || {};
                          const isInterview = notif.type === 'interview_invite' || data.status === 'interview_scheduled' || notif.type === 'interview';
                          return (
                            <div
                              key={notif.id}
                              onClick={() => handleNotificationClick(notif)}
                              className={`p-3 rounded-xl transition-all space-y-2 cursor-pointer ${
                                notif.is_read === 0
                                  ? 'bg-white/[0.07] border border-cyan-400/40'
                                  : 'bg-black/30 border border-white/5 opacity-80'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  {isInterview ? (
                                    <Video className="w-4 h-4 text-cyan-400 shrink-0" />
                                  ) : (
                                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                                  )}
                                  <h5 className="font-bold text-white text-xs font-sans leading-tight">
                                    {data.title || (isInterview ? 'Interview Scheduled!' : 'Shortlisted for Role!')}
                                  </h5>
                                </div>
                                <span className="text-[9px] font-mono text-slate-400 shrink-0">
                                  {notif.created_at?.slice(11, 16) || 'Today'}
                                </span>
                              </div>

                              <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                                {data.notes || (isInterview ? `You are selected for an interview for ${data.job_title} at ${data.company_name}!` : 'Your application was shortlisted!')}
                              </p>

                              {data.scheduled_at && (
                                <div className="flex items-center gap-1.5 text-[10px] text-[#6ee7b7] font-mono">
                                  <Calendar className="w-3 h-3 text-[#34d399]" />
                                  <span>Time: {data.scheduled_at}</span>
                                </div>
                              )}

                              {/* Google Meet & Gmail Action Links */}
                              {data.location_or_link && (
                                <div className="flex items-center gap-2 pt-1">
                                  <a
                                    href={data.location_or_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2.5 py-1 rounded-lg bg-[#10b981] hover:bg-[#34d399] text-white text-[10px] font-bold flex items-center gap-1 transition-all"
                                  >
                                    <Video className="w-3 h-3" />
                                    <span>Join Google Meet</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                  <a
                                    href="https://mail.google.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2 py-1 rounded-lg bg-black/40 hover:bg-black/60 text-[#6ee7b7] text-[10px] font-bold flex items-center gap-1 border border-white/10"
                                  >
                                    <Mail className="w-3 h-3" />
                                    <span>Check Gmail</span>
                                  </a>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-white/10 border border-white/15 text-slate-300 text-xs font-mono font-semibold whitespace-nowrap">
                {user.role.toUpperCase()}
              </span>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 border border-white/10 shrink-0"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/20 text-white/80 hover:text-white transition-colors border border-white/10 shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-luma-primary !min-h-[40px] !text-xs !py-2 !px-4"
            >
              <UserIcon className="w-4 h-4 text-black shrink-0" />
              <span>Sign In / Demo</span>
            </button>
          )}
        </div>

      </nav>

      {/* Mobile Navigation Drawer */}
      {user && mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-3 bg-[#0c0e14]/95 backdrop-blur-2xl rounded-2xl border border-white/15 shadow-2xl space-y-1.5 animate-in slide-in-from-top-2">
          <div className="px-2 py-1 flex items-center justify-between text-xs text-slate-400 font-mono font-bold uppercase tracking-wider border-b border-white/10 pb-2 mb-1">
            <span>Navigation Menu</span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white">{user.role}</span>
          </div>

          {(user.role === 'candidate' ? candidateTabItems : recruiterTabItems).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-slate-950 font-bold shadow-md'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
