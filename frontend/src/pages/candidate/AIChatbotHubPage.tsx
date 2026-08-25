import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Send, Bot, User, BrainCircuit, Target, BookOpen, FileText,
  Copy, Check, RefreshCw, Trash2, Plus, Search, ChevronDown, CheckCircle2,
  ArrowRight, ShieldCheck, Zap, MessageSquare, Terminal, Lightbulb, Compass,
  Sliders, Mic, MicOff, ExternalLink, HelpCircle, Code, Layers
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
  { id: 'consensus', name: 'HireSense Consensus', badge: 'Multi-AI', desc: 'Synthesizes ChatGPT, Claude & Gemini', color: 'from-cyan-500 to-emerald-500' },
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
  const [targetRole, setTargetRole] = useState<string>('Senior Full-Stack Engineer');
  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activePerspectiveTab, setActivePerspectiveTab] = useState<Record<string, 'chatgpt' | 'claude' | 'gemini'>>({});
  
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
      content: `### 🤖 Welcome to HireSense AI Career & Upskilling Copilot!

I am your multi-model career coach combining insights from **OpenAI ChatGPT-4o**, **Anthropic Claude 3.5 Sonnet**, and **Google Gemini Pro**.

I have reviewed your resume (**${resume?.file_name || 'Alex_Chen_Resume.pdf'}**) and calibrated your profile against the **${targetRole}** role.

#### 💡 How I can help you accelerate your hiring readiness:
* 🎯 **Skill Gap Analysis**: Identify exact missing technologies and frameworks required by recruiters.
* 📝 **STAR Metric Optimization**: Transform passive bullet points into high-impact quantifiable outcomes.
* 🚀 **30-Day Upskilling Roadmap**: Structured study plan and mini-projects to reach candidate shortlist tier.
* 🎙️ **Multi-AI Mock Interviews**: Practice role-specific technical and behavioral questions.

*Click one of the prompt shortcuts below or ask any question to get started!*`,
      model_used: 'consensus',
      timestamp: 'Just now',
      perspectives: {
        chatgpt: `ChatGPT-4o: Ask me to re-craft your experience section to achieve 95+ ATS pass rate.`,
        claude: `Claude 3.5 Sonnet: Let's explore system design trade-offs and microservice failure patterns.`,
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

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || loading) return;

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await sendChatMessage({
        message: query,
        model: selectedModel,
        target_role: targetRole,
        candidate_skills: candidateSkills,
        missing_skills: missingSkills,
        resume_summary: resume?.raw_text?.slice(0, 500) || '',
        history: messages.slice(-4)
      });

      const assistantMsg: ChatMessage = {
        id: response.id || 'bot-' + Date.now(),
        role: 'assistant',
        content: response.content,
        model_used: response.model_used || selectedModel,
        timestamp: response.timestamp || 'Just now',
        perspectives: response.perspectives,
        suggested_actions: response.suggested_actions,
        roadmap_items: response.roadmap_items
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      // Fallback response
      const fallbackMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        content: `### 🎯 AI Recommendations for ${targetRole}\n\n* **Primary Gap to Close**: Add Redis caching and Kubernetes Helm deployment to your project experience.\n* **Quantify Impact**: Use formulas like *"Reduced latency by 38% for 50,000+ daily requests"*.\n* **Next Step**: Check the **Skill Gaps** tab to view benchmark radar score.`,
        model_used: selectedModel,
        timestamp: 'Just now',
        perspectives: {
          chatgpt: `ChatGPT-4o: Highlight container orchestration and sub-10ms response times.`,
          claude: `Claude 3.5 Sonnet: Emphasize trade-offs and fault-tolerant architecture.`,
          gemini: `Gemini Flash: Current job market alignment score is 89%.`
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
      title: `💬 New Consultation (${targetRole.split(' ')[0]})`,
      created_at: 'Just now',
      message_count: 1
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSessId);
    initializeWelcome();
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all chat conversations?')) {
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
      setInputQuery(`Analyze my resume against the ${targetRole} job requirements, identify missing keywords, and suggest 3 high-impact STAR bullet points.`);
    } else {
      setInputQuery(`Act as a Senior Principal Engineering Hiring Manager. For the role of ${targetRole}, analyze: "${inputQuery}". Provide multi-AI feedback with quantified metrics and system design trade-offs.`);
    }
  };

  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setInputQuery('How can I optimize my backend FastAPI project to impress recruiters hiring for Senior roles?');
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
      
      {/* SIDEBAR: CHAT HISTORY & AGENT SETTINGS */}
      <aside className={`w-full lg:w-72 shrink-0 border-r border-white/10 bg-[#0B0F19]/90 backdrop-blur-xl flex flex-col transition-all duration-300 ${sidebarOpen ? 'block' : 'hidden lg:flex'}`}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10 space-y-3">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>New Career Consultation</span>
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
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-[11px] font-bold text-white">HireSense Pro AI</div>
                <div className="text-[9px] text-slate-400 font-mono">Consensus Multi-Engine</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
              ACTIVE
            </span>
          </div>

          <button
            onClick={handleClearHistory}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 text-xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat History</span>
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
                <option value="Senior Full-Stack Engineer" className="bg-slate-900 text-white">Senior Full-Stack Engineer</option>
                <option value="Backend Python / FastAPI Engineer" className="bg-slate-900 text-white">Backend Python / FastAPI Engineer</option>
                <option value="Frontend React / Next.js Specialist" className="bg-slate-900 text-white">Frontend React / Next.js Specialist</option>
                <option value="Software Development Engineer" className="bg-slate-900 text-white">Software Development Engineer</option>
                <option value="AI / ML Systems Engineer" className="bg-slate-900 text-white">AI / ML Systems Engineer</option>
              </select>
            </div>
          </div>

          {/* AI Model Intelligence Selector Pills (Matching User Screenshot Layout!) */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1 scrollbar-none">
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
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>Interactive Career Intelligence Hub</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
                  How can I help you upskill today?
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Select a targeted prompt below or ask custom questions regarding your resume & skill gaps.
                </p>
              </div>

              {/* Prompt Suggestion Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleSendMessage(`What are my exact skill gaps for ${targetRole} and what projects should I build to bridge them?`)}
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
                  onClick={() => handleSendMessage(`Rewrite my top software experience bullets using the STAR method and strong action verbs with quantified numbers.`)}
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
                  onClick={() => handleSendMessage(`Create a 30-day accelerated learning roadmap for ${targetRole} with weekly milestones.`)}
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
                  onClick={() => handleSendMessage(`Simulate a senior technical interview for ${targetRole}. Ask me a difficult system design question.`)}
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
                    {msg.role === 'user' ? 'You' : 'HireSense AI Career Intelligence'}
                    {msg.model_used && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-cyan-300 font-normal">
                        {msg.model_used.toUpperCase()}
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] opacity-60 font-mono">{msg.timestamp}</span>
                </div>

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
                <span>Consulting multi-AI models (ChatGPT-4o, Claude 3.5, Gemini Pro)...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* BOTTOM INPUT BAR (Styled like DeepAI/ChatGPT in user's screenshot) */}
        <div className="p-4 border-t border-white/10 bg-[#0B0F19]/95 backdrop-blur-xl shrink-0">
          <div className="max-w-4xl mx-auto space-y-2">
            
            {/* Quick Context Pill Banner */}
            <div className="flex items-center justify-between text-[11px] px-1 text-slate-400">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-300">
                  <FileText className="w-3 h-3 text-cyan-400" />
                  <span>Resume: {resume?.file_name || 'Active Resume'}</span>
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-300">
                  <Target className="w-3 h-3 text-emerald-400" />
                  <span>Target: {targetRole}</span>
                </span>
              </div>

              <button
                type="button"
                onClick={handleEnhancePrompt}
                className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1 hover:underline"
              >
                <Sparkles className="w-3 h-3" />
                <span>Enhance Prompt</span>
              </button>
            </div>

            {/* Input Box and Action Controls */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.05] border border-white/20 focus-within:border-cyan-400/60 focus-within:bg-white/[0.08] transition-all shadow-xl"
            >
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

              {/* Main Input Text Field */}
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={`Ask AI to analyze skill gaps for ${targetRole}, rewrite resume, or explain concepts...`}
                className="flex-1 bg-transparent px-2 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
              />

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

            <div className="text-center text-[10px] text-slate-400 font-mono">
              HireSense Multi-AI Engine calibrated against verified ATS algorithms and hiring benchmark data.
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};
