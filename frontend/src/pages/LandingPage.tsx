import React from 'react';
import {
  Sparkles, ArrowRight, BrainCircuit, Users,
  FileText, Target, ChevronRight, Zap, CheckCircle2,
  Cpu, Github
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (role?: 'candidate' | 'recruiter', mode?: 'login' | 'register' | 'google_select', targetTab?: string) => void;
  onSelectRoleDemo?: (role: 'candidate' | 'recruiter', targetTab?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-cyan-500 selection:text-black flex flex-col justify-between">
      
      {/* 1. CLEAN TOP NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#08090d]/80 border-b border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">HireSense AI</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hidden sm:inline-block">
            Vector Talent Intelligence
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
          <button 
            onClick={() => onOpenAuth('candidate', 'register', 'resume_analyzer')}
            className="text-slate-300 hover:text-white transition-colors font-medium hidden md:inline"
          >
            ATS Resume Grader
          </button>
          <button 
            onClick={() => onOpenAuth('candidate', 'register', 'ai_interview')}
            className="text-cyan-300 hover:text-cyan-200 transition-colors font-medium hidden md:inline flex items-center gap-1.5"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            AI Mock Studio
          </button>
          <button
            onClick={() => onOpenAuth('candidate', 'login', 'candidate_dash')}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-all border border-white/10"
          >
            Sign In / Register
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 w-full space-y-16 text-center">
        
        {/* Badge & Headline */}
        <div className="space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            Next-Gen Autonomous Candidate & Resume Screening
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Smarter hiring with <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Vector Semantic Intelligence
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Eliminate keyword bias. Parse resumes instantly with high fidelity, rank candidates with cosine similarity embeddings, and prepare with voice-enabled AI interviews.
          </p>

          {/* Simple Direct Portal CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <button
              onClick={() => onOpenAuth('candidate', 'register', 'candidate_dash')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10 group cursor-pointer"
            >
              <span>For Job Candidates</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => onOpenAuth('recruiter', 'register', 'recruiter_dash')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-all border border-white/15 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>For Recruiters</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-3 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> 384-Dim Vector Match
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Instant ATS Scoring
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Free Demo
            </span>
          </div>
        </div>

        {/* 3. SIMPLIFIED FEATURE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          
          <div 
            onClick={() => onOpenAuth('candidate', 'register', 'resume_analyzer')}
            className="p-5 rounded-2xl bg-[#0e121d]/80 border border-white/10 hover:border-cyan-500/30 hover:bg-[#121726]/90 transition-all cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-white text-sm flex items-center justify-between">
                <span>ATS Resume Analyzer</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Grade keyword density, quantified metrics, and calibrate your resume for target positions.
              </p>
            </div>
          </div>

          <div 
            onClick={() => onOpenAuth('candidate', 'register', 'ai_interview')}
            className="p-5 rounded-2xl bg-[#0e121d]/80 border border-white/10 hover:border-cyan-500/30 hover:bg-[#121726]/90 transition-all cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-white text-sm flex items-center justify-between">
                <span>AI Mock Interview</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Practice voice and technical mock interviews with instant STAR rubric scorecards.
              </p>
            </div>
          </div>

          <div 
            onClick={() => onOpenAuth('candidate', 'register', 'skill_gaps')}
            className="p-5 rounded-2xl bg-[#0e121d]/80 border border-white/10 hover:border-cyan-500/30 hover:bg-[#121726]/90 transition-all cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-white text-sm flex items-center justify-between">
                <span>Skill Gap Radar</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Spot missing competencies and receive concrete project recommendations to boost your match.
              </p>
            </div>
          </div>

          <div 
            onClick={() => onOpenAuth('recruiter', 'register', 'screening')}
            className="p-5 rounded-2xl bg-[#0e121d]/80 border border-white/10 hover:border-cyan-500/30 hover:bg-[#121726]/90 transition-all cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-white text-sm flex items-center justify-between">
                <span>Candidate Screening</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Batch vector ranking for recruiters, automated shortlisting, and applicant tracking.
              </p>
            </div>
          </div>

        </div>

        {/* 4. TECH SPECS BAR */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="font-medium text-slate-300">FastAPI + pgvector + PyMuPDF</span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/Timee14/HireSense-Ai" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

      </main>

      {/* 5. MINIMAL FOOTER */}
      <footer className="border-t border-white/[0.08] bg-[#06070a] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-slate-300">HireSense AI</span> • Precision Resume Screening & Talent Intelligence
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onOpenAuth('candidate', 'register', 'candidate_dash')} className="hover:text-slate-300 transition-colors">
              Candidate Portal
            </button>
            <button onClick={() => onOpenAuth('recruiter', 'register', 'recruiter_dash')} className="hover:text-slate-300 transition-colors">
              Recruiter Portal
            </button>
            <button onClick={() => onOpenAuth('candidate', 'register', 'ai_interview')} className="hover:text-slate-300 transition-colors">
              AI Mock Studio
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
