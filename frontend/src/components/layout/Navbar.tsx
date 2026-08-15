import React, { useState } from 'react';
import { Sparkles, LogOut, User as UserIcon, Briefcase, FileText, LayoutDashboard, Target, Users, BarChart3, PlusCircle, Menu, X } from 'lucide-react';
import { User } from '../../types';
import { ExpandableTabs, TabItem } from '../ui/expandable-tabs';

interface NavbarProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const candidateTabs: TabItem[] = [
    { title: "Dashboard", icon: LayoutDashboard },
    { title: "Resume Analyzer", icon: FileText },
    { title: "Job Matches", icon: Briefcase },
    { type: "separator" },
    { title: "Skill Gaps", icon: Target },
    { title: "Applications", icon: FileText },
  ];

  const candidateTabItems = [
    { key: 'candidate_dash', title: "Dashboard", icon: LayoutDashboard },
    { key: 'resume_analyzer', title: "Resume Analyzer", icon: FileText },
    { key: 'job_recs', title: "Job Matches", icon: Briefcase },
    { key: 'skill_gaps', title: "Skill Gaps", icon: Target },
    { key: 'applications', title: "Applications", icon: FileText },
  ];

  const candidateTabKeys = ['candidate_dash', 'resume_analyzer', 'job_recs', 'separator', 'skill_gaps', 'applications'];

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

  return (
    <header className="sticky top-2 sm:top-4 z-50 max-w-7xl mx-auto px-2 sm:px-4">
      <nav className="bg-[#042f26]/95 backdrop-blur-xl rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 shadow-2xl border border-[#34d399]/40 flex-nowrap">
        
        {/* Brand Logo */}
        <div 
          onClick={() => {
            setActiveTab(user ? (user.role === 'candidate' ? 'candidate_dash' : 'recruiter_dash') : 'landing');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#10b981]/20 border border-[#34d399]/40 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#34d399] animate-pulse" />
          </div>
          <div className="shrink-0">
            <span className="text-base sm:text-lg font-black tracking-tight text-white font-outfit block leading-tight">
              HireSense <span className="text-[#34d399]">AI</span>
            </span>
            <span className="block text-[8px] sm:text-[9px] text-[#6ee7b7] font-mono tracking-wider uppercase font-bold leading-tight">
              Emerald Intelligence
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
                activeColor="text-[#022c22]"
              />
            ) : (
              <ExpandableTabs 
                tabs={recruiterTabs} 
                onChange={handleRecruiterTabChange}
                selectedIndex={getRecruiterIndex(activeTab)}
                activeColor="text-[#022c22]"
              />
            )}
          </div>
        )}

        {/* User Status / Login Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-[#064e3b] border border-[#34d399]/40 text-[#6ee7b7] text-xs font-bold font-mono whitespace-nowrap">
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
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white text-xs sm:text-sm font-black shadow-lg shadow-[#10b981]/30 transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 border border-white/20"
            >
              <UserIcon className="w-4 h-4 text-white shrink-0" />
              <span>Sign In / Demo</span>
            </button>
          )}
        </div>

      </nav>

      {/* Mobile Navigation Drawer */}
      {user && mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-3 bg-[#042f26]/95 backdrop-blur-xl rounded-2xl border border-[#34d399]/40 shadow-2xl space-y-1.5 animate-in slide-in-from-top-2">
          <div className="px-2 py-1 flex items-center justify-between text-xs text-[#6ee7b7] font-mono font-bold uppercase tracking-wider border-b border-[#34d399]/20 pb-2 mb-1">
            <span>Navigation Menu</span>
            <span className="px-2 py-0.5 rounded bg-[#064e3b] text-[#34d399]">{user.role}</span>
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
                    ? 'bg-[#10b981] text-white font-bold shadow-md'
                    : 'text-emerald-100/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#34d399]'}`} />
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

