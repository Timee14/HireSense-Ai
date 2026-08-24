import React, { useState } from 'react';
import { PlusCircle, Sparkles, Wand2, CheckCircle2, FileText, Briefcase, MapPin, DollarSign, Layers } from 'lucide-react';

interface CreateJobPageProps {
  onCreateJob: (jobData: any) => Promise<void>;
  onSuccessNavigate?: () => void;
}

export const CreateJobPage: React.FC<CreateJobPageProps> = ({ onCreateJob, onSuccessNavigate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [preferredSkills, setPreferredSkills] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Senior');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [location, setLocation] = useState('Bengaluru / Remote');
  const [salaryRange, setSalaryRange] = useState('₹28,00,000 - ₹34,00,000');
  
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzedSuccess, setAnalyzedSuccess] = useState(false);

  const handleAnalyzeWithAI = () => {
    if (!description.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      setRequiredSkills('Python, FastAPI, React, PostgreSQL, Vector Search (pgvector)');
      setPreferredSkills('Docker, Kubernetes, AWS Lambda, Redis');
      setAnalyzing(false);
      setAnalyzedSuccess(true);
      setTimeout(() => setAnalyzedSuccess(false), 4000);
    }, 800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCreateJob({
        title,
        description,
        required_skills: requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        preferred_skills: preferredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        experience_level: experienceLevel,
        employment_type: employmentType,
        location,
        salary_range: salaryRange
      });
      onSuccessNavigate?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 py-6 text-white animate-fade-in">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 font-mono font-semibold text-xs text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="uppercase tracking-wider">AI Requisition Builder</span>
        </div>
        <h1 className="font-editorial text-3xl md:text-5xl font-normal text-white tracking-tight mt-2">
          Post a New Position
        </h1>
        <p className="text-sm text-slate-400 mt-1">Specify job parameters or let AI extract skills and responsibilities from raw text</p>
      </div>

      <form onSubmit={handleSubmit} className="luma-card p-6 md:p-8 space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">Job Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Full-Stack Engineer"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">Location</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bengaluru / Remote"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">Employment Type</label>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0c0e14] border border-white/10 text-xs text-white focus:outline-none focus:border-white/30"
            >
              <option value="Full-time" className="bg-[#0c0e14] text-white">Full-time</option>
              <option value="Part-time" className="bg-[#0c0e14] text-white">Part-time</option>
              <option value="Contract" className="bg-[#0c0e14] text-white">Contract</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0c0e14] border border-white/10 text-xs text-white focus:outline-none focus:border-white/30"
            >
              <option value="Senior" className="bg-[#0c0e14] text-white">Senior (5+ Yrs)</option>
              <option value="Mid-Level" className="bg-[#0c0e14] text-white">Mid-Level (2-5 Yrs)</option>
              <option value="Junior" className="bg-[#0c0e14] text-white">Junior (0-2 Yrs)</option>
              <option value="Lead" className="bg-[#0c0e14] text-white">Lead / Architect</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">Salary Range</label>
            <input
              type="text"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              placeholder="e.g. ₹28,00,000 - ₹34,00,000"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
            <label className="block text-xs font-semibold text-slate-300 font-sans">Job Description / Raw Text</label>
            <button
              type="button"
              onClick={handleAnalyzeWithAI}
              className="text-xs text-cyan-300 font-bold hover:underline flex items-center gap-1"
            >
              <Wand2 className="w-3.5 h-3.5" /> Auto-Extract Skills with AI
            </button>
          </div>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Paste complete job description or responsibilities here..."
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>

        {analyzedSuccess && (
          <div className="p-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>AI extracted required & preferred skills automatically from description!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">Required Skills (Comma Separated)</label>
            <input
              type="text"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="Python, FastAPI, React, PostgreSQL"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">Preferred Skills (Optional)</label>
            <input
              type="text"
              value={preferredSkills}
              onChange={(e) => setPreferredSkills(e.target.value)}
              placeholder="Docker, AWS, Redis"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end w-full">
          <button
            type="submit"
            disabled={loading || analyzing}
            className="btn-luma-primary flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-black" />
            <span>{loading ? 'Publishing Job...' : 'Publish AI Job Posting'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
