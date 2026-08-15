import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Target, Award, Users, FileText, CheckCircle2, ChevronRight, Briefcase, BarChart3, ArrowUpRight } from 'lucide-react';

interface LandingPageProps {
  onSelectRoleDemo: (role: 'candidate' | 'recruiter') => void;
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

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={() => onSelectRoleDemo('candidate')}
                className="btn-emerald-cta w-full sm:w-auto"
              >
                <span>Candidate Portal</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={() => onSelectRoleDemo('recruiter')}
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

      {/* 2. FEATURE SECTION */}
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
              onClick={() => onSelectRoleDemo('candidate')}
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
                    onClick={() => onSelectRoleDemo('candidate')}
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
              onClick={() => onSelectRoleDemo('recruiter')}
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
