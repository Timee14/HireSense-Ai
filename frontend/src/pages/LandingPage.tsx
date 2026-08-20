import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Target, Award, Users, FileText, CheckCircle2, ChevronRight, Briefcase, BarChart3, ArrowUpRight, BrainCircuit } from 'lucide-react';

interface LandingPageProps {
  onSelectRoleDemo: (role: 'candidate' | 'recruiter', targetTab?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectRoleDemo }) => {

  const featureCards = [
    {
      title: "AI Resume Parsing",
      description: "Extract text streams, skills, education, and career timelines automatically with PyMuPDF & AI.",
      icon: FileText
    },
    {
      title: "Dense Vector Match",
      description: "Rank candidates and software roles using high-dimensional cosine similarity embeddings.",
      icon: Target
    },
    {
      title: "Skill Gap Analysis",
      description: "Identify market skill demands to expand your career reach and optimize ATS keyword alignment.",
      icon: Cpu
    }
  ];

  const showcaseJobs = [
    {
      title: 'Senior Full-Stack Engineer',
      company: 'Tech Innovations Inc.',
      location: 'Bengaluru / Remote',
      match: '94% MATCH',
      skills: ['Python', 'FastAPI', 'React', 'PostgreSQL'],
      salary: '₹28,00,000 - ₹34,00,000'
    },
    {
      title: 'AI / ML Research Lead',
      company: 'CloudScale Systems',
      location: 'Hyderabad / Hybrid',
      match: '91% MATCH',
      skills: ['Python', 'PyTorch', 'TensorFlow', 'NLP'],
      salary: '₹32,00,000 - ₹40,00,000'
    },
    {
      title: 'Frontend React Architect',
      company: 'DataPulse AI Labs',
      location: 'Pune / Remote',
      match: '89% MATCH',
      skills: ['React 18', 'TypeScript', 'Tailwind CSS'],
      salary: '₹26,00,000 - ₹32,00,000'
    },
    {
      title: 'Cloud Infrastructure Lead',
      company: 'Nexus Software',
      location: 'Gurugram / Hybrid',
      match: '95% MATCH',
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
      salary: '₹35,00,000 - ₹42,00,000'
    }
  ];

  return (
    <div className="min-h-screen text-white bg-[#022c22] font-sans overflow-x-hidden">
      
      {/* 1. HERO SECTION (Dark Emerald Gradient with Glowing Mint Visuals) */}
      <section className="emerald-hero-bg pt-6 sm:pt-10 md:pt-12 pb-12 sm:pb-20 px-4 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center relative z-10">
          
          {/* Left Column: Hero Text */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-4.5 py-1.5 sm:py-2 rounded-full bg-[#064e3b]/80 border border-[#34d399]/40 text-[#6ee7b7] text-xs sm:text-sm font-bold shadow-lg backdrop-blur-md max-w-full">
              <Sparkles className="w-4 h-4 text-[#34d399] animate-pulse shrink-0" />
              <span className="truncate">EMERALD VECTOR RECRUITMENT INTELLIGENCE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight font-outfit drop-shadow-md break-words">
              AI Precision is the key to software recruitment
            </h1>

            <p className="text-emerald-100/90 text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-xl">
              HireSense AI parses PDF resumes, computes dense vector embeddings, and outputs automated candidate match scores.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 flex-wrap">
              <button
                onClick={() => onSelectRoleDemo('candidate', 'candidate_dash')}
                className="btn-emerald-cta w-full sm:w-auto"
              >
                <span>Candidate Portal</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                onClick={() => onSelectRoleDemo('candidate', 'ai_interview')}
                className="btn-emerald-secondary w-full sm:w-auto flex items-center justify-center gap-2 !border-[#34d399]/60 hover:!bg-[#10b981]/20"
              >
                <BrainCircuit className="w-4 h-4 text-[#34d399]" />
                <span>AI Mock Interview</span>
              </button>

              <button
                onClick={() => onSelectRoleDemo('recruiter', 'recruiter_dash')}
                className="btn-emerald-secondary w-full sm:w-auto"
              >
                <span>Recruiter Portal</span>
              </button>
            </div>
          </div>


          {/* Right Column: Floating Emerald Glass Candidate Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="w-full max-w-md emerald-card space-y-6 relative rounded-3xl">
              
              {/* Top Header Row */}
              <div className="flex items-center justify-between border-b border-[#34d399]/25 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#059669] text-white flex items-center justify-center font-black text-lg shadow-md">
                    AC
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white">Alex Chen</h4>
                    <span className="text-xs text-[#6ee7b7] font-semibold">Senior Full-Stack Engineer</span>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-[#10b981] text-white text-xs font-black font-mono shadow-md">
                  94% MATCH
                </span>
              </div>

              {/* Score Ring Component */}
              <div className="flex items-center justify-between p-5 rounded-2xl bg-[#022c22]/90 border border-[#34d399]/30">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-[#6ee7b7]">ATS RESUME SCORE</span>
                  <div className="text-4xl font-black text-white font-outfit">87 / 100</div>
                  <span className="text-xs text-[#34d399] font-bold">Top 5% Candidate Profile</span>
                </div>
                <div className="w-20 h-20 relative flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="32" stroke="rgba(52, 211, 153, 0.2)" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="#34d399"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="201"
                      strokeDashoffset={201 - (201 * 87) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-base font-black text-white">87</span>
                </div>
              </div>

              {/* AI Insight Snippet */}
              <div className="emerald-ai-insight">
                <div className="text-xs font-black text-[#34d399] uppercase tracking-wider mb-1">AI INSIGHT</div>
                <p className="text-sm text-emerald-50 leading-relaxed font-medium">
                  Your resume has strong backend experience. Adding Docker and Kubernetes could improve your match potential by 35%.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. CREATIVE ATS RESUME GRADER & TWO-TIER SYSTEM SHOWCASE (Enhancv-inspired Visual Scanner) */}
      <section className="py-14 sm:py-20 md:py-28 px-3 sm:px-6 relative bg-[#011d17] border-y border-[#34d399]/20 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/2 -left-20 w-72 sm:w-96 h-72 sm:h-96 bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center relative z-10">
          
          {/* Left Column: Interactive Illustrated "RESUME GRADER" Machine & Scanning Document */}
          <div className="lg:col-span-6 flex justify-center items-center relative w-full overflow-hidden sm:overflow-visible">
            
            {/* Machine & Paper Responsive Container */}
            <div className="relative w-full max-w-[520px] flex flex-col sm:flex-row items-center sm:items-stretch justify-center gap-3 sm:gap-0 select-none px-1">
              
              {/* Left Hardware Module: "RESUME GRADER" Control Panel */}
              <div className="w-full sm:w-36 bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950/90 border border-slate-700/80 rounded-2xl p-3.5 sm:p-4 shadow-2xl shadow-black/80 flex flex-row sm:flex-col items-center justify-between z-20 shrink-0 gap-3 sm:space-y-3 relative sm:-mr-4 backdrop-blur-md">
                
                {/* Title */}
                <div className="text-left sm:text-center shrink-0">
                  <span className="text-[10px] sm:text-[11px] font-black text-slate-300 tracking-widest font-mono uppercase block leading-tight">
                    RESUME
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-black text-[#34d399] tracking-widest font-mono uppercase block leading-tight">
                    GRADER
                  </span>
                </div>

                {/* Speedometer Gauge */}
                <div className="w-20 h-14 sm:w-24 sm:h-16 bg-slate-950 rounded-xl border border-slate-800 p-1.5 flex flex-col items-center justify-center relative overflow-hidden shadow-inner shrink-0">
                  {/* Gauge Arc */}
                  <div className="w-14 h-7 sm:w-16 sm:h-8 border-t-4 border-l-4 border-r-4 border-amber-400 rounded-t-full relative">
                    {/* Animated Needle */}
                    <div className="absolute bottom-0 left-1/2 w-1 h-5 sm:h-6 bg-gradient-to-t from-amber-500 to-emerald-400 origin-bottom -translate-x-1/2 rotate-45 transform transition-transform duration-700 animate-pulse" />
                    <div className="absolute -bottom-1 left-1/2 w-2.5 h-2.5 rounded-full bg-white -translate-x-1/2 shadow" />
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-mono text-emerald-400 font-bold mt-1">94% ATS</span>
                </div>

                {/* ECG / Wave Pulse Monitor */}
                <div className="hidden sm:block w-full bg-slate-950 rounded-xl border border-slate-800 p-2 shadow-inner overflow-hidden relative">
                  <div className="flex items-center justify-center h-6 sm:h-8">
                    <svg className="w-full h-full" viewBox="0 0 100 30" fill="none">
                      <path
                        d="M0 15 H20 L28 4 L36 26 L44 10 L52 18 L60 15 H100"
                        stroke="#34d399"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-pulse"
                      />
                    </svg>
                  </div>
                  <div className="w-full h-[1px] bg-slate-800 mt-1" />
                </div>

                {/* Status Indicator LEDs */}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-rose-500 shadow-md shadow-rose-500/50" />
                  <div className="w-2 h-2 rounded-full bg-amber-400 shadow-md shadow-amber-400/50" />
                  <div className="w-2 h-2 rounded-full bg-white shadow-md shadow-white/50 animate-ping" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/50" />
                </div>

                {/* Ejected receipt snippet (hidden on small mobile to save space) */}
                <div className="hidden sm:block w-20 bg-white text-slate-900 rounded-b-md p-1.5 text-[7px] font-mono shadow-md border-t-2 border-dashed border-slate-400 -mt-1 scale-90">
                  <div className="w-full h-0.5 bg-slate-400 mb-0.5" />
                  <div className="w-3/4 h-0.5 bg-rose-400 mb-0.5" />
                  <div className="w-full h-0.5 bg-emerald-500" />
                </div>

              </div>

              {/* Center & Right: High-Res Resume Document Passing Through Dark Scanner Base */}
              <div className="w-full flex-1 relative">
                
                {/* Paper Resume Document */}
                <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-4 sm:p-6 border border-slate-200 relative overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
                  
                  {/* Laser Scanning Beam (Animated vertical gradient line) */}
                  <div className="absolute left-0 right-0 h-2 sm:h-2.5 bg-gradient-to-r from-transparent via-[#10b981] to-transparent opacity-75 shadow-lg shadow-[#10b981] animate-scan z-30 pointer-events-none" />

                  {/* Resume Header */}
                  <div className="border-b border-slate-200 pb-2.5 mb-2.5">
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-outfit">
                      Taylor Foster
                    </h3>
                    <p className="text-[11px] sm:text-xs text-sky-700 font-bold">
                      Senior IT Project Manager & Cloud Lead
                    </p>
                    <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] text-slate-500 mt-0.5 flex-wrap">
                      <span>San Francisco, CA</span>
                      <span>•</span>
                      <span>taylor.foster@cloudmail.com</span>
                    </div>
                  </div>

                  {/* Summary Section */}
                  <div className="mb-2.5">
                    <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-800 uppercase tracking-wider block mb-0.5">
                      Summary
                    </span>
                    <p className="text-[8.5px] sm:text-[9.5px] text-slate-600 leading-relaxed">
                      Results-oriented project lead with 8+ years experience scaling cloud infrastructures, CI/CD pipelines, and microservices for high-velocity engineering teams.
                    </p>
                  </div>

                  {/* Technical Skills Section with ATS Highlights */}
                  <div className="mb-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-800 uppercase tracking-wider block mb-1">
                      Technical Skills (ATS Parsed)
                    </span>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[8px] sm:text-[9px] font-bold border border-emerald-300">
                        SQL
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[8px] sm:text-[9px] font-bold border border-emerald-300">
                        FastAPI
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[8px] sm:text-[9px] font-bold border border-emerald-300">
                        Python
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[8px] sm:text-[9px] font-bold border border-emerald-300">
                        AWS / Docker
                      </span>
                      <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-mono text-[8px] sm:text-[9px] font-bold">
                        PostgreSQL
                      </span>
                    </div>
                  </div>

                  {/* Professional Experience & Key Achievements */}
                  <div className="space-y-2">
                    <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-800 uppercase tracking-wider block">
                      Key Quantified Achievements
                    </span>
                    
                    {/* Highlighted Result 1 */}
                    <div className="p-2 rounded-md bg-gradient-to-r from-emerald-50 via-teal-50 to-transparent border-l-2 border-emerald-500">
                      <span className="text-[8.5px] sm:text-[9px] font-bold text-emerald-900 block">
                        Cost Tuning & Distributed Systems
                      </span>
                      <p className="text-[8px] sm:text-[8.5px] text-slate-700 leading-snug">
                        Optimized database indexing and Redis caching, saving over <strong>$120,000 annually</strong> while dropping API latency by <strong>68%</strong>.
                      </p>
                    </div>

                    {/* Highlighted Result 2 */}
                    <div className="p-2 rounded-md bg-gradient-to-r from-sky-50 via-indigo-50 to-transparent border-l-2 border-sky-500">
                      <span className="text-[8.5px] sm:text-[9px] font-bold text-sky-900 block">
                        Exceeded Deployment Throughput Target by 92%
                      </span>
                      <p className="text-[8px] sm:text-[8.5px] text-slate-700 leading-snug">
                        Standardized automated CI/CD PR test coverage gates across 14 internal engineering repositories.
                      </p>
                    </div>
                  </div>

                </div>

                {/* Scanner Hardware Base Stand (Glassmorphic chassis matching screenshot) */}
                <div className="h-14 sm:h-18 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-950 rounded-2xl border-t-2 border-indigo-500/40 shadow-2xl p-2.5 flex items-center justify-between -mt-4 relative z-20 mx-1 sm:mx-2">
                  <div className="w-full h-9 sm:h-11 bg-slate-950/90 rounded-xl border border-slate-800 flex items-center justify-between px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                      <span className="text-[8px] sm:text-[9.5px] font-mono text-[#34d399] font-bold uppercase truncate">
                        AI SCANNER: ACTIVE (300 DPI EXTRACT)
                      </span>
                    </div>
                    <span className="text-[8px] sm:text-[9.5px] font-mono text-slate-400 font-bold shrink-0 ml-2">
                      STREAM MATCH: 94.2%
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Right Column: High-Converting Explanatory Copy & Multi-Tier Framework */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-left">
            
            {/* Step Pill */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#10b981]/20 border border-[#34d399]/50 text-[#34d399] flex items-center justify-center font-extrabold text-sm font-mono shadow-md shrink-0">
                1
              </div>
              <span className="text-xs font-mono font-bold text-[#6ee7b7] uppercase tracking-widest">
                Two-Tier Calibration Architecture
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight font-outfit">
              HireSense’s Resume Checker forms its ATS score with a two-tier system
            </h2>

            <div className="space-y-3 sm:space-y-4 text-emerald-100/80 text-sm sm:text-base leading-relaxed">
              <p>
                When you're applying for a job, there's a high chance your resume will be screened through an applicant tracking system before it finds its way on a recruiter's screen. ATS helps hiring managers find the right candidates by indexing resumes into a searchable vector database and extracting structured competencies.
              </p>
              
              <p>
                That's why the success of your application is highly dependent on how tailored your resume is for the role, the clarity of your section formatting, and what measurable impact keywords you have included.
              </p>

              <p>
                And then your resume must stand out in a pile of applicants, as well as deal with potential red flags, missing tech stack metrics, and role fit. HireSense’s dual-engine Grader & AI Mock Studio handles that by giving you the exact strategies you need to conquer this step.
              </p>
            </div>

            {/* Feature Bullets / Calibration Tiers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-1 sm:pt-2">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#042f26]/80 border border-[#34d399]/30 space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#34d399] shrink-0" />
                  <h4 className="text-sm font-bold text-white font-outfit">Tier 1: ATS Keyword Density</h4>
                </div>
                <p className="text-xs text-emerald-100/70 leading-relaxed">
                  Dense vector cosine similarity and semantic skill matching with zero parsing errors.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#042f26]/80 border border-[#34d399]/30 space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#34d399] shrink-0" />
                  <h4 className="text-sm font-bold text-white font-outfit">Tier 2: Recruiter Rubric</h4>
                </div>
                <p className="text-xs text-emerald-100/70 leading-relaxed">
                  Evaluates quantifiable impact ($, %, scale), STAR structure, and executive tone.
                </p>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <button
                onClick={() => onSelectRoleDemo('candidate', 'resume_analyzer')}
                className="btn-emerald-cta w-full sm:w-auto !h-12 !px-8 !text-sm"
              >
                <span>Scan Your Resume Free</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>


          </div>

        </div>
      </section>


      {/* 3. PLATFORM CAPABILITIES FEATURE SECTION */}
      <section className="py-20 md:py-28 px-4 relative bg-[#022c22]/60">

        <div className="max-w-7xl mx-auto space-y-16 text-center">
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <span className="text-sm font-bold text-[#34d399] uppercase tracking-widest">Platform Capabilities</span>
            <h2 className="text-4xl md:text-6xl font-black text-white font-outfit">
              Everything you need for precision recruitment
            </h2>
            <p className="text-lg md:text-xl text-emerald-100/80 max-w-xl mx-auto">
              Automated resume parsing, vector similarity scoring, and candidate ranking built for engineering teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {featureCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="emerald-card space-y-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#064e3b] border border-[#34d399]/40 flex items-center justify-center text-[#34d399] shadow-md">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-black text-white font-outfit">{feat.title}</h3>
                  <p className="text-base text-emerald-100/80 leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. AI MATCHING FLOW */}
      <section className="py-20 md:py-28 px-4 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-sm font-bold text-[#34d399] uppercase tracking-widest">Multi-Vector Similarity Engine</span>
            <h2 className="text-4xl md:text-6xl font-black text-white font-outfit">
              How HireSense AI evaluates candidate match fit
            </h2>
            <p className="text-lg md:text-xl text-emerald-100/80">
              Cosine distance embeddings combined with heuristic skill keyword overlap.
            </p>
          </div>

          {/* Flow Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
            
            <div className="emerald-card text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#064e3b] text-[#34d399] border border-[#34d399]/40 flex items-center justify-center mx-auto font-black text-lg shadow-md">
                1
              </div>
              <h4 className="text-xl font-bold text-white font-outfit">Candidate Profile</h4>
              <p className="text-sm text-emerald-100/70">Parsed PDF text stream, skills, and timeline data.</p>
            </div>

            <div className="emerald-card text-center space-y-4 border-2 border-[#34d399] shadow-2xl bg-[#064e3b]">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#10b981] to-[#059669] text-white flex items-center justify-center mx-auto font-black text-xl shadow-lg">
                94%
              </div>
              <h4 className="text-xl font-bold text-white font-outfit">AI MATCH ENGINE</h4>
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#022c22] text-[#34d399] text-xs font-bold border border-[#34d399]/30">
                VECTOR MATCH
              </span>
            </div>

            <div className="emerald-card text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#064e3b] text-[#34d399] border border-[#34d399]/40 flex items-center justify-center mx-auto font-black text-lg shadow-md">
                3
              </div>
              <h4 className="text-xl font-bold text-white font-outfit">Job Requisition</h4>
              <p className="text-sm text-emerald-100/70">Required technical stack & experience criteria.</p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. RECOMMENDED OPPORTUNITIES */}
      <section className="py-20 md:py-28 px-4 bg-[#022c22]/60">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-sm font-bold text-[#34d399] uppercase tracking-widest">Active Engineering Roles</span>
              <h2 className="text-4xl md:text-6xl font-black text-white font-outfit">
                Recommended Opportunities
              </h2>
            </div>

            <button
              onClick={() => onSelectRoleDemo('candidate', 'job_recs')}
              className="btn-emerald-secondary !h-12 !px-6 !text-sm"
            >
              <span>Explore All Jobs</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {showcaseJobs.map((job, idx) => (
              <div key={idx} className="emerald-card flex flex-col justify-between space-y-5 p-6">
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3.5 py-1.5 rounded-full bg-[#064e3b] text-[#34d399] text-xs font-bold font-mono border border-[#34d399]/30">
                      {job.match}
                    </span>
                    <Briefcase className="w-6 h-6 text-[#6ee7b7]" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white font-outfit leading-snug">{job.title}</h3>
                    <p className="text-sm text-emerald-100/70 font-medium mt-1">{job.company} • {job.location}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.skills.map((sk, sIdx) => (
                      <span key={sIdx} className="px-3 py-1 rounded-md bg-[#022c22] border border-[#34d399]/30 text-[#6ee7b7] text-xs font-semibold">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#34d399]/20 flex items-center justify-between">
                  <div>
                    <span className="block text-[11px] text-[#6ee7b7] font-bold">PACKAGE</span>
                    <span className="text-sm font-black text-white">{job.salary}</span>
                  </div>
                  <button
                    onClick={() => onSelectRoleDemo('candidate', 'job_recs')}
                    className="btn-emerald-cta !h-10 !px-5 !text-xs !font-bold"
                  >
                    <span>Apply</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. RECRUITER STATS */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-sm font-bold text-[#34d399] uppercase tracking-widest">Recruiter Command Center</span>
            <h2 className="text-4xl md:text-6xl font-black text-white font-outfit">
              Screen applicants with instant AI explanations
            </h2>
            <p className="text-lg md:text-xl text-emerald-100/80">
              Real-time candidate evaluation metrics for hiring managers and talent acquisition leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="emerald-card text-center space-y-3 p-8">
              <div className="text-5xl md:text-7xl font-black text-white font-outfit">1,248</div>
              <span className="text-base font-bold text-emerald-100/80">Candidates Evaluated</span>
            </div>

            <div className="emerald-card text-center space-y-3 border-2 border-[#34d399] p-8 bg-[#064e3b]">
              <div className="text-5xl md:text-7xl font-black text-[#34d399] font-outfit">94%</div>
              <span className="text-base font-bold text-white">Average Match Accuracy</span>
            </div>

            <div className="emerald-card text-center space-y-3 p-8">
              <div className="text-5xl md:text-7xl font-black text-white font-outfit">186</div>
              <span className="text-base font-bold text-emerald-100/80">Shortlisted Candidates</span>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => onSelectRoleDemo('recruiter', 'recruiter_dash')}
              className="btn-emerald-cta !h-14 !px-10 !text-lg"
            >
              <span>Launch Recruiter Command Center</span>
              <ArrowRight className="w-6 h-6 text-white" />
            </button>
          </div>


        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-[#021f18] text-white py-16 px-4 border-t border-[#34d399]/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-white/10 pb-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#10b981] flex items-center justify-center font-black text-white text-base shadow-md">
                ⚡
              </div>
              <span className="text-2xl font-bold text-white font-outfit">HireSense AI</span>
            </div>
            <p className="text-sm text-emerald-100/70 leading-relaxed">
              Autonomous AI recruitment intelligence platform built for modern engineering teams.
            </p>
          </div>

          <div>
            <h4 className="text-base font-bold text-white mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-emerald-100/70">
              <li><a href="#" className="hover:text-[#34d399] transition-colors">Resume Analyzer</a></li>
              <li><a href="#" className="hover:text-[#34d399] transition-colors">Job Recommendations</a></li>
              <li><a href="#" className="hover:text-[#34d399] transition-colors">Skill Gap Engine</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold text-white mb-4">Architecture</h4>
            <ul className="space-y-2.5 text-sm text-emerald-100/70">
              <li>FastAPI REST Engine</li>
              <li>PyMuPDF Stream Parser</li>
              <li>PostgreSQL & pgvector</li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold text-white mb-4">Project</h4>
            <p className="text-sm text-emerald-100/70 leading-relaxed">
              Final Year Engineering Project • JSS Academy of Technical Education, Noida
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-emerald-100/70 gap-4">
          <p>© 2026 HireSense AI. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-[#34d399] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#34d399] cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
