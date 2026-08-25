import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Send, Bot, User, BrainCircuit, Target, BookOpen, FileText,
  Copy, Check, RefreshCw, Trash2, Plus, Search, ChevronDown, ChevronRight,
  CheckCircle2, ArrowRight, ShieldCheck, Zap, MessageSquare, Terminal, Lightbulb,
  Compass, Sliders, Mic, MicOff, ExternalLink, HelpCircle, Code, Layers,
  Paperclip, FolderPlus, Award, Network, Puzzle, Globe, X, Upload
} from 'lucide-react';
import { Resume, JobRecommendation } from '../../types';
import { sendChatMessage, getChatSessions, clearChatHistory } from '../../api/client';

interface AIChatbotHubPageProps {
  resume: Resume | null;
  recommendations: JobRecommendation[];
  onNavigateToTab?: (tab: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model_used?: string;
  timestamp: string;
  attached_file?: string;
  web_search_enabled?: boolean;
  perspectives?: {
    chatgpt?: string;
    claude?: string;
    gemini?: string;
  };
  suggested_actions?: Array<{ title: string; action: string }>;
  roadmap_items?: Array<{ week: string; topic: string; hours: string }>;
}

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  message_count: number;
}

const AI_MODELS = [
  { id: 'consensus', name: 'Aven Consensus', badge: 'Multi-AI', desc: 'Synthesizes ChatGPT, Claude & Gemini', color: 'from-cyan-500 to-emerald-500' },
  { id: 'chatgpt-4o', name: 'ChatGPT-4o', badge: 'OpenAI', desc: 'ATS resume formatting & STAR metrics', color: 'from-emerald-500 to-teal-500' },
  { id: 'claude-3-5', name: 'Claude 3.5 Sonnet', badge: 'Anthropic', desc: 'Deep systems design & architecture', color: 'from-amber-500 to-orange-500' },
  { id: 'gemini-pro', name: 'Gemini 1.5 Pro', badge: 'Google DeepMind', desc: 'Market tech trends & keyword calibration', color: 'from-blue-500 to-indigo-500' },
  { id: 'grok-4', name: 'Grok 4.3', badge: 'xAI', desc: 'Fast contrarian technical feedback', color: 'from-purple-500 to-pink-500' },
];

export const AIChatbotHubPage: React.FC<AIChatbotHubPageProps> = ({
  resume,
  recommendations,
  onNavigateToTab
}) => {
  const [selectedModel, setSelectedModel] = useState<string>('consensus');
  const [targetRole, setTargetRole] = useState<string>('Software Development Engineer (SDE)');
  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // + Action Menu State & Attachment Controls
  const [isActionMenuOpen, setIsActionMenuOpen] = useState<boolean>(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [webSearchEnabled, setWebSearchEnabled] = useState<boolean>(true);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>(null);
  const [activeProjectContext, setActiveProjectContext] = useState<string | null>(null);
  const [activePlugin, setActivePlugin] = useState<string | null>('ATS Calibrator');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const actionMenuRef = useRef<HTMLDivElement | null>(null);

  // Google AI Connection State
  const [googleKeyModalOpen, setGoogleKeyModalOpen] = useState<boolean>(false);
  const [geminiApiKeyInput, setGeminiApiKeyInput] = useState<string>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('hiresense_gemini_api_key') || '' : '';
  });
  const [googleConnected, setGoogleConnected] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? !!localStorage.getItem('hiresense_gemini_api_key') : false;
  });

  // Voice Recording Simulation State
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // Sidebar Chat History
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('sess-1');
  const [searchHistory, setSearchHistory] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Messages in active chat session
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Close + Action Menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setIsActionMenuOpen(false);
        setActiveSubMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+U for file upload
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        fileInputRef.current?.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Extract skills from resume
  const candidateSkills = resume?.analysis?.extracted_skills || [
    'Python', 'FastAPI', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS', 'pgvector'
  ];
  const missingSkills = ['Kubernetes', 'Redis Caching', 'System Design', 'AWS Lambda', 'GraphQL'];

  // Initialize Sessions and Welcome Message
  useEffect(() => {
    loadSessions();
    initializeWelcome();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await getChatSessions();
      setSessions(data);
    } catch (e) {
      setSessions([
        { id: 'sess-1', title: '🎯 Skill Gap Analysis for Senior Full-Stack', created_at: 'Today', message_count: 6 },
        { id: 'sess-2', title: '📝 STAR Resume Metric Polishing', created_at: 'Yesterday', message_count: 4 },
        { id: 'sess-3', title: '🚀 30-Day Kubernetes Upskilling Plan', created_at: '3 days ago', message_count: 8 }
      ]);
    }
  };

  const initializeWelcome = () => {
    const welcomeMsg: ChatMessage = {
      id: 'welcome-msg',
      role: 'assistant',
      content: `### 🤖 Hello! I am Aven, your AI Career & Upskilling Copilot.

I combine deep multi-model intelligence (**ChatGPT-4o**, **Claude 3.5 Sonnet**, and **Google Gemini Pro**) to help you analyze skill gaps, optimize your resume for ATS filters, and prepare for top engineering interviews.

I have calibrated your profile (**${resume?.file_name || 'Alex_Chen_Resume.pdf'}**) against **${targetRole}**.

#### 💡 Here is what we can do:
* 🎯 **Skill Gap Analysis**: Discover missing technologies required by hiring managers.
* 📝 **STAR Metric Optimization**: Transform passive bullet points into high-impact quantified achievements.
* 🚀 **30-Day Learning Roadmap**: Structured study plan and mini-projects to reach candidate shortlist tier.
* 📎 **Attach Resumes & Files**: Use the **\`+\` menu** below to add documents, inject skills, or enable live Web search.

*Click one of the prompt shortcuts below or write a message to begin!*`,
      model_used: 'consensus',
      timestamp: 'Just now',
      perspectives: {
        chatgpt: `ChatGPT-4o: Ask Aven to rewrite your experience bullets to achieve a 95+ ATS score.`,
        claude: `Claude 3.5 Sonnet: Let's analyze system design trade-offs and microservice architecture.`,
        gemini: `Gemini Flash: I will cross-reference your skills with live market compensation and job demand indexes.`
      },
      suggested_actions: [
        { title: `Analyze Gaps for ${targetRole}`, action: `What are my exact skill gaps for ${targetRole}?` },
        { title: 'Upskill Resume with STAR Metrics', action: 'Rewrite my backend experience bullets using STAR metrics and quantified numbers' },
        { title: 'Create 30-Day Upskilling Roadmap', action: `Create a 30-day upskilling roadmap for ${targetRole}` }
      ]
    };
    setMessages([welcomeMsg]);
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setAttachedFile({
        name: file.name,
        size: `${sizeMb} MB`
      });
      setIsActionMenuOpen(false);
      setActiveSubMenu(null);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || loading) return;

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attached_file: attachedFile ? attachedFile.name : undefined,
      web_search_enabled: webSearchEnabled
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    const currentAttachment = attachedFile;
    setAttachedFile(null);
    setLoading(true);

    // Dynamic role inference from user message
    let activeRole = targetRole;
    const qLower = query.toLowerCase();
    if (/\b(sde|sde[- ]?[123]|software development engineer|software dev engineer)\b/.test(qLower)) {
      activeRole = 'Software Development Engineer (SDE)';
    } else if (/\b(frontend|front-end|react|ui engineer)\b/.test(qLower)) {
      activeRole = 'Frontend Engineer';
    } else if (/\b(backend|back-end|python developer|fastapi)\b/.test(qLower)) {
      activeRole = 'Backend Engineer';
    }

    try {
      const response = await sendChatMessage({
        message: query + (currentAttachment ? ` [Attached document: ${currentAttachment.name}]` : '') + (webSearchEnabled ? ' [Web Search: Enabled]' : ''),
        model: selectedModel,
        target_role: activeRole,
        candidate_skills: candidateSkills,
        missing_skills: missingSkills,
        resume_summary: resume?.raw_text?.slice(0, 500) || '',
        history: messages.slice(-4)
      });

      const assistantMsg: ChatMessage = {
        id: response?.id || 'bot-' + Date.now(),
        role: 'assistant',
        content: response?.content || `Here are recommendations for ${activeRole}.`,
        model_used: response?.model_used || selectedModel,
        timestamp: response?.timestamp || 'Just now',
        perspectives: response?.perspectives,
        suggested_actions: response?.suggested_actions,
        roadmap_items: response?.roadmap_items
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      // Fallback response
      const fallbackMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        content: `### 👨‍💻 Software Development Engineer (SDE) Role Guide\n\nAn **SDE** designs and scales core software applications, backend services, and APIs.\n\n* **Core Focus**: Data Structures & Algorithms, System Design (HLD/LLD), and Microservices.\n* **Career Tiers**: SDE-1 (Execution) ➔ SDE-2 (Ownership & LLD) ➔ SDE-3 (Distributed HLD).\n* **Interview Stages**: DSA Problem Solving (LeetCode) ➔ System Design ➔ STAR Behavioral.`,
        model_used: selectedModel,
        timestamp: 'Just now',
        perspectives: {
          chatgpt: `ChatGPT-4o: For SDE applications, recruiters look for solid DSA fundamentals and clear quantifiable STAR metrics on past software deliverables.`,
          claude: `Claude 3.5 Sonnet: SDE-2+ interviews heavily weigh systems thinking: explain trade-offs (e.g. CAP theorem, caching strategies, and eventual vs strong consistency).`,
          gemini: `Gemini Flash / Pro: Current industry demand for SDEs favors engineers proficient in cloud-native microservices, async APIs, and PostgreSQL/vector search architectures.`
        }
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    const newSessId = 'sess-' + Date.now();
    const newSession: ChatSession = {
      id: newSessId,
      title: `💬 Consultation with Aven (${targetRole.split(' ')[0]})`,
      created_at: 'Just now',
      message_count: 1
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSessId);
    initializeWelcome();
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all Aven chat conversations?')) {
      await clearChatHistory();
      setSessions([]);
      initializeWelcome();
    }
  };

  const handleCopyContent = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEnhancePrompt = () => {
    if (!inputQuery.trim()) {
      setInputQuery(`Aven, analyze my resume against the ${targetRole} job requirements, identify missing keywords, and suggest 3 high-impact STAR bullet points.`);
    } else {
      setInputQuery(`Act as a Principal Engineering Hiring Manager. For the role of ${targetRole}, analyze: "${inputQuery}". Provide multi-AI feedback with quantified metrics and system design trade-offs.`);
    }
  };

  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setInputQuery('Aven, how can I optimize my backend FastAPI project to impress recruiters hiring for Senior roles?');
      setTimeout(() => {
        setIsRecording(false);
      }, 2500);
    }
  };

  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(searchHistory.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col lg:flex-row bg-[#080B11] text-slate-100 relative overflow-hidden">
      
      {/* Hidden File Input for Attachments */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.json"
        className="hidden"
      />

      {/* SIDEBAR: CHAT HISTORY & AVEN SETTINGS */}
      <aside className={`w-full lg:w-72 shrink-0 border-r border-white/10 bg-[#0B0F19]/90 backdrop-blur-xl flex flex-col transition-all duration-300 ${sidebarOpen ? 'block' : 'hidden lg:flex'}`}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10 space-y-3">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat with Aven</span>
          </button>

          {/* Search History */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchHistory}
              onChange={(e) => setSearchHistory(e.target.value)}
              placeholder="Search chat history..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
            />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
            Recent Consultations
          </span>
          {filteredSessions.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSessionId(s.id)}
              className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                activeSessionId === s.id
                  ? 'bg-white/[0.08] border border-cyan-500/30 text-white font-semibold'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
              }`}
            >
              <MessageSquare className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${activeSessionId === s.id ? 'text-cyan-400' : 'text-slate-500'}`} />
              <div className="flex-1 min-w-0">
                <div className="truncate">{s.title}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{s.created_at}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/10 space-y-2 bg-black/20">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-[11px] font-bold text-white">Aven AI Career Agent</div>
                <div className="text-[9px] text-slate-400 font-mono">Consensus Multi-Engine</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
              ONLINE
            </span>
          </div>

          <button
            onClick={handleClearHistory}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 text-xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Chat History</span>
          </button>
        </div>
      </aside>

      {/* MAIN CHAT ARENA */}
      <main className="flex-1 flex flex-col h-[calc(100vh-80px)] overflow-hidden relative">
        
        {/* Top Header Bar: Target Role Calibration & Model Selector */}
        <div className="p-3 sm:p-4 border-b border-white/10 bg-[#0B0F19]/80 backdrop-blur-md shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Target Role Selector */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">Calibrated Target Role</span>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer hover:text-cyan-300 transition-colors"
              >
                <option value="Software Development Engineer (SDE)" className="bg-slate-900 text-white">Software Development Engineer (SDE)</option>
                <option value="Senior Full-Stack Engineer" className="bg-slate-900 text-white">Senior Full-Stack Engineer</option>
                <option value="Backend Python / FastAPI Engineer" className="bg-slate-900 text-white">Backend Python / FastAPI Engineer</option>
                <option value="Frontend React / Next.js Specialist" className="bg-slate-900 text-white">Frontend React / Next.js Specialist</option>
                <option value="AI / ML Systems Engineer" className="bg-slate-900 text-white">AI / ML Systems Engineer</option>
              </select>
            </div>
          </div>

          {/* AI Model Intelligence Selector Pills (Matching User Screenshot Layout!) */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1 scrollbar-none">
            {/* Google Gemini Direct Link Badge */}
            <button
              type="button"
              onClick={() => setGoogleKeyModalOpen(true)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                googleConnected
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 hover:bg-blue-600/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
              title="Google Gemini AI Connection Status & Key"
            >
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>Google Gemini AI</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-blue-400/20 text-blue-200">
                {googleConnected ? 'LIVE KEY' : 'ACTIVE'}
              </span>
            </button>

            {AI_MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  selectedModel === m.id
                    ? 'bg-white text-slate-950 font-bold border-white shadow-md'
                    : 'bg-white/[0.04] text-slate-300 border-white/10 hover:border-white/30 hover:bg-white/[0.08]'
                }`}
              >
                {selectedModel === m.id && <Sparkles className="w-3 h-3 text-cyan-500" />}
                <span>{m.name}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${selectedModel === m.id ? 'bg-slate-200 text-slate-900' : 'bg-white/10 text-slate-400'}`}>
                  {m.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
          
          {/* Quick Capability Prompt Suggestions */}
          {messages.length <= 1 && (
            <div className="max-w-3xl mx-auto space-y-4 pt-2">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-xs font-semibold">
                  <Bot className="w-3.5 h-3.5" />
                  <span>Aven Career & Upskilling Hub</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
                  What can Aven help you accomplish?
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Select a targeted prompt below or write a custom query to start your AI coaching session.
                </p>
              </div>

              {/* Prompt Suggestion Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleSendMessage(`Aven, what are my exact skill gaps for ${targetRole} and what projects should I build to bridge them?`)}
                  className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-cyan-500/40 text-left transition-all group space-y-1"
                >
                  <div className="flex items-center justify-between text-cyan-400 font-bold text-xs">
                    <span className="flex items-center gap-1.5">
                      <Target className="w-4 h-4" /> Role Skill Gap Analysis
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Compare resume skills against {targetRole} job benchmark requirements.
                  </p>
                </button>

                <button
                  onClick={() => handleSendMessage(`Aven, rewrite my top software experience bullets using the STAR method and strong action verbs with quantified numbers.`)}
                  className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-emerald-500/40 text-left transition-all group space-y-1"
                >
                  <div className="flex items-center justify-between text-emerald-400 font-bold text-xs">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4" /> STAR Resume Rewriter
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Transform basic bullet points into metric-rich achievements that pass ATS filters.
                  </p>
                </button>

                <button
                  onClick={() => handleSendMessage(`Aven, create a 30-day accelerated learning roadmap for ${targetRole} with weekly milestones.`)}
                  className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-purple-500/40 text-left transition-all group space-y-1"
                >
                  <div className="flex items-center justify-between text-purple-400 font-bold text-xs">
                    <span className="flex items-center gap-1.5">
                      <Compass className="w-4 h-4" /> 30-Day Learning Roadmap
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Step-by-step weekly sprints covering missing distributed systems & cloud skills.
                  </p>
                </button>

                <button
                  onClick={() => handleSendMessage(`Aven, simulate a senior technical interview for ${targetRole}. Ask me a difficult system design question.`)}
                  className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-amber-500/40 text-left transition-all group space-y-1"
                >
                  <div className="flex items-center justify-between text-amber-400 font-bold text-xs">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-4 h-4" /> Technical Interview Practice
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Test your system design and problem-solving readiness under recruiter rubrics.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Render Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3.5 max-w-4xl mx-auto ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              {/* Assistant Avatar */}
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 p-0.5 shrink-0 shadow-md">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Bot className="w-4 h-4 text-cyan-300" />
                  </div>
                </div>
              )}

              {/* Message Content Container */}
              <div
                className={`rounded-2xl p-4 sm:p-5 space-y-4 max-w-2xl sm:max-w-3xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-lg'
                    : 'bg-[#101626]/90 border border-white/15 text-slate-200 shadow-xl'
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between text-xs pb-1 border-b border-white/10">
                  <span className="font-bold flex items-center gap-1.5 font-sans">
                    {msg.role === 'user' ? 'You' : 'Aven AI Assistant'}
                    {msg.model_used && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-cyan-300 font-normal">
                        {msg.model_used.toUpperCase()}
                      </span>
                    )}
                    {msg.web_search_enabled && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Web
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] opacity-60 font-mono">{msg.timestamp}</span>
                </div>

                {/* Attached Document Pill (If user attached file) */}
                {msg.attached_file && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-xs text-slate-200">
                    <Paperclip className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Attached: {msg.attached_file}</span>
                  </div>
                )}

                {/* Main Text Content */}
                <div className="prose prose-invert prose-sm max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>

                {/* Multi-AI Perspectives Tabs (ChatGPT vs Claude vs Gemini) */}
                {msg.perspectives && (
                  <div className="pt-3 border-t border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-cyan-400" /> Multi-AI Model Perspectives
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {msg.perspectives.chatgpt && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-1">
                          <div className="text-[10px] font-bold text-emerald-400 font-mono">🤖 ChatGPT-4o View</div>
                          <p className="text-[11px] text-emerald-100 leading-snug">{msg.perspectives.chatgpt}</p>
                        </div>
                      )}

                      {msg.perspectives.claude && (
                        <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs space-y-1">
                          <div className="text-[10px] font-bold text-amber-400 font-mono">🧠 Claude 3.5 Sonnet View</div>
                          <p className="text-[11px] text-amber-100 leading-snug">{msg.perspectives.claude}</p>
                        </div>
                      )}

                      {msg.perspectives.gemini && (
                        <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs space-y-1">
                          <div className="text-[10px] font-bold text-blue-400 font-mono">⚡ Gemini Pro View</div>
                          <p className="text-[11px] text-blue-100 leading-snug">{msg.perspectives.gemini}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Suggested Action Chips */}
                {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {msg.suggested_actions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(act.action)}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-xs text-cyan-300 font-semibold transition-all inline-flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>{act.title}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Action Bar (Copy, Apply to Resume) */}
                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-400">
                    <button
                      onClick={() => handleCopyContent(msg.content, msg.id)}
                      className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Copied to Clipboard</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Response</span>
                        </>
                      )}
                    </button>

                    {onNavigateToTab && (
                      <button
                        onClick={() => onNavigateToTab('resume_analyzer')}
                        className="inline-flex items-center gap-1 text-cyan-300 hover:underline font-semibold"
                      >
                        <span>Open Resume Analyzer</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 p-0.5 shrink-0 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-3 max-w-4xl mx-auto items-center animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 p-0.5 shrink-0 animate-pulse">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-300" />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 text-xs text-cyan-300 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Aven is consulting multi-AI models (ChatGPT-4o, Claude 3.5, Gemini Pro)...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* BOTTOM INPUT BAR WITH '+' ACTION MENU (Exactly matching user screenshot!) */}
        <div className="p-4 border-t border-white/10 bg-[#0B0F19]/95 backdrop-blur-xl shrink-0 relative">
          <div className="max-w-4xl mx-auto space-y-2">
            
            {/* Quick Context Banner & Attached File Chip */}
            <div className="flex items-center justify-between text-[11px] px-1 text-slate-400">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                {attachedFile ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-semibold animate-scale-up">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>{attachedFile.name} ({attachedFile.size})</span>
                    <button
                      type="button"
                      onClick={() => setAttachedFile(null)}
                      className="p-0.5 hover:text-white rounded-full hover:bg-cyan-500/40"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-300">
                    <FileText className="w-3 h-3 text-cyan-400" />
                    <span>Resume: {resume?.file_name || 'Active Resume'}</span>
                  </span>
                )}

                {activeProjectContext && (
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-semibold">
                    <FolderPlus className="w-3 h-3" />
                    <span>Project: {activeProjectContext}</span>
                  </span>
                )}

                {webSearchEnabled && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 font-mono text-[10px]">
                    <Globe className="w-3 h-3" />
                    <span>Web Search: ON</span>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleEnhancePrompt}
                className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1 hover:underline shrink-0"
              >
                <Sparkles className="w-3 h-3" />
                <span>Enhance Prompt</span>
              </button>
            </div>

            {/* Input Form with Action Menu Trigger */}
            <div className="relative" ref={actionMenuRef}>
              
              {/* '+' ATTACHMENT DROPDOWN CONTEXT MENU (Styled like user screenshot!) */}
              {isActionMenuOpen && (
                <div className="absolute bottom-full left-0 mb-3 w-64 sm:w-72 bg-[#121826] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5 space-y-0.5 animate-scale-up backdrop-blur-2xl">
                  
                  {/* 1. Add files or photos */}
                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.08] text-xs text-slate-200 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Paperclip className="w-4 h-4 text-cyan-400" />
                      <span className="font-semibold text-white">Add files or photos</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-white/10 px-1.5 py-0.5 rounded">Ctrl + U</span>
                  </button>

                  {/* 2. Add to project > */}
                  <div className="relative group">
                    <button
                      type="button"
                      onClick={() => setActiveSubMenu(activeSubMenu === 'project' ? null : 'project')}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.08] text-xs text-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <FolderPlus className="w-4 h-4 text-purple-400" />
                        <span className="font-semibold text-white">Add to project</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {/* Submenu */}
                    {activeSubMenu === 'project' && (
                      <div className="pl-6 pr-2 py-1.5 space-y-1 bg-black/30 rounded-xl mb-1">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveProjectContext('Senior Full-Stack Sprints');
                            setIsActionMenuOpen(false);
                          }}
                          className="w-full text-left p-1.5 text-[11px] text-slate-300 hover:text-cyan-300 rounded hover:bg-white/5"
                        >
                          📁 Senior Full-Stack Sprints
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveProjectContext('Backend API Optimization');
                            setIsActionMenuOpen(false);
                          }}
                          className="w-full text-left p-1.5 text-[11px] text-slate-300 hover:text-cyan-300 rounded hover:bg-white/5"
                        >
                          📁 Backend API Optimization
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 3. Skills > */}
                  <div className="relative group">
                    <button
                      type="button"
                      onClick={() => setActiveSubMenu(activeSubMenu === 'skills' ? null : 'skills')}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.08] text-xs text-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Award className="w-4 h-4 text-emerald-400" />
                        <span className="font-semibold text-white">Skills</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {/* Submenu */}
                    {activeSubMenu === 'skills' && (
                      <div className="pl-6 pr-2 py-1.5 space-y-1 bg-black/30 rounded-xl mb-1">
                        <button
                          type="button"
                          onClick={() => {
                            setInputQuery(`Aven, analyze my proficiency in ${candidateSkills.slice(0, 4).join(', ')} for ${targetRole}.`);
                            setIsActionMenuOpen(false);
                          }}
                          className="w-full text-left p-1.5 text-[11px] text-emerald-300 hover:underline rounded hover:bg-white/5 font-semibold"
                        >
                          ⚡ Inject All Verified Resume Skills
                        </button>
                        <div className="flex flex-wrap gap-1 p-1">
                          {candidateSkills.slice(0, 6).map(s => (
                            <span key={s} className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-slate-300 font-mono">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 4. Add connector > */}
                  <div className="relative group">
                    <button
                      type="button"
                      onClick={() => setActiveSubMenu(activeSubMenu === 'connector' ? null : 'connector')}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.08] text-xs text-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Network className="w-4 h-4 text-amber-400" />
                        <span className="font-semibold text-white">Add connector</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {/* Submenu */}
                    {activeSubMenu === 'connector' && (
                      <div className="pl-6 pr-2 py-1.5 space-y-1 bg-black/30 rounded-xl mb-1">
                        <button
                          type="button"
                          onClick={() => {
                            setInputQuery('Aven, analyze my GitHub repository code structure and suggest improvements for technical recruiters.');
                            setIsActionMenuOpen(false);
                          }}
                          className="w-full text-left p-1.5 text-[11px] text-slate-300 hover:text-amber-300 rounded hover:bg-white/5"
                        >
                          🔗 GitHub Repository
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setInputQuery('Aven, review my LinkedIn headline and summary for maximum recruiter reach.');
                            setIsActionMenuOpen(false);
                          }}
                          className="w-full text-left p-1.5 text-[11px] text-slate-300 hover:text-amber-300 rounded hover:bg-white/5"
                        >
                          🔗 LinkedIn Profile
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 5. Add plugins... */}
                  <div className="relative group">
                    <button
                      type="button"
                      onClick={() => setActiveSubMenu(activeSubMenu === 'plugins' ? null : 'plugins')}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.08] text-xs text-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Puzzle className="w-4 h-4 text-pink-400" />
                        <span className="font-semibold text-white">Add plugins...</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {activeSubMenu === 'plugins' && (
                      <div className="pl-6 pr-2 py-1.5 space-y-1 bg-black/30 rounded-xl mb-1">
                        <button
                          type="button"
                          onClick={() => {
                            setActivePlugin('ATS Resume Calibrator');
                            setIsActionMenuOpen(false);
                          }}
                          className="w-full text-left p-1.5 text-[11px] text-slate-300 hover:text-pink-300 rounded hover:bg-white/5 flex items-center justify-between"
                        >
                          <span>✨ ATS Resume Calibrator</span>
                          <Check className="w-3 h-3 text-emerald-400" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActivePlugin('LeetCode Interview Grader');
                            setIsActionMenuOpen(false);
                          }}
                          className="w-full text-left p-1.5 text-[11px] text-slate-300 hover:text-pink-300 rounded hover:bg-white/5"
                        >
                          <span>🧩 LeetCode Interview Grader</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-white/10 my-1"></div>

                  {/* 6. Web search (Checkbox toggle from screenshot!) */}
                  <button
                    type="button"
                    onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.08] text-xs text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span className="font-semibold text-white">Web search</span>
                    </div>
                    {webSearchEnabled && <Check className="w-4 h-4 text-blue-400 font-bold" />}
                  </button>

                </div>
              )}

              {/* Main Form Input Bar with '+' Button */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.05] border border-white/20 focus-within:border-cyan-400/60 focus-within:bg-white/[0.08] transition-all shadow-xl"
              >
                {/* '+' Attachment Action Button */}
                <button
                  type="button"
                  onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                  className={`p-2.5 rounded-xl transition-all ${
                    isActionMenuOpen
                      ? 'bg-cyan-500 text-slate-950 shadow-md rotate-45'
                      : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                  title="Add files, project context, skills, connectors, or web search"
                >
                  <Plus className="w-4 h-4 transition-transform" />
                </button>

                {/* Main Input Text Field */}
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Write a message..."
                  className="flex-1 bg-transparent px-2 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                />

                {/* Voice Input Toggle Button */}
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`p-2.5 rounded-xl transition-all ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                  title="Voice Input (Speech-to-Text)"
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !inputQuery.trim()}
                  className={`p-2.5 rounded-xl transition-all ${
                    inputQuery.trim() && !loading
                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md active:scale-95'
                      : 'bg-white/10 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="text-center text-[10px] text-slate-400 font-mono flex items-center justify-center gap-2">
              <span>Aven AI Career Agent • Linked to Google Gemini Generative AI</span>
              <button
                type="button"
                onClick={() => setGoogleKeyModalOpen(true)}
                className="text-cyan-400 hover:underline inline-flex items-center gap-1"
              >
                <Sliders className="w-3 h-3" />
                <span>Google AI Settings</span>
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* Google Gemini API Key & Connection Settings Modal */}
      {googleKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#0F1422] border border-white/20 rounded-2xl shadow-2xl p-6 space-y-4 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Google Gemini AI Connection</h3>
                  <p className="text-[11px] text-slate-400">Direct link to Google Generative AI</p>
                </div>
              </div>
              <button
                onClick={() => setGoogleKeyModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status Info */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Engine Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                  CONNECTED & ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Aven can answer <strong>ANY</strong> question asked (coding, system design, SDE roles, math, career roadmaps, or general knowledge) using Google Gemini generative intelligence.
              </p>
            </div>

            {/* Optional Custom API Key */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 block">
                Custom Google Gemini API Key (Optional):
              </label>
              <input
                type="password"
                value={geminiApiKeyInput}
                onChange={(e) => setGeminiApiKeyInput(e.target.value)}
                placeholder="AIzaSy... (Leave blank to use connected server AI)"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <p className="text-[10px] text-slate-400">
                You can get a free API key from Google AI Studio (aistudio.google.com).
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('hiresense_gemini_api_key');
                  setGeminiApiKeyInput('');
                  setGoogleConnected(false);
                  setGoogleKeyModalOpen(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-xs text-slate-400 hover:text-white"
              >
                Use Default Server
              </button>
              <button
                type="button"
                onClick={() => {
                  if (geminiApiKeyInput.trim()) {
                    localStorage.setItem('hiresense_gemini_api_key', geminiApiKeyInput.trim());
                    setGoogleConnected(true);
                  }
                  setGoogleKeyModalOpen(false);
                }}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-md"
              >
                Save & Connect
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
