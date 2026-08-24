import React, { useState, useEffect } from 'react';
import {
  Sparkles, Calendar, MapPin, ArrowRight, ArrowUpRight, ExternalLink,
  ShieldCheck, BrainCircuit, Users, FileText, CheckCircle2, Award,
  Cpu, Target, Globe, Youtube, Linkedin, Twitter, Github, Check,
  Clock, Share2, Heart, Zap, ChevronRight, UserCheck, Laptop, Gift
} from 'lucide-react';

interface LandingPageProps {
  onSelectRoleDemo: (role: 'candidate' | 'recruiter', targetTab?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectRoleDemo }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('1:30 PM GMT+5:30');

  // Format real local time with GMT offset
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const offsetMinutes = -now.getTimezoneOffset();
      const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
      const remMinutes = Math.abs(offsetMinutes) % 60;
      const sign = offsetMinutes >= 0 ? '+' : '-';
      const offsetStr = `GMT${sign}${offsetHours}${remMinutes ? `:${remMinutes < 10 ? '0' : ''}${remMinutes}` : ':30'}`;
      setCurrentTimeStr(`${time} ${offsetStr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen text-slate-100 luma-warp-bg font-sans selection:bg-white selection:text-black">
      
      {/* 0. LUMA MINIMAL TOP NAV BAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#08090d]/80 border-b border-white/[0.06] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="text-xl font-bold tracking-tight text-white font-sans">luma</span>
            <span className="text-xl font-black text-white leading-none">*</span>
          </div>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline ml-2 pl-2 border-l border-white/10">
            HireSense AI
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm">
          <div className="hidden md:flex items-center gap-2 text-slate-400 font-mono text-xs bg-white/[0.04] px-3 py-1.5 rounded-full border border-white/5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentTimeStr}</span>
          </div>

          <button 
            onClick={() => onSelectRoleDemo('candidate', 'job_recs')}
            className="text-slate-300 hover:text-white transition-colors font-medium text-xs sm:text-sm hidden sm:inline"
          >
            Discover Events
          </button>

          <button
            onClick={() => onSelectRoleDemo('candidate', 'candidate_dash')}
            className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-all border border-white/10"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* 1. HERO TWO-COLUMN STAGE (Matching Luma AI Engineer Mixer Layout) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* LEFT COLUMN: Poster Flyer Card + Presented By + Hosted By */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Event Flyer / Showcase Poster Card */}
            <div className="w-full rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-b from-[#131722] via-[#0e111a] to-[#0a0c12] shadow-2xl relative group">
              
              {/* Top Sponsor Banner */}
              <div className="px-4 py-2.5 bg-black/60 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-[11px] font-semibold text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-mono text-[9px] uppercase tracking-wider">SPONSORED BY</span>
                  <span className="text-white font-bold tracking-wide flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                    sarvam
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-mono text-[9px] uppercase tracking-wider">VENUE PARTNER</span>
                  <span className="text-white font-bold tracking-wide">anakin</span>
                </div>
              </div>

              {/* Poster Body */}
              <div className="p-5 sm:p-6 relative overflow-hidden space-y-5">
                {/* Background Cosmic Glow in poster */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/4 right-0 w-48 h-48 bg-blue-600/25 rounded-full blur-2xl pointer-events-none" />

                {/* Poster Title */}
                <div className="relative z-10 space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[10px] font-mono font-bold tracking-wider uppercase mb-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    Special Community Edition
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit tracking-tight leading-tight">
                    AI Engineer Mixer
                  </h2>
                  <p className="text-[11px] sm:text-xs font-mono font-bold text-slate-300 tracking-wider uppercase">
                    FOR PEOPLE BUILDING, BREAKING, & RETHINKING AI
                  </p>
                </div>

                {/* Date & Location inside poster */}
                <div className="relative z-10 grid grid-cols-1 gap-2 text-xs">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">DATE & TIME</div>
                      <div className="font-bold text-white text-xs">Sunday, August 30</div>
                      <div className="text-[11px] text-slate-300">10:00 AM - 2:00 PM</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">VENUE & PLACE</div>
                      <div className="font-bold text-white text-xs">Anakin Skywalker</div>
                      <div className="text-[11px] text-slate-300">Bengaluru, Karnataka</div>
                    </div>
                  </div>
                </div>

                {/* Illustrated Cosmic Coder Silhouette */}
                <div className="relative z-10 h-32 rounded-xl bg-gradient-to-tr from-black via-slate-950 to-blue-950/80 border border-white/10 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.25)_0%,transparent_70%)]" />
                  <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-1">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-cyan-300">
                      <BrainCircuit className="w-6 h-6 animate-pulse" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 font-mono">
                      HireSense AI Precision Engine
                    </span>
                  </div>
                </div>

                {/* Giveaway Highlight Cards */}
                <div className="relative z-10 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-slate-900 to-black border border-white/15 flex flex-col justify-between">
                      <div className="text-[9px] font-mono text-slate-400">SAMSUNG WATCH 6</div>
                      <div className="text-sm font-black text-emerald-400 font-mono mt-1">₹34,000</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-slate-900 to-black border border-white/15 flex flex-col justify-between">
                      <div className="text-[9px] font-mono text-slate-400">KEYCHRON KEYBOARD</div>
                      <div className="text-sm font-black text-cyan-400 font-mono mt-1">₹10,000</div>
                    </div>
                  </div>

                  <div className="py-1.5 px-3 rounded-lg bg-blue-500/15 border border-blue-400/30 text-center">
                    <span className="text-[10.5px] font-bold text-blue-200 font-mono">
                      500 SARVAM AI CREDITS FOR PARTICIPANTS
                    </span>
                  </div>
                </div>

                {/* Tag Pills */}
                <div className="relative z-10 flex items-center justify-between text-[10px] font-medium text-slate-300 pt-1 border-t border-white/10">
                  <span className="flex items-center gap-1">🎙️ Talks on AI and LLMs</span>
                  <span className="flex items-center gap-1">⚡ Vibe Coding</span>
                  <span className="flex items-center gap-1">🍕 Drinks & Swag</span>
                </div>

              </div>
            </div>

            {/* Presented By Card */}
            <div className="luma-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-black text-sm shadow-md">
                    WM
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-slate-400 uppercase">Presented by</div>
                    <div className="font-bold text-white text-sm hover:underline cursor-pointer flex items-center gap-1">
                      WeMakeDevs <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    isFollowing 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white text-black hover:bg-slate-200'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                World's most engaging hackathons, engineering summits, and AI recruitment pipelines.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-1 text-slate-400">
                <a href="#" className="hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
                  <Globe className="w-4 h-4" />
                </a>
                <a href="#" className="hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
                  <Youtube className="w-4 h-4" />
                </a>
                <a href="#" className="hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Hosted By List */}
            <div className="luma-card p-4 space-y-3">
              <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Hosted By
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                      WM
                    </div>
                    <span className="font-semibold text-white">WeMakeDevs</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Twitter className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px]">
                      AK
                    </div>
                    <span className="font-semibold text-white">Anakin</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Twitter className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                      KK
                    </div>
                    <span className="font-semibold text-white">Kunal Kushwaha</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Twitter className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                      HS
                    </div>
                    <span className="font-semibold text-white">HireSense AI Core</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Github className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>

          </div>


          {/* RIGHT COLUMN: Editorial Title + Date/Location + Registration Box + About Event */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Luma Editorial Serif Title */}
            <div className="space-y-3">
              <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[3.25rem] text-white font-medium tracking-tight leading-[1.12]">
                AI Engineer Mixer | Giveaways Worth ₹50,000
              </h1>
              <p className="text-slate-400 text-sm sm:text-base font-normal">
                Precision candidate intelligence, dense vector screening, and community networking for engineers and recruiters.
              </p>
            </div>

            {/* Date Block & Location Block */}
            <div className="space-y-3.5">
              {/* Date Block */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/10 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase leading-none">AUG</span>
                  <span className="text-lg font-black text-white font-outfit leading-tight">30</span>
                </div>
                <div>
                  <div className="font-semibold text-white text-sm sm:text-base">Sunday, August 30</div>
                  <div className="text-xs sm:text-sm text-slate-400">10:00 AM - 2:00 PM</div>
                </div>
              </div>

              {/* Location Block */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 text-slate-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-white text-sm sm:text-base flex items-center gap-1.5">
                    <span>Anakin Skywalker</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400">Bengaluru, Karnataka</div>
                </div>
              </div>
            </div>

            {/* 2. REGISTRATION BOX (Matching Luma Glass Modal/Box) */}
            <div className="luma-card p-5 sm:p-6 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Registration
                </h3>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Active RSVP
                </span>
              </div>

              {/* Approval Required Notice */}
              <div className="p-3.5 rounded-xl bg-white/[0.035] border border-white/[0.08] flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white">Approval Required</div>
                  <div className="text-[11px] text-slate-400">
                    Your registration is subject to host approval. Quick instant access is available via role portals below.
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Welcome! To join the event and test platform capabilities, please register below.
                </p>

                {/* Big White CTA Button */}
                <button
                  onClick={() => {
                    setRegistered(true);
                    onSelectRoleDemo('candidate', 'candidate_dash');
                  }}
                  className="btn-luma-primary w-full text-center justify-center font-bold text-sm sm:text-base cursor-pointer"
                >
                  {registered ? (
                    <span className="flex items-center gap-2 text-emerald-950">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      Request Submitted & Portal Opened
                    </span>
                  ) : (
                    <span>Request to Join</span>
                  )}
                </button>
              </div>

              {/* Quick Launch Role Demo Links */}
              <div className="pt-2 border-t border-white/[0.08] space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Instant Demo Launchers:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => onSelectRoleDemo('candidate', 'candidate_dash')}
                    className="btn-luma-glass !text-xs !py-2.5 !px-3 w-full justify-between"
                  >
                    <span>Candidate Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => onSelectRoleDemo('candidate', 'ai_interview')}
                    className="btn-luma-glass !text-xs !py-2.5 !px-3 w-full justify-between !border-cyan-400/30 hover:!bg-cyan-500/15 text-cyan-200"
                  >
                    <span>AI Interview</span>
                    <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                  </button>

                  <button
                    onClick={() => onSelectRoleDemo('recruiter', 'recruiter_dash')}
                    className="btn-luma-glass !text-xs !py-2.5 !px-3 w-full justify-between"
                  >
                    <span>Recruiter Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>

            </div>


            {/* 3. ABOUT EVENT SECTION (Exact Luma Story Copy + Feature Highlights) */}
            <div className="space-y-4 pt-2">
              <h3 className="text-lg sm:text-xl font-bold text-white font-outfit">
                About Event
              </h3>

              <div className="space-y-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>
                  Spend a Sunday morning in Bangalore with people building, breaking, and rethinking AI.
                </p>
                <p>
                  This is not a day of back-to-back presentations. We are mixing short technical talks with hands-on building, fun challenges, good conversations, food, and plenty of time to meet other people working on interesting things.
                </p>
              </div>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3">
                
                <div 
                  onClick={() => onSelectRoleDemo('candidate', 'resume_analyzer')}
                  className="p-4 rounded-2xl bg-white/[0.035] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-white text-sm flex items-center justify-between">
                    <span>ATS Resume Grader</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Extract keywords, match cosine vectors with open roles, and calculate real-time scoring.
                  </p>
                </div>

                <div 
                  onClick={() => onSelectRoleDemo('candidate', 'ai_interview')}
                  className="p-4 rounded-2xl bg-white/[0.035] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-white text-sm flex items-center justify-between">
                    <span>AI Mock Studio</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Speech recognition, automated voice evaluations, and personalized STAR feedback.
                  </p>
                </div>

                <div 
                  onClick={() => onSelectRoleDemo('candidate', 'skill_gaps')}
                  className="p-4 rounded-2xl bg-white/[0.035] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-white text-sm flex items-center justify-between">
                    <span>Skill Gap Radar</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Visualize missing competencies and get customized project recommendations.
                  </p>
                </div>

                <div 
                  onClick={() => onSelectRoleDemo('recruiter', 'screening')}
                  className="p-4 rounded-2xl bg-white/[0.035] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-white text-sm flex items-center justify-between">
                    <span>Candidate Screening</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Multi-candidate batch ranking, instant shortlisting, and candidate email notifications.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] bg-[#06070a] py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">luma*</span>
            <span>×</span>
            <span className="font-bold text-white">HireSense AI</span>
            <span>• Built for high-velocity engineering teams</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onSelectRoleDemo('candidate', 'candidate_dash')} className="hover:text-slate-300">
              Candidate Demo
            </button>
            <button onClick={() => onSelectRoleDemo('recruiter', 'recruiter_dash')} className="hover:text-slate-300">
              Recruiter Demo
            </button>
            <button onClick={() => onSelectRoleDemo('candidate', 'ai_interview')} className="hover:text-slate-300">
              Mock Interview
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
