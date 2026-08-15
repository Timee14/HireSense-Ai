import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './pages/LandingPage';
import { AuthModal } from './pages/AuthModal';
import { CandidateDashboard } from './pages/candidate/CandidateDashboard';
import { ResumeAnalyzerPage } from './pages/candidate/ResumeAnalyzerPage';
import { JobRecommendationsPage } from './pages/candidate/JobRecommendationsPage';
import { ApplicationsPage } from './pages/candidate/ApplicationsPage';
import { SkillGapsPage } from './pages/candidate/SkillGapsPage';
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { CreateJobPage } from './pages/recruiter/CreateJobPage';
import { CandidateScreeningPage } from './pages/recruiter/CandidateScreeningPage';
import { RecruiterAnalyticsPage } from './pages/recruiter/RecruiterAnalyticsPage';
import { MatchRadarModal } from './components/ui/MatchRadarModal';
import { apiRequest, uploadFile, getToken, setToken, removeToken } from './api/client';
import { User, CandidateProfile, RecruiterProfile, Resume, Job, JobRecommendation, Application, RecruiterAnalytics, JobCreate } from './types';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedMatchRec, setSelectedMatchRec] = useState<JobRecommendation | null>(null);

  // Candidate Data State
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);
  const [resume, setResume] = useState<Resume | null>(null);
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [candidateApplications, setCandidateApplications] = useState<Application[]>([]);

  // Recruiter Data State
  const [recruiterProfile, setRecruiterProfile] = useState<RecruiterProfile | null>(null);
  const [recruiterJobs, setRecruiterJobs] = useState<Job[]>([]);
  const [recruiterAnalytics, setRecruiterAnalytics] = useState<RecruiterAnalytics | null>(null);
  const [allApplicants, setAllApplicants] = useState<Application[]>([]);

  // Load User Data on mount or token change
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchCurrentUser();
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const u = await apiRequest<User>('/auth/me');
      setUser(u);
      if (u.role === 'candidate') {
        setActiveTab('candidate_dash');
        loadCandidateData();
      } else {
        setActiveTab('recruiter_dash');
        loadRecruiterData();
      }
    } catch (err) {
      removeToken();
      setUser(null);
    }
  };

  const loadCandidateData = async () => {
    try {
      const prof = await apiRequest<CandidateProfile>('/candidates/me');
      setCandidateProfile(prof);
      
      const r = await apiRequest<Resume>('/resumes/me').catch(() => null);
      setResume(r);

      const recs = await apiRequest<JobRecommendation[]>('/candidates/me/recommendations').catch(() => []);
      setRecommendations(recs);

      const apps = await apiRequest<Application[]>('/applications/candidate/my-applications').catch(() => []);
      setCandidateApplications(apps);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRecruiterData = async () => {
    try {
      const jobs = await apiRequest<Job[]>('/jobs/recruiter/my-jobs').catch(() => []);
      setRecruiterJobs(jobs);

      const analytics = await apiRequest<RecruiterAnalytics>('/analytics/recruiter').catch(() => null);
      setRecruiterAnalytics(analytics);

      if (jobs.length > 0) {
        const apps = await apiRequest<Application[]>(`/applications/job/${jobs[0].id}`).catch(() => []);
        setAllApplicants(apps);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Auth Callbacks
  const handleLogin = async (email: string, pass: string) => {
    const res = await apiRequest<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass })
    });
    setToken(res.access_token);
    const u: User = { id: res.user_id, email: res.email, role: res.role, name: res.name };
    setUser(u);
    if (res.role === 'candidate') {
      setActiveTab('candidate_dash');
      loadCandidateData();
    } else {
      setActiveTab('recruiter_dash');
      loadRecruiterData();
    }
  };

  const handleRegister = async (email: string, pass: string, role: 'candidate' | 'recruiter', name: string) => {
    const res = await apiRequest<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password: pass,
        role,
        full_name: role === 'candidate' ? name : undefined,
        company_name: role === 'recruiter' ? name : undefined
      })
    });
    setToken(res.access_token);
    const u: User = { id: res.user_id, email: res.email, role: res.role, name: res.name };
    setUser(u);
    if (role === 'candidate') {
      setActiveTab('candidate_dash');
      loadCandidateData();
    } else {
      setActiveTab('recruiter_dash');
      loadRecruiterData();
    }
  };

  const handleQuickDemo = async (role: 'candidate' | 'recruiter') => {
    const email = role === 'candidate' ? 'alex.dev@example.com' : 'recruiter@techinnovations.com';
    await handleLogin(email, 'password123');
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
    setActiveTab('landing');
  };

  const handleUploadResume = async (file: File) => {
    if (!getToken()) {
      await handleQuickDemo('candidate');
    }
    const uploaded = await uploadFile<Resume>('/resumes/upload', file);
    if (uploaded) {
      setResume(uploaded);
    }
    await loadCandidateData();
  };

  const handleApplyJob = async (jobId: string) => {
    await apiRequest<any>('/applications', {
      method: 'POST',
      body: JSON.stringify({ job_id: jobId })
    });
    await loadCandidateData();
  };

  const handleCreateJob = async (jobData: JobCreate) => {
    await apiRequest<any>('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
    await loadRecruiterData();
  };

  const handleUpdateApplicationStatus = async (appId: string, status: string) => {
    await apiRequest<any>(`/applications/${appId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    await loadRecruiterData();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Navigation Bar */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        
        {/* Landing View */}
        {activeTab === 'landing' && (
          <LandingPage onSelectRoleDemo={handleQuickDemo} />
        )}

        {/* Candidate Views */}
        {user?.role === 'candidate' && (
          <>
            {activeTab === 'candidate_dash' && (
              <CandidateDashboard
                profile={candidateProfile}
                resume={resume}
                recommendations={recommendations}
                onNavigate={setActiveTab}
                onApply={handleApplyJob}
              />
            )}

            {activeTab === 'resume_analyzer' && (
              <ResumeAnalyzerPage
                resume={resume}
                onUploadResume={handleUploadResume}
              />
            )}

            {activeTab === 'job_recs' && (
              <JobRecommendationsPage
                recommendations={recommendations}
                onApply={handleApplyJob}
                onOpenMatchModal={setSelectedMatchRec}
              />
            )}

            {activeTab === 'applications' && (
              <ApplicationsPage applications={candidateApplications} />
            )}

            {activeTab === 'skill_gaps' && (
              <SkillGapsPage />
            )}
          </>
        )}

        {/* Recruiter Views */}
        {user?.role === 'recruiter' && (
          <>
            {activeTab === 'recruiter_dash' && (
              <RecruiterDashboard
                profile={recruiterProfile}
                analytics={recruiterAnalytics}
                jobs={recruiterJobs}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'create_job' && (
              <CreateJobPage
                onCreateJob={handleCreateJob}
                onSuccessNavigate={() => setActiveTab('recruiter_dash')}
              />
            )}

            {activeTab === 'screening' && (
              <CandidateScreeningPage
                jobs={recruiterJobs}
                applicants={allApplicants}
                onUpdateStatus={handleUpdateApplicationStatus}
                onOpenMatchModal={setSelectedMatchRec}
              />
            )}

            {activeTab === 'analytics' && (
              <RecruiterAnalyticsPage analytics={recruiterAnalytics} />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-outfit font-bold text-slate-300">HireSense AI — Autonomous Precision Hiring Platform</span>
          <span className="text-[11px] text-slate-400 font-mono">FastAPI • React 18 • TypeScript • Tailwind CSS • pgvector</span>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onQuickDemo={handleQuickDemo}
      />

      {/* Match Radar Modal */}
      <MatchRadarModal
        rec={selectedMatchRec}
        onClose={() => setSelectedMatchRec(null)}
      />

    </div>
  );
};
