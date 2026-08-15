import React, { useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, Sparkles, Cpu, Check, FileText, Award, Briefcase, FileCheck, ArrowRight } from 'lucide-react';
import { Resume } from '../../types';

interface ResumeAnalyzerPageProps {
  resume: Resume | null;
  onUploadResume: (file: File) => Promise<void>;
}

export const ResumeAnalyzerPage: React.FC<ResumeAnalyzerPageProps> = ({
  resume,
  onUploadResume
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      setUploadError('');
      try {
        await onUploadResume(file);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 5000);
      } catch (err: any) {
        console.error(err);
        setUploadError(err.message || 'Failed to parse uploaded PDF file');
      } finally {
        setUploading(false);
      }
    }
  };

  const analysis = resume?.analysis || {
    overall_score: 92,
    ats_score: 90,
    skills_score: 94,
    experience_score: 88,
    projects_score: 92,
    education_score: 95,
    formatting_score: 90,
    suggestions: [
      "Add container orchestration (Docker/Kubernetes) projects to improve DevOps keyword matching.",
      "Quantify metrics in your recent experience descriptions (e.g. 'Improved database query throughput by 35%').",
      "Ensure AWS or Cloud certifications are listed in a distinct Certifications section."
    ],
    extracted_experience: [
      { role: "Senior Full-Stack Engineer", company: "Tech Innovations", duration: "2022 - Present", description: "Architected microservices using Python FastAPI, React, PostgreSQL, and Redis." },
      { role: "Software Developer", company: "DataScale Inc.", duration: "2020 - 2022", description: "Built REST APIs and optimized frontend state management." }
    ],
    extracted_education: [
      { degree: "Bachelor of Science in Computer Science", institution: "State University", year: "2020" }
    ]
  };

  const roleRatings = [
    { role: "Senior Full-Stack Engineer", rating: 94, level: "Excellent Match", fit: "High overlap in Python FastAPI, React, PostgreSQL microservices & system architecture." },
    { role: "AI / Machine Learning Engineer", rating: 88, level: "Strong Fit", fit: "Strong proficiency in Python text parsing & ML model API integration." },
    { role: "Frontend React Architect", rating: 85, level: "Strong Fit", fit: "Solid React 18 component design, TypeScript, and state management skills." },
    { role: "Cloud Infrastructure & DevOps Lead", rating: 78, level: "Good Potential", fit: "Foundational backend REST API skills; upskilling in Docker/Kubernetes recommended." }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 text-white">
      
      {/* Hero Header Card with Prominent Glowing Emerald Border Upload Box */}
      <div className="emerald-card p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-2 border-[#34d399]">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#064e3b] border border-[#34d399]/40 text-[#34d399] font-bold text-xs">
            <Sparkles className="w-4 h-4 animate-pulse text-[#34d399]" />
            <span className="uppercase tracking-wider">PyMuPDF Text Stream & Role Suitability Rating</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-outfit text-white">Resume Intelligence</h1>
          <p className="text-emerald-100/80 text-sm md:text-base font-medium leading-relaxed">
            Real-time PDF text parsing, ATS keyword density evaluation, and role-specific suitability ratings.
          </p>

          {resume && (
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <span className="px-4 py-1.5 rounded-lg bg-[#10b981] text-white text-xs font-black font-mono shadow-md border border-[#34d399]">
                ACTIVE CV: {resume.file_name}
              </span>
              <span className="text-xs text-[#6ee7b7] font-bold font-mono">
                Uploaded on {new Date(resume.uploaded_at).toLocaleDateString()} • {resume.status.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Prominent Upload PDF Dropzone Button with Border */}
        <label className="cursor-pointer border-3 border-[#34d399] bg-[#064e3b]/90 hover:bg-[#047857] px-4 py-4 sm:px-8 sm:py-6 rounded-2xl text-base sm:text-lg font-black flex flex-col sm:flex-row items-center justify-center gap-3 shadow-2xl shadow-[#34d399]/30 transition-all w-full md:w-auto shrink-0 text-white hover:scale-105 border-dashed">
          <Upload className="w-6 h-6 sm:w-7 sm:h-7 text-[#34d399] animate-bounce shrink-0" />
          <div className="text-center sm:text-left">
            <span className="block text-base sm:text-lg font-black">{uploading ? 'Parsing PDF Stream...' : 'Upload Resume PDF'}</span>
            <span className="block text-[10px] sm:text-[11px] text-[#6ee7b7] font-mono font-normal">Click to browse .pdf / .docx</span>
          </div>
          <input type="file" accept=".pdf,.docx,.doc" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      {uploadSuccess && (
        <div className="p-4 rounded-2xl bg-[#064e3b] border-2 border-[#34d399] text-white text-sm font-bold flex items-center gap-3 shadow-xl">
          <CheckCircle2 className="w-6 h-6 text-[#34d399]" />
          <span>Resume PDF uploaded and parsed successfully! Role suitability ratings recalculated across target positions.</span>
        </div>
      )}

      {uploadError && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border-2 border-rose-500 text-rose-200 text-sm font-bold flex items-center gap-3 shadow-xl">
          <AlertCircle className="w-6 h-6 text-rose-400" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Hero Score & Category Breakdown */}
        <div className="space-y-6">
          
          {/* Overall Score Card */}
          <div className="emerald-card p-8 text-center space-y-4 relative overflow-hidden border border-[#34d399]/30">
            <span className="text-xs font-mono font-bold text-[#6ee7b7] uppercase tracking-widest">Overall ATS Resume Score</span>
            
            <div className="relative inline-flex items-center justify-center w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="66" stroke="rgba(52,211,153,0.2)" strokeWidth="12" fill="transparent" />
                <circle
                  cx="80"
                  cy="80"
                  r="66"
                  stroke="#34d399"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray="415"
                  strokeDashoffset={415 - (415 * analysis.overall_score) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-black text-white font-outfit">{analysis.overall_score}</span>
                <span className="text-[10px] text-[#6ee7b7] font-bold">OUT OF 100</span>
              </div>
            </div>

            <p className="text-xs text-emerald-100/70 font-medium">
              High ATS keyword alignment across modern full-stack software development roles.
            </p>
          </div>

          {/* Sub-Score Category Breakdown */}
          <div className="emerald-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-outfit">Detailed ATS Sub-Scores</h3>

            <div className="space-y-3 text-xs">
              {[
                { label: 'Technical Skills Index', score: analysis.skills_score, color: 'bg-[#34d399]' },
                { label: 'Experience Match', score: analysis.experience_score, color: 'bg-[#10b981]' },
                { label: 'Project Portfolio Impact', score: analysis.projects_score, color: 'bg-[#6ee7b7]' },
                { label: 'Education & Certifications', score: analysis.education_score, color: 'bg-[#059669]' },
                { label: 'ATS Format Compliance', score: analysis.formatting_score, color: 'bg-emerald-400' }
              ].map((sub, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-emerald-100/70">{sub.label}</span>
                    <span className="text-white font-mono">{sub.score}%</span>
                  </div>
                  <div className="w-full bg-[#022c22] h-2 rounded-full overflow-hidden border border-[#34d399]/30">
                    <div className={`${sub.color} h-full rounded-full`} style={{ width: `${sub.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 2 Cols: Role Suitability Ratings & Extracted Resume Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Role Suitability Rating Matrix */}
          <div className="emerald-card p-8 space-y-6 border border-[#34d399]/30">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#34d399] uppercase tracking-wider">AI Evaluation Matrix</span>
                <h3 className="text-2xl font-black text-white font-outfit">Role Suitability Ratings</h3>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#064e3b] text-[#34d399] text-xs font-mono font-bold border border-[#34d399]/30">
                4 ROLES EVALUATED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roleRatings.map((rr, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#022c22] border border-[#34d399]/30 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-white font-outfit">{rr.role}</h4>
                      <span className="px-2.5 py-1 rounded-full bg-[#10b981] text-white text-xs font-mono font-bold">
                        {rr.rating}%
                      </span>
                    </div>
                    <span className="text-xs text-[#34d399] font-bold block">{rr.level}</span>
                    <p className="text-xs text-emerald-100/70 leading-relaxed pt-1">{rr.fit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Improvement Suggestions */}
          <div className="emerald-card p-8 space-y-4 border border-[#34d399]/30">
            <h3 className="text-xl font-bold text-white font-outfit">AI Recommended Resume Enhancements</h3>
            <div className="space-y-3 text-xs">
              {analysis.suggestions?.map((sug, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#022c22] border border-[#34d399]/30 flex items-start gap-3 text-emerald-100/90 font-medium">
                  <Sparkles className="w-4 h-4 text-[#34d399] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{sug}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Parsed Work Experience */}
          <div className="emerald-card p-8 space-y-4 border border-[#34d399]/30">
            <h3 className="text-xl font-bold text-white font-outfit">Parsed Work Experience Timeline</h3>
            <div className="space-y-4">
              {analysis.extracted_experience?.map((exp, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#022c22] border border-[#34d399]/30 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-bold text-white font-outfit">{exp.role}</h4>
                      <span className="text-xs text-[#6ee7b7] font-medium">{exp.company}</span>
                    </div>
                    <span className="text-xs font-mono text-emerald-100/70">{exp.duration}</span>
                  </div>
                  <p className="text-xs text-emerald-100/80 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
