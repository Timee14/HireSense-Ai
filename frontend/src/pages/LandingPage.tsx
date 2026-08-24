import React, { useState, useEffect } from 'react';
import {
  Sparkles, ArrowRight, ArrowUpRight, ShieldCheck, BrainCircuit, Users,
  FileText, CheckCircle2, Award, Cpu, Target, Globe, Youtube, Linkedin,
  Twitter, Github, Check, Clock, Share2, Zap, ChevronRight, UserCheck,
  Laptop, Gift, BarChart3, Layers, Terminal, Database, PlayCircle
} from 'lucide-react';

interface LandingPageProps {
  onSelectRoleDemo: (role: 'candidate' | 'recruiter', targetTab?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectRoleDemo }) => {
  const [selectedDemoRole, setSelectedDemoRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [currentTimeStr, setCurrentTimeStr] = useState('1:30 PM GMT+5:30');

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
      
      {/* 0. LUMA-INSPIRED MINIMAL HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#08090d]/85 border-b border-white/[0.07] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div 
            className="flex items-center gap-1.5 cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="text-xl font-bold tracking-tight text-white font-sans">hiresense</span>
            <span className="text-xl font-black text-cyan-400 leading-none group-hover:rotate-45 transition-transform duration-300">*</span>
          </div>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline ml-2 pl-2 border-l border-white/10">
            Vector AI Intelligence
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm">
          <div className="hidden md:flex items-center gap-2 text-slate-400 font-mono text-xs bg-white/[0.04] px-3 py-1.5 rounded-full border border-white/5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Vector Engine 28ms</span>
          </div>

          <button 
            onClick={() => onSelectRoleDemo('candidate', 'resume_analyzer')}
            className="text-slate-300 hover:text-white transition-colors font-medium text-xs sm:text-sm hidden sm:inline"
          >
            ATS Resume Grader
          </button>

          <button 
            onClick={() => onSelectRoleDemo('candidate', 'ai_interview')}
            className="text-cyan-300 hover:text-cyan-200 transition-colors font-medium text-xs sm:text-sm hidden sm:inline flex items-center gap-1"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            AI Mock Studio
          </button>

          <button
            onClick={() => onSelectRoleDemo('candidate', 'candidate_dash')}
            className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-all border border-white/10"
          >
            Launch App
          </button>
        </div>
      </header>

      {/* 1. HERO TWO-COLUMN PRODUCT STAGE */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* LEFT COLUMN: HireSense Showcase Poster Card + Architecture Stack + Core Capabilities */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Product Showcase Flyer Card (Luma Card Aesthetic) */}
            <div className="w-full rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-b from-[#131722] via-[#0e111a] to-[#0a0c12] shadow-2xl relative group">
              
              {/* Top Engine Banner */}
              <div className="px-4 py-2.5 bg-black/60 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-[11px] font-semibold text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-mono text-[9px] uppercase tracking-wider">POWERED BY</span>
                  <span className="text-white font-bold tracking-wide flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-pulse"></span>
                    PyMuPDF + pgvector
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-mono text-[9px] uppercase tracking-wider">LATENCY</span>
                  <span className="text-emerald-400 font-mono font-bold">&lt; 30ms</span>
                </div>
              </div>

              {/* Poster Body */}
              <div className="p-5 sm:p-6 relative overflow-hidden space-y-5">
                {/* Radiant Cosmic Lens Flares */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/4 right-0 w-48 h-48 bg-blue-600/25 rounded-full blur-2xl pointer-events-none" />

                {/* Poster Title */}
                <div className="relative z-10 space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[10px] font-mono font-bold tracking-wider uppercase mb-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    Autonomous Talent Screening
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit tracking-tight leading-tight">
                    HireSense AI
                  </h2>
                  <p className="text-[11px] sm:text-xs font-mono font-bold text-slate-300 tracking-wider uppercase">
                    HIGH-DIMENSIONAL CANDIDATE & RESUME MATCHING
                  </p>
                </div>

                {/* Live Candidate Vector Match Preview Box */}
                <div className="relative z-10 p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-black text-xs shadow-md">
                        AC
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Alex Chen</div>
                        <div className="text-[10px] text-cyan-300 font-mono">Senior Full-Stack Engineer</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black font-mono">
                      94% MATCH
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs">
                    <div>
                      <div className="text-[9px] font-mono text-slate-400 uppercase">ATS CALIBRATION SCORE</div>
                      <div className="text-xl font-black text-white font-outfit">87 / 100</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] font-mono text-emerald-400 font-bold">TOP 3% MATCH</div>
                      <div className="text-[10px] text-slate-400">Python • FastAPI • React</div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics Pill Grid */}
                <div className="relative z-10 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-slate-900 to-black border border-white/15 flex flex-col justify-between">
                      <div className="text-[9px] font-mono text-slate-400">COSINE ACCURACY</div>
                      <div className="text-sm font-black text-emerald-400 font-mono mt-1">94.8% Match</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-slate-900 to-black border border-white/15 flex flex-col justify-between">
                      <div className="text-[9px] font-mono text-slate-400">PARSING SPEED</div>
                      <div className="text-sm font-black text-cyan-400 font-mono mt-1">&lt; 1.2s / PDF</div>
                    </div>
                  </div>

                  <div className="py-1.5 px-3 rounded-lg bg-blue-500/15 border border-blue-400/30 text-center">
                    <span className="text-[10.5px] font-bold text-blue-200 font-mono">
                      FULL PIPELINE: PARSE → EMBED → RANK → INTERVIEW
                    </span>
                  </div>
                </div>

                {/* Feature Chips */}
                <div className="relative z-10 flex items-center justify-between text-[10px] font-medium text-slate-300 pt-1 border-t border-white/10">
                  <span className="flex items-center gap-1">⚡ Vector Ranking</span>
                  <span className="flex items-center gap-1">🎙️ AI Voice Studio</span>
                  <span className="flex items-center gap-1">🎯 Zero Keyword Bias</span>
                </div>

              </div>
            </div>

            {/* Architecture Stack Card */}
            <div className="luma-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-slate-400 uppercase">Engine Specs</div>
                    <div className="font-bold text-white text-sm flex items-center gap-1">
                      FastAPI + pgvector + PyMuPDF
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectRoleDemo('candidate', 'resume_analyzer')}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-black hover:bg-slate-200 transition-all"
                >
                  Try Scanner
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Extracts raw text streams, parses structured career timelines, and calculates high-dimensional embeddings for candidate rankings.
              </p>

              {/* Social / Repo links */}
              <div className="flex items-center gap-3 pt-1 text-slate-400">
                <a href="https://github.com/Timee14/HireSense-Ai" target="_blank" rel="noreferrer" className="hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 flex items-center gap-1 text-xs">
                  <Github className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              </div>
            </div>

            {/* Core Modules List */}
            <div className="luma-card p-4 space-y-3">
              <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Autonomous Modules
              </div>

              <div className="space-y-2.5">
                <div 
                  onClick={() => onSelectRoleDemo('candidate', 'resume_analyzer')}
                  className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-white">ATS Resume Analyzer</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>

                <div 
                  onClick={() => onSelectRoleDemo('candidate', 'ai_interview')}
                  className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                      <BrainCircuit className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-white">AI Mock Interview Studio</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>

                <div 
                  onClick={() => onSelectRoleDemo('recruiter', 'screening')}
                  className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px]">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-white">Recruiter Candidate Screening</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>

                <div 
                  onClick={() => onSelectRoleDemo('candidate', 'skill_gaps')}
                  className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                      <Target className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-white">Skill Gap Analysis Radar</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            </div>

          </div>


          {/* RIGHT COLUMN: Editorial Title + Meta Blocks + Access & Demo Box + Story */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Luma Editorial Serif Title for HireSense AI */}
            <div className="space-y-3">
              <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[3.25rem] text-white font-medium tracking-tight leading-[1.12]">
                Precision AI Resume Screening | Vector Intelligence
              </h1>
              <p className="text-slate-400 text-sm sm:text-base font-normal">
                Autonomous resume parsing, semantic cosine similarity matching, and voice-enabled AI interview evaluations built for modern engineering hiring.
              </p>
            </div>

            {/* Spec & Performance Blocks (Luma Tile Style) */}
            <div className="space-y-3.5">
              {/* Tile 1: Vector Space Engine */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/10 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase leading-none">DIM</span>
                  <span className="text-lg font-black text-white font-outfit leading-tight">384</span>
                </div>
                <div>
                  <div className="font-semibold text-white text-sm sm:text-base">Dense Multi-Vector Embeddings</div>
                  <div className="text-xs sm:text-sm text-slate-400">High-dimensional cosine ranking across skills & experience</div>
                </div>
              </div>

              {/* Tile 2: PyMuPDF Extraction */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 text-cyan-300">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-white text-sm sm:text-base flex items-center gap-1.5">
                    <span>99.2% PDF Text Fidelity</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400">PyMuPDF stream extraction with zero parsing errors</div>
                </div>
              </div>
            </div>

            {/* 2. ACCESS & DEMO BOX (Matching Luma Glass Modal/Box) */}
            <div className="luma-card p-5 sm:p-6 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Interactive Platform Demo
                </h3>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Instant Free Access
                </span>
              </div>

              {/* Instant Access Notice */}
              <div className="p-3.5 rounded-xl bg-white/[0.035] border border-white/[0.08] flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white">Full Demo Environment Ready</div>
                  <div className="text-[11px] text-slate-400">
                    No credit card or waitlist required. Explore candidate tools, AI mock interviews, or recruiter screening with one click.
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Select your primary role to launch the live workspace:
                </p>

                {/* Role Switcher Primary Action */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectRoleDemo('candidate', 'candidate_dash')}
                    className="btn-luma-primary text-center justify-center font-bold text-xs sm:text-sm cursor-pointer"
                  >
                    <span>Candidate Portal</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>

                  <button
                    onClick={() => onSelectRoleDemo('recruiter', 'recruiter_dash')}
                    className="btn-luma-glass text-center justify-center font-bold text-xs sm:text-sm cursor-pointer !bg-white/15"
                  >
                    <span>Recruiter Portal</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Quick Launch Feature Links */}
              <div className="pt-2 border-t border-white/[0.08] space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Quick Feature Jump:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => onSelectRoleDemo('candidate', 'resume_analyzer')}
                    className="btn-luma-glass !text-xs !py-2.5 !px-3 w-full justify-between"
                  >
                    <span>Scan Resume</span>
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => onSelectRoleDemo('candidate', 'ai_interview')}
                    className="btn-luma-glass !text-xs !py-2.5 !px-3 w-full justify-between !border-cyan-400/30 hover:!bg-cyan-500/15 text-cyan-200"
                  >
                    <span>AI Mock Studio</span>
                    <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                  </button>

                  <button
                    onClick={() => onSelectRoleDemo('recruiter', 'screening')}
                    className="btn-luma-glass !text-xs !py-2.5 !px-3 w-full justify-between"
                  >
                    <span>Screening Matrix</span>
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>

            </div>


            {/* 3. ABOUT HIERESENSE AI SECTION (Product Narrative & Capabilities) */}
            <div className="space-y-4 pt-2">
              <h3 className="text-lg sm:text-xl font-bold text-white font-outfit">
                About HireSense AI
              </h3>

              <div className="space-y-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>
                  Traditional applicant tracking systems rely on brittle keyword search that rejects top engineers over slight formatting variations. HireSense AI completely redesigns hiring through semantic understanding.
                </p>
                <p>
                  By transforming raw resumes and job descriptions into high-dimensional vector embeddings, our engine identifies deep domain competencies, scores ATS keyword alignment, and powers autonomous voice mock interviews with quantitative feedback.
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
                    <span>Two-Tier ATS Grader</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Evaluates keyword density, quantifiable impact metrics, and role match percentage.
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
                    <span>AI Voice Mock Studio</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Real-time speech transcription, dynamic technical questions, and STAR rubric feedback.
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
                    Visualizes missing technical skills and recommends focused projects to maximize match scores.
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
                    Multi-applicant batch vector ranking, instant shortlisting, and candidate status notifications.
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
            <span className="font-bold text-white">HireSense AI</span>
            <span>•</span>
            <span>Autonomous Precision Resume Screening & Talent Intelligence</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onSelectRoleDemo('candidate', 'candidate_dash')} className="hover:text-slate-300">
              Candidate Demo
            </button>
            <button onClick={() => onSelectRoleDemo('recruiter', 'recruiter_dash')} className="hover:text-slate-300">
              Recruiter Demo
            </button>
            <button onClick={() => onSelectRoleDemo('candidate', 'ai_interview')} className="hover:text-slate-300">
              AI Mock Studio
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
