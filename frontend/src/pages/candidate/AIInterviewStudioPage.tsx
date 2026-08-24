import React, { useState, useEffect, useRef } from 'react';
import {
  BrainCircuit, Mic, MicOff, Volume2, VolumeX, Sparkles, Clock, ArrowRight,
  ArrowLeft, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Bot, Award,
  BookOpen, RefreshCw, Zap, Shield, HelpCircle, FileText, Send, Play, Pause,
  TrendingUp, Target, UserCheck, Check, Sparkle, AlertTriangle, MessageSquare
} from 'lucide-react';
import { InterviewQuestion, InterviewAnswer, MultiAIEvaluation, Resume } from '../../types';
import { generateInterviewQuestions, evaluateInterviewAnswer, completeInterviewSession } from '../../api/client';

interface AIInterviewStudioPageProps {
  resume?: Resume | null;
  onNavigate?: (tab: string) => void;
}

const PRESET_ROLES = [
  {
    title: "Software Engineer",
    summary: "Role Summary: We are looking for a Software Engineer to join our diverse and dedicated team. You will develop scalable microservices, optimize database queries, write automated tests, and collaborate with product teams on high-impact features.",
    skills: ["Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "Docker", "REST APIs", "Git"]
  },
  {
    title: "Product Manager",
    summary: "Role Summary: Seeking an analytical Product Manager to drive product strategy, define roadmaps using RICE prioritization, lead customer discovery interviews, and collaborate across engineering and design.",
    skills: ["Product Strategy", "RICE Scoring", "User Research", "Agile", "A/B Testing", "Roadmapping"]
  },
  {
    title: "Data Analyst",
    summary: "Role Summary: Looking for a Data Analyst to build executive dashboards, perform exploratory data analysis, run statistical hypothesis tests, and derive actionable business intelligence from complex telemetry data.",
    skills: ["SQL", "Python", "Pandas", "Tableau", "A/B Testing", "Statistical Modeling", "Data Cleaning"]
  },
  {
    title: "Business Analyst",
    summary: "Role Summary: Bridge business stakeholders and technical teams by capturing detailed user requirements, creating functional workflows, and tracking KPI metrics to enhance operational efficiency.",
    skills: ["Requirements Gathering", "Process Modeling", "BPMN", "Stakeholder Communication", "KPI Dashboards"]
  },
  {
    title: "UX/UI Designer",
    summary: "Role Summary: Craft intuitive, accessible user interfaces and design systems. Conduct usability testing, create interactive prototypes in Figma, and partner closely with frontend engineers.",
    skills: ["Figma", "Design Systems", "User Research", "Wireframing", "Accessibility (WCAG)", "Prototyping"]
  },
  {
    title: "QA Engineer",
    summary: "Role Summary: Ensure product quality through automated test frameworks, regression suites, API integration tests, and performance load testing in CI/CD release pipelines.",
    skills: ["Cypress", "Selenium", "Pytest", "API Testing", "CI/CD Gates", "Regression Testing"]
  },
  {
    title: "Human Resources Specialist",
    summary: "Role Summary: Drive talent acquisition, candidate screening, structured interviewing, onboarding pipelines, and employee engagement initiatives.",
    skills: ["Talent Sourcing", "Behavioral Interviewing", "HRIS", "Onboarding", "Employee Relations"]
  },
  {
    title: "Custom Job Description",
    summary: "Paste or customize your exact target job description here to generate tailored behavioral, technical, and system design interview questions.",
    skills: ["Custom Skill 1", "Custom Skill 2", "Custom Skill 3"]
  }
];

export const AIInterviewStudioPage: React.FC<AIInterviewStudioPageProps> = ({ resume, onNavigate }) => {
  // Navigation & Step State
  const [step, setStep] = useState<'role_select' | 'live_interview' | 'review_report'>('role_select');

  // Role Selection State
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number>(0);
  const [customTitle, setCustomTitle] = useState<string>(PRESET_ROLES[0].title);
  const [jobDescription, setJobDescription] = useState<string>(PRESET_ROLES[0].summary);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Interview Questions & Progress State
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [id: string]: string }>({});
  const [evaluations, setEvaluations] = useState<{ [id: string]: MultiAIEvaluation }>({});
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Timer State (2:00 per question)
  const [timeRemaining, setTimeRemaining] = useState<number>(120);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Voice & Inactivity Detection State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState<boolean>(false);
  const [inactivityTimer, setInactivityTimer] = useState<number>(0);
  const [showInactivityPrompt, setShowInactivityPrompt] = useState<boolean>(false);
  const [inactivityCount, setInactivityCount] = useState<number>(0);
  const [sampleResponseOpen, setSampleResponseOpen] = useState<boolean>(false);
  const [activeModelTab, setActiveModelTab] = useState<'chatgpt' | 'claude' | 'gemini'>('chatgpt');

  // Speech Recognition Ref
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            const currentQId = questions[currentIndex]?.id;
            if (currentQId) {
              setAnswers(prev => {
                const existing = prev[currentQId] || '';
                // Append or update smoothly
                return { ...prev, [currentQId]: (existing ? existing + ' ' : '') + currentTranscript.trim() };
              });
            }
            // Reset inactivity whenever candidate speaks!
            setInactivityTimer(0);
            setShowInactivityPrompt(false);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [currentIndex, questions]);

  // Main countdown timer & 30-Second Inactivity Detector
  useEffect(() => {
    let interval: any = null;
    if (step === 'live_interview' && timerActive) {
      interval = setInterval(() => {
        // Countdown timer
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });

        // Inactivity counter
        setInactivityTimer(prev => {
          const newTime = prev + 1;
          // Trigger nudge at 30 seconds of inactivity
          if (newTime === 30) {
            triggerInactivityPrompt();
          }
          // Auto advance if silence persists for 60 seconds
          if (newTime >= 60) {
            handleInactivityAutoAdvance();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timerActive, currentIndex, inactivityCount]);

  const triggerInactivityPrompt = () => {
    setShowInactivityPrompt(true);
    setInactivityCount(prev => prev + 1);
    // Voice prompt encouraging the user
    if (synthRef.current && !synthRef.current.speaking) {
      const utterance = new SpeechSynthesisUtterance("Take your time! Whenever you are ready, share your thoughts or provide an example.");
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      synthRef.current.speak(utterance);
    }
  };

  const handleInactivityAutoAdvance = () => {
    setShowInactivityPrompt(false);
    if (currentIndex < questions.length - 1) {
      handleNextQuestion();
    } else {
      handleFinishInterview();
    }
  };

  const handleTimeUp = () => {
    setTimerActive(false);
    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsRecording(false);
    }
  };

  const handleRoleSelect = (index: number) => {
    setSelectedRoleIndex(index);
    const role = PRESET_ROLES[index];
    setCustomTitle(role.title);
    setJobDescription(role.summary);
  };

  const handleStartInterview = async () => {
    setIsGenerating(true);
    try {
      const skills = resume?.analysis?.extracted_skills || PRESET_ROLES[selectedRoleIndex]?.skills || [];
      const res = await generateInterviewQuestions(customTitle, jobDescription, skills);
      if (res && res.questions && res.questions.length > 0) {
        setQuestions(res.questions);
        setCurrentIndex(0);
        setAnswers({});
        setEvaluations({});
        setTimeRemaining(120);
        setInactivityTimer(0);
        setShowInactivityPrompt(false);
        setStep('live_interview');
        setTimerActive(true);
        // Automatically speak first question after brief moment
        speakQuestionText(res.questions[0].question);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const speakQuestionText = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeakingQuestion(true);
    utterance.onend = () => setIsSpeakingQuestion(false);
    utterance.onerror = () => setIsSpeakingQuestion(false);
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeakingQuestion(false);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        setInactivityTimer(0);
        setShowInactivityPrompt(false);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleTextChange = (text: string) => {
    const currentQId = questions[currentIndex]?.id;
    if (currentQId) {
      setAnswers(prev => ({ ...prev, [currentQId]: text }));
      setInactivityTimer(0);
      setShowInactivityPrompt(false);
    }
  };

  const handleEvaluateCurrentAnswer = async () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    const currentAns = answers[currentQ.id] || '';
    setIsEvaluating(true);
    try {
      const evaluation = await evaluateInterviewAnswer(currentQ.question, currentAns, customTitle);
      setEvaluations(prev => ({ ...prev, [currentQ.id]: evaluation }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    stopSpeaking();
    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsRecording(false);
    }

    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setTimeRemaining(120);
      setInactivityTimer(0);
      setShowInactivityPrompt(false);
      setSampleResponseOpen(false);
      setTimerActive(true);
      speakQuestionText(questions[nextIdx].question);
    } else {
      handleFinishInterview();
    }
  };

  const handlePreviousQuestion = () => {
    stopSpeaking();
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setTimeRemaining(120);
      setInactivityTimer(0);
      setShowInactivityPrompt(false);
      setSampleResponseOpen(false);
      speakQuestionText(questions[prevIdx].question);
    }
  };

  const handleFinishInterview = async () => {
    stopSpeaking();
    setTimerActive(false);
    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsRecording(false);
    }

    // Auto evaluate any questions that were answered but not yet evaluated
    const evaluatedAnswers: InterviewAnswer[] = [];
    let totalScore = 0;
    let count = 0;

    for (const q of questions) {
      const ansText = answers[q.id] || '';
      let evalData = evaluations[q.id];
      if (!evalData && ansText.trim()) {
        try {
          evalData = await evaluateInterviewAnswer(q.question, ansText, customTitle);
        } catch (e) {}
      }
      if (evalData) {
        totalScore += evalData.overall_score;
        count++;
      }
      evaluatedAnswers.push({
        question_id: q.id,
        question_text: q.question,
        user_answer: ansText,
        audio_duration_seconds: 120 - timeRemaining,
        skipped: !ansText.trim(),
        evaluation: evalData
      });
    }

    const avgScore = count > 0 ? Math.round(totalScore / count) : 75;

    // Save session in backend
    try {
      await completeInterviewSession({
        role_title: customTitle,
        job_description: jobDescription,
        total_questions: questions.length,
        average_score: avgScore,
        top_strengths: ["Clear Communication", "Logical Structuring", "Relevant Past Experience"],
        priority_upskill_areas: ["Quantifying Measurable Results (STAR)", "System Design Edge Cases", "Architecture Trade-offs"],
        answers: evaluatedAnswers
      });
    } catch (e) {
      console.error(e);
    }

    setStep('review_report');
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate Average Score for Report
  const calculateAggregateScore = () => {
    const evalValues = Object.values(evaluations);
    if (evalValues.length === 0) return 82;
    const sum = evalValues.reduce((acc, curr) => acc + curr.overall_score, 0);
    return Math.round(sum / evalValues.length);
  };

  const currentQ = questions[currentIndex];
  const currentAnswer = currentQ ? (answers[currentQ.id] || '') : '';
  const currentEval = currentQ ? evaluations[currentQ.id] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans text-slate-100">
      
      {/* Studio Header & Hero Section */}
      <div className="luma-card p-6 sm:p-8 mb-8 border border-white/15 bg-gradient-to-r from-[#12141d]/90 via-[#0e1018]/90 to-[#12141d]/90 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center shadow-xl shrink-0 text-cyan-300">
              <BrainCircuit className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-slate-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider font-mono">
                  AI Mock Studio
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-[10px] sm:text-xs font-mono">
                  Multi-AI Evaluator (ChatGPT • Claude • Gemini)
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1 font-sans">
                AI Interview Practice & Upskilling Studio
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm md:text-base mt-1 max-w-2xl">
                Simulate realistic job interviews with live speech-to-text, 30s inactivity auto-guidance, STAR framework sample responses, and multi-model feedback.
              </p>
            </div>
          </div>

          {/* Stepper Pill Status */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shrink-0 self-stretch sm:self-auto overflow-x-auto">
            <button
              onClick={() => setStep('role_select')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                step === 'role_select'
                  ? 'bg-[#10b981] text-slate-950 font-bold shadow-md shadow-[#10b981]/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Setup Role
            </button>
            <button
              disabled={questions.length === 0}
              onClick={() => setStep('live_interview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                step === 'live_interview'
                  ? 'bg-[#10b981] text-slate-950 font-bold shadow-md shadow-[#10b981]/20'
                  : questions.length > 0 ? 'text-slate-400 hover:text-white' : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              2. Live Interview
            </button>
            <button
              disabled={step !== 'review_report'}
              onClick={() => setStep('review_report')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                step === 'review_report'
                  ? 'bg-[#10b981] text-slate-950 font-bold shadow-md shadow-[#10b981]/20'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              3. Upskill Review
            </button>
          </div>
        </div>
      </div>


      {/* ========================================================================= */}
      {/* STEP 1: ROLE & JOB DESCRIPTION SELECTION */}
      {/* ========================================================================= */}
      {step === 'role_select' && (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
              Select a target role or job description
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Choose a role below to simulate questions or paste a custom description for targeted prep.
            </p>
          </div>

          {/* Role Chips Selector */}
          <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
            {PRESET_ROLES.map((role, idx) => {
              const isSelected = selectedRoleIndex === idx;
              return (
                <button
                  key={role.title}
                  onClick={() => handleRoleSelect(idx)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border ${
                    isSelected
                      ? 'bg-[#10b981]/20 border-[#34d399] text-[#6ee7b7] shadow-lg shadow-[#10b981]/20 scale-105 font-bold'
                      : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  {role.title}
                </button>
              );
            })}
          </div>

          {/* Job Details Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#34d399] font-mono mb-2">
                Target Job Title
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl px-4 py-3 text-white text-base focus:outline-none focus:border-[#34d399] focus:ring-1 focus:ring-[#34d399] transition-colors"
                placeholder="e.g. Senior Full-Stack Engineer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#34d399] font-mono">
                  Role Summary & Job Description
                </label>
                <span className="text-xs text-slate-500 font-mono">
                  {3000 - jobDescription.length} chars left
                </span>
              </div>
              <textarea
                rows={5}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl p-4 text-slate-200 text-sm focus:outline-none focus:border-[#34d399] focus:ring-1 focus:ring-[#34d399] transition-colors leading-relaxed"
                placeholder="Paste responsibilities and requirements..."
              />
            </div>

            {/* Resume Integration Banner */}
            <div className="bg-[#042f26]/60 border border-[#34d399]/30 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#10b981]/20 border border-[#34d399]/40 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#34d399]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {resume ? `Tailored with Resume: ${resume.file_name}` : 'Upload your resume for improved, tailored feedback!'}
                  </h4>
                  <p className="text-xs text-slate-300">
                    {resume ? 'Questions will specifically target your highlighted skills & gap areas.' : 'HireSense AI personalizes question difficulty based on your extracted background.'}
                  </p>
                </div>
              </div>
              {onNavigate && !resume && (
                <button
                  onClick={() => onNavigate('resume_analyzer')}
                  className="px-3.5 py-1.5 bg-[#10b981]/20 hover:bg-[#10b981]/30 border border-[#34d399]/40 text-[#6ee7b7] text-xs font-bold rounded-xl transition-colors shrink-0"
                >
                  Upload Resume
                </button>
              )}
            </div>

            {/* Start Button */}
            <div className="pt-2 flex justify-center">
              <button
                disabled={isGenerating || !customTitle.trim()}
                onClick={handleStartInterview}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-slate-950 font-bold text-base shadow-xl shadow-[#10b981]/25 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating Dynamic AI Questions...
                  </>
                ) : (
                  <>
                    Generate Questions & Start Interview
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: LIVE INTERACTIVE INTERVIEW (Matching reference layout) */}
      {/* ========================================================================= */}
      {step === 'live_interview' && currentQ && (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
          
          {/* Navigation Bar */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setStep('role_select')}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Question Generation
            </button>

            {/* Question Counter Pill */}
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 shadow-md">
              <button
                disabled={currentIndex === 0}
                onClick={handlePreviousQuestion}
                className="text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold"
              >
                &larr;
              </button>
              <span className="text-xs sm:text-sm font-bold text-white font-mono">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <button
                disabled={currentIndex === questions.length - 1}
                onClick={handleNextQuestion}
                className="text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold"
              >
                &rarr;
              </button>
            </div>

            <button
              onClick={handleFinishInterview}
              className="px-4 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-colors"
            >
              End & Review
            </button>
          </div>

          {/* Inactivity Alert Notification Banner (30-Sec Inactivity Handler) */}
          {showInactivityPrompt && (
            <div className="bg-amber-500/15 border border-amber-500/40 rounded-2xl p-4 flex items-start sm:items-center justify-between gap-4 animate-bounce-short shadow-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
                <div>
                  <h4 className="text-sm font-bold text-amber-200">
                    Need a moment? Take your time!
                  </h4>
                  <p className="text-xs text-amber-300/80">
                    We noticed silence for 30s. Speak when ready, type your answer, or skip to the next question.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowInactivityPrompt(false)}
                  className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold rounded-lg transition-colors"
                >
                  I'm Ready
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-colors"
                >
                  Skip Question
                </button>
              </div>
            </div>
          )}

          {/* Main Question Card (Clean white/glass aesthetic matching reference) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
            
            {/* Category & Voice Speaker */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#10b981]/20 border border-[#34d399]/40 text-[#6ee7b7] text-xs font-mono font-bold uppercase tracking-wider">
                {currentQ.category.replace('_', ' ')} • {currentQ.difficulty}
              </span>
              <button
                onClick={() => isSpeakingQuestion ? stopSpeaking() : speakQuestionText(currentQ.question)}
                className={`p-2.5 rounded-2xl border transition-all flex items-center gap-2 text-xs font-medium ${
                  isSpeakingQuestion
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Speak Question"
              >
                {isSpeakingQuestion ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#34d399]" />}
                <span>{isSpeakingQuestion ? 'Stop Audio' : 'Play Voice'}</span>
              </button>
            </div>

            {/* Question Text */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white text-center leading-snug font-outfit px-2 sm:px-6">
              {currentQ.question}
            </h2>

            {/* Countdown / Elapsed Timer */}
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-mono font-black tracking-tight text-slate-400">
                {formatTime(120 - timeRemaining)} <span className="text-slate-600">/ 2:00</span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-1">
                {timeRemaining > 0 ? `${timeRemaining}s remaining` : 'Time limit reached'}
              </p>
            </div>

            {/* Microphone Centerpiece Action Button */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                {isRecording && (
                  <div className="absolute inset-0 rounded-full bg-rose-500/30 animate-ping" />
                )}
                <button
                  onClick={toggleRecording}
                  disabled={!speechSupported}
                  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 relative z-10 ${
                    isRecording
                      ? 'bg-rose-600 text-white scale-110 shadow-rose-600/50'
                      : 'bg-rose-500 hover:bg-rose-600 text-white hover:scale-105 shadow-rose-500/30'
                  }`}
                  title={isRecording ? 'Click to pause recording' : 'Click to start speaking'}
                >
                  {isRecording ? (
                    <Mic className="w-9 h-9 animate-pulse" />
                  ) : (
                    <Mic className="w-9 h-9" />
                  )}
                </button>
              </div>

              {/* Status or Recording Label */}
              <div className="text-center">
                <span className="text-xs sm:text-sm font-medium text-slate-400">
                  {isRecording ? (
                    <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      Listening to your voice... Speak naturally
                    </span>
                  ) : (
                    'Click microphone to record your answer'
                  )}
                </span>
              </div>
            </div>

            {/* Text Answer Box (Transcribed / Typed) */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Your Answer ({currentAnswer.trim().split(/\s+/).filter(Boolean).length} words)
                </label>
                <button
                  onClick={() => handleTextChange('')}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Clear Text
                </button>
              </div>
              <textarea
                rows={4}
                value={currentAnswer}
                onChange={(e) => handleTextChange(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-700 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-[#34d399] focus:ring-1 focus:ring-[#34d399] transition-colors leading-relaxed placeholder-slate-600"
                placeholder="Or type your answer directly here... Words spoken via microphone will also appear in real-time."
              />
            </div>

            {/* Sample Response Accordion (ChatGPT / Claude / Gemini STAR Breakdown) */}
            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
              <button
                onClick={() => setSampleResponseOpen(!sampleResponseOpen)}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-[#34d399]" />
                  <span className="text-sm font-bold text-slate-200">
                    Sample STAR Response & AI Benchmarks
                  </span>
                </div>
                {sampleResponseOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {sampleResponseOpen && currentQ.sample_response && (
                <div className="p-5 border-t border-slate-800 space-y-4 text-sm animate-fadeIn">
                  
                  {/* STAR Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 font-mono block">
                        Situation
                      </span>
                      <p className="text-xs text-slate-300 mt-1">
                        {currentQ.sample_response.star_situation}
                      </p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono block">
                        Task
                      </span>
                      <p className="text-xs text-slate-300 mt-1">
                        {currentQ.sample_response.star_task}
                      </p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono block">
                        Action
                      </span>
                      <p className="text-xs text-slate-300 mt-1">
                        {currentQ.sample_response.star_action}
                      </p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono block">
                        Result
                      </span>
                      <p className="text-xs text-slate-300 mt-1">
                        {currentQ.sample_response.star_result}
                      </p>
                    </div>
                  </div>

                  {/* Multi-AI Perspective Tips */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#34d399] font-mono">
                      Multi-AI Platform Tips
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      <div className="bg-purple-950/30 border border-purple-800/40 p-3 rounded-xl">
                        <span className="text-[11px] font-bold text-purple-300 block mb-1">
                          🟢 OpenAI ChatGPT Tip
                        </span>
                        <p className="text-xs text-purple-200/80 leading-relaxed">
                          {currentQ.sample_response.chatgpt_tip}
                        </p>
                      </div>
                      <div className="bg-amber-950/30 border border-amber-800/40 p-3 rounded-xl">
                        <span className="text-[11px] font-bold text-amber-300 block mb-1">
                          🟠 Anthropic Claude Tip
                        </span>
                        <p className="text-xs text-amber-200/80 leading-relaxed">
                          {currentQ.sample_response.claude_tip}
                        </p>
                      </div>
                      <div className="bg-emerald-950/30 border border-emerald-800/40 p-3 rounded-xl">
                        <span className="text-[11px] font-bold text-emerald-300 block mb-1">
                          ✨ HireSense Gemini Tip
                        </span>
                        <p className="text-xs text-emerald-200/80 leading-relaxed">
                          {currentQ.sample_response.gemini_tip}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Real-time Multi-AI Evaluation Card if computed */}
            {currentEval && (
              <div className="bg-slate-950 border border-[#34d399]/40 rounded-2xl p-5 space-y-4 animate-fadeIn shadow-xl">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#34d399]" />
                    <span className="font-bold text-white text-base">
                      Multi-AI Evaluation for this Question
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono">Overall Score:</span>
                    <span className="px-3 py-0.5 rounded-full bg-[#10b981]/20 border border-[#34d399]/50 text-[#34d399] font-bold text-sm font-mono">
                      {currentEval.overall_score}/100
                    </span>
                  </div>
                </div>

                {/* Perspective Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <button
                    onClick={() => setActiveModelTab('chatgpt')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      activeModelTab === 'chatgpt'
                        ? 'bg-purple-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ChatGPT Analysis
                  </button>
                  <button
                    onClick={() => setActiveModelTab('claude')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      activeModelTab === 'claude'
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Claude Analysis
                  </button>
                  <button
                    onClick={() => setActiveModelTab('gemini')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      activeModelTab === 'gemini'
                        ? 'bg-[#10b981] text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    HireSense Gemini
                  </button>
                </div>

                {/* Perspective Details */}
                {activeModelTab === 'chatgpt' && (
                  <div className="space-y-3 text-xs">
                    <p className="text-slate-300">{currentEval.chatgpt_review.summary}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                        <span className="font-bold text-emerald-400 block mb-1">Key Strengths:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                          {currentEval.chatgpt_review.strengths.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                        <span className="font-bold text-amber-400 block mb-1">To Improve:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                          {currentEval.chatgpt_review.improvements.map((imp, idx) => (
                            <li key={idx}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeModelTab === 'claude' && (
                  <div className="space-y-3 text-xs">
                    <p className="text-slate-300">{currentEval.claude_review.summary}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                        <span className="font-bold text-emerald-400 block mb-1">Technical Depth:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                          {currentEval.claude_review.strengths.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                        <span className="font-bold text-amber-400 block mb-1">System Considerations:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                          {currentEval.claude_review.improvements.map((imp, idx) => (
                            <li key={idx}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeModelTab === 'gemini' && (
                  <div className="space-y-3 text-xs">
                    <p className="text-slate-300">{currentEval.gemini_review.summary}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-slate-400 font-bold mr-1">Matched Keywords:</span>
                      {currentEval.gemini_review.matched_skills.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-md border border-emerald-500/30">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <span className="font-bold text-[#34d399] block mb-1">Upskilling Advice:</span>
                      <p className="text-slate-300">{currentEval.gemini_review.upskill_action}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Action Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <button
                disabled={isEvaluating || !currentAnswer.trim()}
                onClick={handleEvaluateCurrentAnswer}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analyzing with Multi-AI...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-indigo-400" />
                    Get Instant Multi-AI Feedback
                  </>
                )}
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleNextQuestion}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#10b981]/20 transition-all hover:scale-105"
                >
                  {currentIndex === questions.length - 1 ? 'Finish & View Report' : 'Next Question'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: COMPREHENSIVE MULTI-AI REVIEW & UPSKILLING ROADMAP */}
      {/* ========================================================================= */}
      {step === 'review_report' && (
        <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
          
          {/* Hero Score Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-[#042f26] to-slate-900 border border-[#34d399]/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#10b981]/20 border border-[#34d399]/40 text-[#6ee7b7] text-xs font-mono font-bold uppercase tracking-wider">
                  Session Completed • {customTitle}
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 font-outfit">
                  Multi-AI Interview Performance & Upskill Plan
                </h2>
                <p className="text-slate-300 text-sm sm:text-base mt-1 max-w-xl">
                  Here is the holistic assessment of your answers evaluated across OpenAI ChatGPT, Claude 3.5, and HireSense Gemini.
                </p>
              </div>

              {/* Big Score Radial Badge */}
              <div className="bg-slate-950/80 border border-[#34d399]/40 rounded-3xl p-6 flex flex-col items-center justify-center shadow-xl shrink-0">
                <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Readiness Score</span>
                <div className="text-5xl font-extrabold text-[#34d399] font-outfit mt-1">
                  {calculateAggregateScore()}<span className="text-2xl text-slate-500 font-normal">/100</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 mt-1">
                  {calculateAggregateScore() >= 85 ? '🌟 Interview Ready' : calculateAggregateScore() >= 70 ? '👍 Solid Fundamentals' : '📈 Needs Targeted Practice'}
                </span>
              </div>
            </div>

            {/* Score Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 font-mono block">Clarity & Tone</span>
                <span className="text-2xl font-bold text-sky-400 font-outfit mt-1 block">88%</span>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 font-mono block">Technical Depth</span>
                <span className="text-2xl font-bold text-emerald-400 font-outfit mt-1 block">84%</span>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 font-mono block">STAR Structure</span>
                <span className="text-2xl font-bold text-purple-400 font-outfit mt-1 block">86%</span>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 font-mono block">Role Relevance</span>
                <span className="text-2xl font-bold text-amber-400 font-outfit mt-1 block">92%</span>
              </div>
            </div>
          </div>

          {/* Upskilling Action Plan Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-outfit">
                  Personalized Upskilling Action Plan
                </h3>
                <p className="text-xs text-slate-400">
                  Targeted learning modules and practice goals to achieve top 5% candidate percentile.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                    High Priority
                  </span>
                  <Target className="w-4 h-4 text-rose-400" />
                </div>
                <h4 className="text-base font-bold text-white">
                  Quantify End-to-End Metrics in STAR
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Always conclude your answers with 1-2 quantified metrics (e.g. latency reduced by 70%, 10 hrs saved/week, or zero customer downtime).
                </p>
                <div className="pt-2">
                  <span className="text-[11px] text-[#34d399] font-bold block">
                    Action Step: Add metric placeholders to all behavioral stories.
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                    Medium Priority
                  </span>
                  <BrainCircuit className="w-4 h-4 text-amber-400" />
                </div>
                <h4 className="text-base font-bold text-white">
                  Architectural Trade-offs Discussion
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When answering technical questions, proactively explain why you chose one approach over an alternative to demonstrate architectural depth.
                </p>
                <div className="pt-2">
                  <span className="text-[11px] text-[#34d399] font-bold block">
                    Action Step: Practice stating 'We chose X over Y because...'.
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                    Low Priority
                  </span>
                  <Mic className="w-4 h-4 text-sky-400" />
                </div>
                <h4 className="text-base font-bold text-white">
                  Structured Pausing & Vocal Fluency
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Take a deliberate 3-second pause to structure your response into 3 key bullet points before speaking to avoid filler words.
                </p>
                <div className="pt-2">
                  <span className="text-[11px] text-[#34d399] font-bold block">
                    Action Step: Practice with the 30s timer in mock studio.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Breakdown Accordion */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-white font-outfit">
              Question-by-Question Breakdown
            </h3>

            <div className="space-y-4">
              {questions.map((q, idx) => {
                const ans = answers[q.id] || '';
                const ev = evaluations[q.id];
                return (
                  <div key={q.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#34d399] font-bold">
                          Question {idx + 1} • {q.category}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-white">
                          {q.question}
                        </h4>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#10b981]/20 border border-[#34d399]/40 text-[#6ee7b7] text-xs font-mono font-bold shrink-0">
                        Score: {ev ? ev.overall_score : 85}/100
                      </span>
                    </div>

                    <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <span className="text-slate-500 font-bold block mb-1">Your Answer:</span>
                      {ans.trim() ? ans : <span className="italic text-slate-500">Skipped or no text entered.</span>}
                    </div>

                    {ev && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                        <div className="bg-purple-950/20 border border-purple-800/30 p-3 rounded-xl">
                          <span className="font-bold text-purple-300 block mb-1">ChatGPT Verdict:</span>
                          <p className="text-slate-300">{ev.chatgpt_review.summary}</p>
                        </div>
                        <div className="bg-emerald-950/20 border border-emerald-800/30 p-3 rounded-xl">
                          <span className="font-bold text-emerald-300 block mb-1">HireSense Gemini Verdict:</span>
                          <p className="text-slate-300">{ev.gemini_review.upskill_action}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Navigation CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <button
              onClick={() => {
                setStep('role_select');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Practice Another Role
            </button>

            {onNavigate && (
              <button
                onClick={() => onNavigate('candidate_dash')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#10b981] hover:bg-[#059669] text-slate-950 font-bold text-sm shadow-xl shadow-[#10b981]/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                Back to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
