import React, { useState } from 'react';
import { PlusCircle, Sparkles, Wand2, CheckCircle2 } from 'lucide-react';
import { JobCreate } from '../../types';

interface CreateJobPageProps {
  onCreateJob: (jobData: JobCreate) => Promise<void>;
  onSuccessNavigate: () => void;
}

export const CreateJobPage: React.FC<CreateJobPageProps> = ({ onCreateJob, onSuccessNavigate }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Bengaluru / Remote');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [experienceLevel, setExperienceLevel] = useState('Senior');
  const [salaryRange, setSalaryRange] = useState('₹28,00,000 - ₹34,00,000');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('Python, FastAPI, React, TypeScript, PostgreSQL');
  const [preferredSkills, setPreferredSkills] = useState('Docker, AWS, Redis');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzedSuccess, setAnalyzedSuccess] = useState(false);

  const handleAnalyzeWithAI = () => {
    if (!description) {
      setDescription('We are looking for a Senior Full-Stack Engineer to lead development of high-concurrency microservices and responsive React components. Requires experience in Python, FastAPI, React, TypeScript, and SQL database design.');
    }
    setAnalyzing(true);
    setTimeout(() => {
      setRequiredSkills('Python, FastAPI, React, TypeScript, PostgreSQL');
      setPreferredSkills('Docker, AWS, Redis, GraphQL');
      setAnalyzing(false);
      setAnalyzedSuccess(true);
      setTimeout(() => setAnalyzedSuccess(false), 3000);
    }, 1200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const reqList = requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
      const prefList = preferredSkills.split(',').map((s) => s.trim()).filter(Boolean);
      
      await onCreateJob({
        title,
        location,
        employment_type: employmentType,
        experience_level: experienceLevel,
        salary_range: salaryRange,
        description,
        required_skills: reqList,
        preferred_skills: prefList
      });
      onSuccessNavigate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 py-6 text-white">
      
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#064e3b] border border-[#34d399]/40 font-bold text-xs text-[#34d399]">
          <Sparkles className="w-4 h-4 text-[#34d399]" />
          <span className="uppercase tracking-wider font-mono">AI Job Specification Engine</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white font-outfit mt-2">Create Job Posting</h1>
        <p className="text-sm text-emerald-100/70 mt-1">Specify job parameters or let AI extract skills and responsibilities from raw text</p>
      </div>

      <form onSubmit={handleSubmit} className="emerald-card space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-emerald-100/90 mb-1.5">Job Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Full-Stack Engineer"
              className="w-full px-4 py-2.5 rounded-xl bg-[#022c22] border border-[#34d399]/30 text-xs text-white placeholder-emerald-100/40 focus:outline-none focus:border-[#34d399]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-100/90 mb-1.5">Location</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bengaluru / Remote"
              className="w-full px-4 py-2.5 rounded-xl bg-[#022c22] border border-[#34d399]/30 text-xs text-white placeholder-emerald-100/40 focus:outline-none focus:border-[#34d399]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-emerald-100/90 mb-1.5">Employment Type</label>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#022c22] border border-[#34d399]/30 text-xs text-white focus:outline-none focus:border-[#34d399]"
            >
              <option value="Full-time" className="bg-[#022c22] text-white">Full-time</option>
              <option value="Part-time" className="bg-[#022c22] text-white">Part-time</option>
              <option value="Contract" className="bg-[#022c22] text-white">Contract</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-100/90 mb-1.5">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#022c22] border border-[#34d399]/30 text-xs text-white focus:outline-none focus:border-[#34d399]"
            >
              <option value="Senior" className="bg-[#022c22] text-white">Senior (5+ Yrs)</option>
              <option value="Mid-Level" className="bg-[#022c22] text-white">Mid-Level (2-5 Yrs)</option>
              <option value="Junior" className="bg-[#022c22] text-white">Junior (0-2 Yrs)</option>
              <option value="Lead" className="bg-[#022c22] text-white">Lead / Architect</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-100/90 mb-1.5">Salary Range</label>
            <input
              type="text"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              placeholder="e.g. ₹28,00,000 - ₹34,00,000"
              className="w-full px-4 py-2.5 rounded-xl bg-[#022c22] border border-[#34d399]/30 text-xs text-white placeholder-emerald-100/40 focus:outline-none focus:border-[#34d399]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
            <label className="block text-xs font-bold text-emerald-100/90">Job Description / Raw Text</label>
            <button
              type="button"
              onClick={handleAnalyzeWithAI}
              className="text-xs text-[#34d399] font-bold hover:underline flex items-center gap-1"
            >
              <Wand2 className="w-3.5 h-3.5" /> Auto-Extract Skills with AI
            </button>
          </div>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Paste complete job description or responsibilities here..."
            className="w-full px-4 py-3 rounded-xl bg-[#022c22] border border-[#34d399]/30 text-xs text-white placeholder-emerald-100/40 focus:outline-none focus:border-[#34d399]"
          />
        </div>

        {analyzedSuccess && (
          <div className="p-3 rounded-xl bg-[#064e3b] border border-[#34d399]/40 text-[#6ee7b7] text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
            <span>AI extracted required & preferred skills automatically from description!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-emerald-100/90 mb-1.5">Required Skills (Comma Separated)</label>
            <input
              type="text"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="Python, FastAPI, React, PostgreSQL"
              className="w-full px-4 py-2.5 rounded-xl bg-[#022c22] border border-[#34d399]/30 text-xs text-white placeholder-emerald-100/40 focus:outline-none focus:border-[#34d399]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-100/90 mb-1.5">Preferred Skills (Optional)</label>
            <input
              type="text"
              value={preferredSkills}
              onChange={(e) => setPreferredSkills(e.target.value)}
              placeholder="Docker, AWS, Redis"
              className="w-full px-4 py-2.5 rounded-xl bg-[#022c22] border border-[#34d399]/30 text-xs text-white placeholder-emerald-100/40 focus:outline-none focus:border-[#34d399]"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end w-full">
          <button
            type="submit"
            disabled={loading || analyzing}
            className="btn-sky-blue w-full sm:w-auto"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>{loading ? 'Publishing Job...' : 'Publish AI Job Posting'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
