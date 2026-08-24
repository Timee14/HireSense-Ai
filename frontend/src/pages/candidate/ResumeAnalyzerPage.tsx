import React, { useState } from 'react';
import {
  Upload, CheckCircle2, AlertCircle, Sparkles, Cpu, Check, FileText,
  Award, Briefcase, FileCheck, ArrowRight, Layers, Eye, EyeOff, Send,
  AlertTriangle, TrendingUp, Zap, HelpCircle, ShieldAlert, Target, BookOpen, Clock, ArrowUpRight
} from 'lucide-react';
import { Resume, JobRecommendation } from '../../types';
import { DEFAULT_RESUME } from '../../api/client';

interface ResumeAnalyzerPageProps {
  resume: Resume | null;
  recommendations?: JobRecommendation[];
  onUploadResume: (file: File) => Promise<any>;
  onApply?: (jobId: string) => void;
  onNavigate?: (tab: string) => void;
}

export const ResumeAnalyzerPage: React.FC<ResumeAnalyzerPageProps> = ({
  resume,
  recommendations = [],
  onUploadResume,
  onApply,
  onNavigate
}) => {
  const [activeResume, setActiveResume] = useState<Resume>(resume || (DEFAULT_RESUME as any));
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showRawText, setShowRawText] = useState(false);
  const [activeFixTab, setActiveFixTab] = useState<string | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<Record<string, boolean>>({});
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (resume && resume.analysis) {
      setActiveResume(resume);
    }
  }, [resume]);

  const processFile = async (file: File) => {
    setUploading(true);
    setUploadError('');
    setUploadSuccess(false);
    try {
      const result = await onUploadResume(file);
      if (result && result.analysis) {
        setActiveResume(result);
      }
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 5000);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Failed to upload and parse resume file. Please ensure the file is a valid PDF or DOCX.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleApplyClick = async (jobId: string) => {
    if (onApply) {
      onApply(jobId);
      setAppliedJobIds(prev => ({ ...prev, [jobId]: true }));
    }
  };

  const currentResume = activeResume || resume || (DEFAULT_RESUME as any);
  const analysis = currentResume?.analysis || DEFAULT_RESUME.analysis;

  const score = analysis.overall_score || 87;
  const scoreTier = analysis.score_tier || (score >= 80 ? "Elite Candidate" : score >= 65 ? "Competitive Match" : score >= 40 ? "Developing Potential" : "Needs Significant Work");
  const careerLevel = analysis.career_level || "Senior Full-Stack Engineer (4+ yrs)";
  const recruiterChecks = analysis.recruiter_checks || DEFAULT_RESUME.analysis.recruiter_checks;
  const scoreRoadmap = analysis.score_boost_roadmap || DEFAULT_RESUME.analysis.score_boost_roadmap;
  const roleRatings = analysis.role_ratings || DEFAULT_RESUME.analysis.role_ratings;
  const extractedSkills = analysis.extracted_skills || DEFAULT_RESUME.analysis.extracted_skills;

  // Score Color Mapping (Sleek Luma icy blue / gold / rose)
  const getScoreColor = (val: number) => {
    if (val >= 80) return { stroke: '#38bdf8', text: 'text-cyan-300', bg: 'bg-white/[0.04]', border: 'border-white/20' };
    if (val >= 65) return { stroke: '#60a5fa', text: 'text-blue-300', bg: 'bg-white/[0.04]', border: 'border-white/15' };
    if (val >= 40) return { stroke: '#f59e0b', text: 'text-amber-400', bg: 'bg-white/[0.04]', border: 'border-white/15' };
    return { stroke: '#f43f5e', text: 'text-rose-400', bg: 'bg-white/[0.04]', border: 'border-white/15' };
  };

  const scoreStyle = getScoreColor(score);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 text-white animate-fade-in">
      
      {/* Hero Header Card with Dynamic Benchmark & Prominent Upload Dropzone */}
      <div className="luma-card p-8 md:p-10 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border border-white/15 bg-gradient-to-br from-[#131620]/90 via-[#0d0f16]/90 to-[#0a0c12]/95">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-slate-300 font-mono font-semibold text-xs">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>ATS Screening & Rubric Calibration</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 border border-white/10 text-xs font-mono">
              Level: {careerLevel}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-editorial font-normal text-white tracking-tight">
            Resume Intelligence Breakdown
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-normal leading-relaxed">
            Benchmarked against 1M+ resumes, real recruiter screening rubrics, and ATS parse algorithms (Quantified Impact, Action Verbs, and Seniority Depth).
          </p>

          {currentResume && (
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-lg bg-white/10 text-white text-xs font-mono font-bold shadow-md border border-white/15">
                ACTIVE FILE: {currentResume.file_name || 'Alex_Chen_Resume.pdf'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Parsed: {currentResume.uploaded_at || 'Recently'} • {currentResume.status?.toUpperCase() || 'COMPLETE'}
              </span>
              {currentResume.raw_text && (
                <button
                  onClick={() => setShowRawText(!showRawText)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors"
                >
                  {showRawText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showRawText ? 'Hide Text Stream' : 'View Text Stream'}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Upload & Re-Score Button / Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer border p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-4 shadow-xl transition-all w-full md:w-auto shrink-0 text-white group ${
            isDragging
              ? 'border-cyan-400 bg-cyan-500/10 scale-105 shadow-cyan-500/20'
              : 'border-white/20 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/40'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white group-hover:scale-105 transition-transform shrink-0">
            <Upload className={`w-6 h-6 ${uploading ? 'animate-spin text-cyan-300' : 'text-white'}`} />
          </div>
          <div className="text-center sm:text-left">
            <span className="block text-base font-bold text-white font-sans">
              {uploading ? 'Analyzing Resume Stream...' : isDragging ? 'Drop Resume PDF Here' : 'Re-Score / Upload Resume'}
            </span>
            <span className="block text-xs text-slate-400 font-mono font-normal">
              Click or drag .pdf, .docx, .doc, .txt
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </div>
      </div>

      {uploadSuccess && (
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white text-sm font-bold flex items-center gap-3 shadow-xl backdrop-blur-xl">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>Resume successfully scanned & calibrated! ATS score, recruiter checks, and role suitability have been recalculated.</span>
        </div>
      )}

      {uploadError && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-sm font-bold flex items-center gap-3 shadow-xl backdrop-blur-xl">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Raw Extracted Text Viewer (Collapsible) */}
      {showRawText && resume?.raw_text && (
        <div className="luma-card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-sans uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Extracted Plaintext Stream (PyMuPDF)</span>
            </h3>
            <button onClick={() => setShowRawText(false)} className="text-xs text-slate-400 hover:text-white">
              Close
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-black/60 text-slate-300 font-mono text-xs max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-white/10">
            {resume.raw_text}
          </pre>
        </div>
      )}

      {/* Primary Score & Benchmark Comparison Banner */}
      <div className={`luma-card p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl`}>
        
        {/* Score Ring */}
        <div className="relative inline-flex items-center justify-center w-36 h-36 shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="72" cy="72" r="58" stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="transparent" />
            <circle
              cx="72"
              cy="72"
              r="58"
              stroke={scoreStyle.stroke}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray="364"
              strokeDashoffset={364 - (364 * score) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-black text-white font-outfit">{score}</span>
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">OVERALL</span>
          </div>
        </div>

        {/* Score Context & Feedback */}
        <div className="space-y-3 flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-sans">
              Your resume scored {score} out of 100.
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase font-mono border border-white/20 bg-white/10 text-white`}>
              {scoreTier}
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            {score < 45 ? (
              <>It seems like your resume scored poorly on key checks that hiring managers and ATS screening software scan for (such as <strong>quantified metrics</strong>, <strong>full-time work tenure</strong>, and <strong>power action verbs</strong>). With the simple fixes below, you can raise your score by <strong>+40 points</strong>.</>
            ) : score < 70 ? (
              <>Your resume has strong fundamentals with solid skill coverage, but lacks deep measurable business outcomes and experience depth. Follow the action items below to become a top-tier applicant.</>
            ) : (
              <>Your resume is well-structured with high technical keyword density, strong action verbs, and quantifiable impact across target roles.</>
            )}
          </p>

          {/* Benchmark Slider Bar */}
          <div className="pt-2 max-w-xl">
            <div className="flex justify-between text-xs font-medium font-mono text-slate-400 mb-1.5">
              <span>0 (Needs Work)</span>
              <span className="text-white font-bold">YOUR SCORE: {score}</span>
              <span className="text-slate-300">85+ (Top 5%)</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden relative">
              <div
                className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-blue-500 to-cyan-400"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Top Fixes & Recruiter Checks */}
      <div className="luma-card p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Top Recruiter Checks & Fixes</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-sans mt-1">Key Issues Identified on Your Resume</h3>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-mono font-bold border border-white/15 w-fit">
            {recruiterChecks.filter(c => c.status !== 'passed').length} ACTIONABLE FIXES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recruiterChecks.map((check, idx) => {
            const isPassed = check.status === 'passed';
            const isCritical = check.status === 'critical';
            return (
              <div
                key={idx}
                onClick={() => setActiveFixTab(activeFixTab === check.id ? null : check.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  isPassed
                    ? 'bg-white/[0.035] border-white/10 hover:border-white/25'
                    : isCritical
                    ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50'
                    : 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {isPassed ? (
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                    ) : isCritical ? (
                      <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    )}
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">{check.category}</span>
                      <h4 className="text-base font-bold text-white font-sans">{check.title}</h4>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${
                    isPassed ? 'bg-white/10 text-white border-white/15' : isCritical ? 'bg-rose-900/40 text-rose-300 border-rose-500/30' : 'bg-amber-900/40 text-amber-300 border-amber-500/30'
                  }`}>
                    {isPassed ? 'PASSED' : `${check.issue_count} ISSUES`}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {check.summary}
                </p>

                {/* Expanded Fix Recommendation */}
                <div className="mt-3 pt-3 border-t border-white/10 flex items-start gap-2 text-xs font-medium text-slate-200">
                  <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Fix:</strong> {check.fix}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed ATS Sub-Scores & Role Suitability Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: 5 Core ATS Sub-Scores */}
        <div className="space-y-6">
          <div className="luma-card p-6 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>5 Core ATS Dimensions</span>
            </h3>

            <div className="space-y-4 text-xs">
              {[
                { label: 'Impact & Quantified Outcomes', score: analysis.impact_score || 15, desc: 'Presence of metrics, %, and business scale' },
                { label: 'Professional Experience Depth', score: analysis.experience_score || 20, desc: 'Verified company tenure vs college projects' },
                { label: 'Technical Skills Breadth', score: analysis.skills_score || 85, desc: 'Core languages, frameworks & developer tools' },
                { label: 'Action Verbs & Style Strength', score: analysis.action_verb_score || 25, desc: 'Punchy action verbs vs passive language' },
                { label: 'ATS Format & Structure Compliance', score: analysis.formatting_score || 75, desc: 'Section headers, contact info & length' }
              ].map((sub, idx) => {
                const subColor = sub.score >= 70 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' : sub.score >= 45 ? 'bg-amber-400' : 'bg-rose-500';
                return (
                  <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-white text-xs">{sub.label}</span>
                      <span className={`font-mono text-xs text-white`}>
                        {sub.score}%
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div className={`${subColor} h-full rounded-full transition-all duration-700`} style={{ width: `${sub.score}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400">{sub.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* +40 Points Score Boost Roadmap */}
          <div className="luma-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">How to Gain +40 Points</h3>
            </div>

            <div className="space-y-3 text-xs">
              {scoreRoadmap.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                  <span className="px-2 py-1 rounded-md bg-white/10 text-white font-mono font-bold text-[10px] shrink-0 border border-white/15">
                    {item.points}
                  </span>
                  <div>
                    <h5 className="font-bold text-white text-xs">{item.action}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 2 Cols: Seniority-Calibrated Role Ratings & Recommended Jobs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Role Suitability Rating Matrix */}
          <div className="luma-card p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">AI Evaluation Matrix</span>
                <h3 className="text-2xl font-bold text-white font-sans">Role Suitability & Seniority Alignment</h3>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-mono font-bold border border-white/15 w-fit">
                {roleRatings.length} ROLES EVALUATED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roleRatings.map((rr: any, idx: number) => {
                const isLow = rr.rating < 40;
                const isMid = rr.rating >= 40 && rr.rating < 70;
                return (
                  <div key={idx} className={`p-5 rounded-2xl border space-y-2 flex flex-col justify-between transition-all ${
                    isLow ? 'bg-slate-900/50 border-white/5' : isMid ? 'bg-white/[0.03] border-white/10 hover:border-white/20' : 'bg-white/[0.05] border-white/15 hover:border-white/30'
                  }`}>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-base font-bold text-white font-sans">{rr.role}</h4>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                          isLow ? 'bg-slate-800 text-slate-400 border border-slate-700' : isMid ? 'bg-amber-900/40 text-amber-300 border border-amber-500/30' : 'bg-white/10 text-white border border-white/20'
                        }`}>
                          {rr.rating}%
                        </span>
                      </div>
                      <span className={`text-xs font-bold block ${isLow ? 'text-rose-400' : isMid ? 'text-amber-300' : 'text-cyan-300'}`}>
                        {rr.match_level || rr.level || 'Strong Fit'}
                      </span>
                      <p className="text-xs text-slate-400 leading-relaxed pt-1">{rr.key_fit || rr.fit}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Extracted Skills Cloud */}
          <div className="luma-card p-6 md:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Semantic NLP Detection</span>
                <h3 className="text-xl font-bold text-white font-sans">Identified Technical Competencies</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-mono font-bold border border-white/15 w-fit">
                {extractedSkills.length} SKILLS FOUND
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {extractedSkills.map((sk, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-slate-200 font-medium text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{sk}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Best-Fit Open Positions */}
          {recommendations.length > 0 && (
            <div className="luma-card p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Automated Candidate-Job Match</span>
                  <h3 className="text-2xl font-bold text-white font-sans">Best-Fit Open Positions</h3>
                </div>
                {onNavigate && (
                  <button onClick={() => onNavigate('job_recs')} className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1">
                    <span>View All Jobs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {recommendations.slice(0, 3).map((rec, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.035] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition-all">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-mono font-bold border border-white/15">
                          {rec.match_details.overall_score}% MATCH
                        </span>
                        <h4 className="text-base font-bold text-white font-sans">{rec.job.title}</h4>
                      </div>
                      <p className="text-xs text-slate-400">
                        {rec.job.company_name} • {rec.job.location} • {rec.job.experience_level}
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                        {rec.match_details.ai_explanation}
                      </p>
                    </div>

                    <button
                      onClick={() => handleApplyClick(rec.job.id)}
                      disabled={appliedJobIds[rec.job.id]}
                      className={`btn-luma-primary text-xs px-5 py-2.5 shrink-0 ${appliedJobIds[rec.job.id] ? 'opacity-70 !bg-slate-300' : ''}`}
                    >
                      {appliedJobIds[rec.job.id] ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-black" />
                          <span>Applied</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-black" />
                          <span>1-Click Apply</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
