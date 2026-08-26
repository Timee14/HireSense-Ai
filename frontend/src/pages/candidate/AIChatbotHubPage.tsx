import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Send, Bot, User, BrainCircuit, Target, BookOpen, FileText,
  Copy, Check, RefreshCw, Trash2, Plus, Search, ChevronDown, ChevronRight,
  CheckCircle2, ArrowRight, ShieldCheck, Zap, MessageSquare, Terminal, Lightbulb,
  Compass, Sliders, Mic, MicOff, ExternalLink, HelpCircle, Code, Layers,
  Paperclip, FolderPlus, Award, Network, Puzzle, Globe, X, Upload,
  Image as ImageIcon, Film, Music, Eye, Play, FileCode,
  SquarePen, Images, Library, Clock, AtSign, MoreHorizontal, PanelLeftClose, PanelLeft,
  Calendar, Bookmark, Sparkle, History, Settings, CheckCircle
} from 'lucide-react';
import { Resume, JobRecommendation } from '../../types';
import { sendChatMessage, getChatSessions, clearChatHistory } from '../../api/client';
import {
  ChatAttachmentViewerModal,
  ChatAttachment,
  detectAttachmentType
} from '../../components/ui/ChatAttachmentViewerModal';

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
  attached_file_info?: ChatAttachment;
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
  const [attachedFile, setAttachedFile] = useState<ChatAttachment | null>(null);
  const [selectedAttachmentForModal, setSelectedAttachmentForModal] = useState<ChatAttachment | null>(null);
  const [activeProjectContext, setActiveProjectContext] = useState<string | null>(null);
  const [activePlugin, setActivePlugin] = useState<string | null>('ATS Calibrator');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const actionMenuRef = useRef<HTMLDivElement | null>(null);

  // ChatGPT Navigation Bar State
  const [activeNavModal, setActiveNavModal] = useState<'images' | 'library' | 'scheduled' | 'plugins' | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);

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

  // Close + Action Menu & More Menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setIsActionMenuOpen(false);
        setActiveSubMenu(null);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
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
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      const sizeStr = file.size > 1024 * 1024 ? `${sizeMb} MB` : `${(file.size / 1024).toFixed(1)} KB`;
      const detectedType = detectAttachmentType(file.name, file.type);
      const objUrl = URL.createObjectURL(file);

      const newAttachment: ChatAttachment = {
        name: file.name,
        size: sizeStr,
        type: detectedType,
        url: objUrl,
        file: file
      };

      // Read text/code content if appropriate for AI context & preview
      if (detectedType === 'code' || detectedType === 'document' || file.type.startsWith('text/') || file.name.endsWith('.json') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          newAttachment.textContent = event.target?.result as string;
          setAttachedFile(newAttachment);
        };
        reader.readAsText(file);
      } else {
        setAttachedFile(newAttachment);
      }

      setIsActionMenuOpen(false);
      setActiveSubMenu(null);
      e.target.value = '';
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || loading) return;

    const currentAttachment = attachedFile;
    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attached_file: currentAttachment ? currentAttachment.name : undefined,
      attached_file_info: currentAttachment || undefined,
      web_search_enabled: webSearchEnabled
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
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
        message: query + (currentAttachment ? ` [Attached ${currentAttachment.type || 'file'}: ${currentAttachment.name}${currentAttachment.textContent ? ` | Content: ${currentAttachment.textContent.slice(0, 300)}` : ''}]` : '') + (webSearchEnabled ? ' [Web Search: Enabled]' : ''),
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
      
      {/* Hidden File Input for Attachments (Accepts Photos, Videos, Audio, PDFs, Code, Documents) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.csv,.json,.md,.js,.ts,.py,.html,.css,*"
        className="hidden"
      />

      {/* SIDEBAR: CHATGPT-STYLE NAVIGATION BAR (Matches screenshot exactly!) */}
      <aside className={`w-full lg:w-64 shrink-0 border-r border-white/10 bg-[#000000] flex flex-col transition-all duration-300 ${sidebarOpen ? 'block' : 'hidden lg:flex'}`}>
        
        {/* ChatGPT Header (Matches screenshot) */}
        <div className="p-3 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 pl-1">
            <span className="font-bold text-base text-white tracking-tight font-sans">
              ChatGPT
            </span>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-1.5 rounded-lg transition-colors ${isSearchOpen ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              title="Search Conversations"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close Sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ChatGPT Vertical Navigation Menu (Exact layout from user screenshot!) */}
        <div className="px-2 py-1 space-y-0.5" ref={moreMenuRef}>
          
          {/* 1. New chat */}
          <button
            type="button"
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-[#212121] hover:bg-[#2f2f2f] text-white font-medium text-xs sm:text-sm transition-all group active:scale-[0.99] text-left shadow-sm"
          >
            <SquarePen className="w-4 h-4 text-white group-hover:scale-105 transition-transform shrink-0" />
            <span>New chat</span>
          </button>

          {/* 2. Images */}
          <button
            type="button"
            onClick={() => setActiveNavModal('images')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.08] text-slate-200 hover:text-white text-xs sm:text-sm transition-colors text-left group"
          >
            <Images className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0" />
            <span>Images</span>
          </button>

          {/* 3. Library */}
          <button
            type="button"
            onClick={() => setActiveNavModal('library')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.08] text-slate-200 hover:text-white text-xs sm:text-sm transition-colors text-left group"
          >
            <Library className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors shrink-0" />
            <span>Library</span>
          </button>

          {/* 4. Scheduled */}
          <button
            type="button"
            onClick={() => setActiveNavModal('scheduled')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.08] text-slate-200 hover:text-white text-xs sm:text-sm transition-colors text-left group"
          >
            <Clock className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors shrink-0" />
            <span>Scheduled</span>
          </button>

          {/* 5. Plugins */}
          <button
            type="button"
            onClick={() => setActiveNavModal('plugins')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.08] text-slate-200 hover:text-white text-xs sm:text-sm transition-colors text-left group"
          >
            <AtSign className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors shrink-0" />
            <span>Plugins</span>
          </button>

          {/* 6. More */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.08] text-slate-200 hover:text-white text-xs sm:text-sm transition-colors text-left group"
            >
              <MoreHorizontal className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors shrink-0" />
              <span>More</span>
            </button>

            {isMoreMenuOpen && (
              <div className="absolute left-full top-0 ml-2 w-60 bg-[#171717] border border-white/15 rounded-2xl shadow-2xl p-1.5 space-y-1 z-50 animate-scale-up backdrop-blur-2xl">
                <button
                  type="button"
                  onClick={() => {
                    handleToggleVoice();
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 text-xs text-slate-200 text-left transition-colors"
                >
                  <Mic className="w-3.5 h-3.5 text-rose-400" />
                  <span>Voice Simulation Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSendMessage(`Aven, show me the latest live compensation benchmarks and salary ranges for ${targetRole}.`);
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 text-xs text-slate-200 text-left transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Salary Benchmarks</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGoogleKeyModalOpen(true);
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 text-xs text-slate-200 text-left transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-blue-400" />
                  <span>Google AI Connection</span>
                </button>
                <div className="border-t border-white/10 my-1"></div>
                <button
                  type="button"
                  onClick={() => {
                    handleClearHistory();
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-rose-950/40 text-xs text-rose-400 text-left transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Chat History</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Optional Search Bar dropdown */}
        {isSearchOpen && (
          <div className="p-2 border-t border-white/10 animate-fade-in">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchHistory}
                onChange={(e) => setSearchHistory(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Recent Chats Section */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 scrollbar-thin border-t border-white/10">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 px-3 block mb-1">
            Recent
          </span>
          {filteredSessions.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSessionId(s.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center gap-2.5 ${
                activeSessionId === s.id
                  ? 'bg-white/[0.12] text-white font-medium'
                  : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'
              }`}
            >
              <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${activeSessionId === s.id ? 'text-cyan-400' : 'text-slate-500'}`} />
              <div className="flex-1 min-w-0">
                <div className="truncate">{s.title}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Sidebar Footer: Aven Copilot Status */}
        <div className="p-2.5 border-t border-white/10 bg-black/40">
          <div className="p-2 rounded-xl hover:bg-white/[0.05] flex items-center justify-between transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center p-0.5 text-slate-950 font-bold text-xs">
                A
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-none">Aven Copilot</div>
                <div className="text-[9px] text-emerald-400 font-mono mt-0.5">ChatGPT-4o • Gemini</div>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </aside>

      {/* MAIN CHAT ARENA */}
      <main className="flex-1 flex flex-col h-[calc(100vh-80px)] overflow-hidden relative">
        
        {/* Top Header Bar: Target Role Calibration & Model Selector */}
        <div className="p-3 sm:p-4 border-b border-white/10 bg-[#0B0F19]/80 backdrop-blur-md shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Target Role Selector & Sidebar Expand Toggle */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {!sidebarOpen && (
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all shadow-md mr-1 shrink-0"
                title="Open ChatGPT Navigation Sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}
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

                {/* Attached Document / Media Pill (Clickable & Interactive with Preview Modal!) */}
                {msg.attached_file && (
                  <button
                    type="button"
                    onClick={() => {
                      const attachmentToView: ChatAttachment = msg.attached_file_info || {
                        name: msg.attached_file!,
                        type: detectAttachmentType(msg.attached_file!),
                        size: 'Attached File'
                      };
                      setSelectedAttachmentForModal(attachmentToView);
                    }}
                    className="group/pill flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl bg-white/10 hover:bg-white/[0.18] border border-white/20 hover:border-cyan-400 text-xs text-slate-100 font-medium transition-all shadow-md active:scale-[0.98] cursor-pointer text-left w-full max-w-md"
                    title={`Click to open, preview or play ${msg.attached_file}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 group-hover/pill:scale-105 group-hover/pill:bg-cyan-500 group-hover/pill:text-slate-950 transition-all shrink-0">
                        {(() => {
                          const t = msg.attached_file_info?.type || detectAttachmentType(msg.attached_file);
                          if (t === 'image') return <ImageIcon className="w-4 h-4" />;
                          if (t === 'video') return <Film className="w-4 h-4" />;
                          if (t === 'audio') return <Music className="w-4 h-4" />;
                          if (t === 'code') return <FileCode className="w-4 h-4" />;
                          return <Paperclip className="w-4 h-4" />;
                        })()}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-white truncate block group-hover/pill:text-cyan-300 transition-colors">
                          Attached: {msg.attached_file}
                        </span>
                        <span className="text-[10px] text-cyan-200/70 font-mono flex items-center gap-1 mt-0.5">
                          <span>{msg.attached_file_info?.size || 'Click to open & view'}</span>
                          <span>•</span>
                          <span className="text-cyan-300 font-bold group-hover/pill:underline">
                            {(() => {
                              const t = msg.attached_file_info?.type || detectAttachmentType(msg.attached_file);
                              if (t === 'image') return 'View Photo';
                              if (t === 'video') return 'Play Video';
                              if (t === 'audio') return 'Play Audio';
                              return 'Preview Document';
                            })()}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="px-2.5 py-1 rounded-xl bg-white/10 group-hover/pill:bg-cyan-500 group-hover/pill:text-slate-950 text-cyan-300 text-[11px] font-bold transition-all flex items-center gap-1 shrink-0">
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Open</span>
                    </div>
                  </button>
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
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-semibold animate-scale-up">
                    <button
                      type="button"
                      onClick={() => setSelectedAttachmentForModal(attachedFile)}
                      className="flex items-center gap-1.5 hover:text-white transition-colors"
                      title="Click to preview attached media"
                    >
                      {attachedFile.type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />}
                      {attachedFile.type === 'video' && <Film className="w-3.5 h-3.5 text-emerald-400" />}
                      {attachedFile.type === 'audio' && <Music className="w-3.5 h-3.5 text-purple-400" />}
                      {attachedFile.type === 'code' && <FileCode className="w-3.5 h-3.5 text-amber-400" />}
                      {(attachedFile.type === 'pdf' || attachedFile.type === 'document' || attachedFile.type === 'other') && (
                        <Paperclip className="w-3.5 h-3.5 text-cyan-300" />
                      )}
                      <span className="truncate max-w-[180px]">{attachedFile.name}</span>
                      <span className="text-[10px] opacity-75 font-mono">({attachedFile.size})</span>
                      <Eye className="w-3 h-3 opacity-80" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttachedFile(null)}
                      className="p-0.5 hover:text-white rounded-full hover:bg-cyan-500/40 ml-1"
                      title="Remove attachment"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
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

      {/* 1. IMAGES MODAL (From ChatGPT Sidebar 'Images') */}
      {activeNavModal === 'images' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#0F1422] border border-white/20 rounded-3xl shadow-2xl p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Images className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">AI Images & System Visualizations</h3>
                  <p className="text-xs text-slate-400">Generate diagrams, skill maps & system blueprints</p>
                </div>
              </div>
              <button
                onClick={() => setActiveNavModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  title: '🏗️ Distributed Architecture Diagram',
                  prompt: `Aven, generate a detailed architecture diagram and explanation for a real-time distributed microservices backend using FastAPI, Redis pub/sub, PostgreSQL, and WebSockets.`
                },
                {
                  title: '📊 Candidate Skill & Tech Stack Map',
                  prompt: `Aven, create a structured visual ASCII/markdown skill map comparing my resume capabilities against the industry benchmarks for ${targetRole}.`
                },
                {
                  title: '🎨 Single-Column ATS Resume Blueprint',
                  prompt: `Aven, visualize the optimal single-column ATS resume layout with strict typography, section hierarchies, and keyword density guidelines.`
                },
                {
                  title: '☁️ Cloud Serverless Event Flow',
                  prompt: `Aven, map out the event-driven workflow for an AWS Lambda + SQS + DynamoDB serverless microservice pipeline.`
                }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveNavModal(null);
                    handleSendMessage(item.prompt);
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-white/[0.03] hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/40 transition-all group flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 block">{item.title}</span>
                    <span className="text-[11px] text-slate-400 truncate block mt-0.5">{item.prompt}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. LIBRARY MODAL (From ChatGPT Sidebar 'Library') */}
      {activeNavModal === 'library' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#0F1422] border border-white/20 rounded-3xl shadow-2xl p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Library className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Aven Resource & Prompt Library</h3>
                  <p className="text-xs text-slate-400">Master templates, STAR formulas, and interview cheat sheets</p>
                </div>
              </div>
              <button
                onClick={() => setActiveNavModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  title: '📝 STAR Resume Rewrite Formula',
                  desc: 'Transform passive responsibilities into high-impact quantified achievements.',
                  prompt: 'Aven, rewrite my backend engineering experience using the STAR formula with strong action verbs and quantified impact metrics.'
                },
                {
                  title: '🧠 45-Min System Design Master Checklist',
                  desc: 'Step-by-step framework: Requirements, Back-of-envelope, HLD, Deep Dive, Bottlenecks.',
                  prompt: 'Aven, provide the complete 45-minute System Design framework checklist for Senior SDE interviews.'
                },
                {
                  title: '⚡ Top 75 DSA Pattern Breakdown',
                  desc: 'Sliding Window, Two Pointers, Fast & Slow Pointers, Monotonic Stack, Dynamic Programming.',
                  prompt: 'Aven, summarize the top LeetCode DSA patterns with time complexity trade-offs and code examples.'
                },
                {
                  title: '🤝 Recruiter Outreach & InMail Scripts',
                  desc: 'High-conversion cold messages for engineering hiring managers and technical recruiters.',
                  prompt: 'Aven, draft 2 high-response recruiter outreach messages highlighting my experience for ${targetRole}.'
                }
              ].map((lib, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveNavModal(null);
                    handleSendMessage(lib.prompt);
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/40 transition-all group flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300 block">{lib.title}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{lib.desc}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. SCHEDULED MODAL (From ChatGPT Sidebar 'Scheduled') */}
      {activeNavModal === 'scheduled' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#0F1422] border border-white/20 rounded-3xl shadow-2xl p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Scheduled Upskilling & Mock Drills</h3>
                  <p className="text-xs text-slate-400">Automated study reminders and technical milestones</p>
                </div>
              </div>
              <button
                onClick={() => setActiveNavModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-purple-400" /> Daily 9:00 AM LeetCode Challenge
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Medium-tier data structures & algorithm challenge calibrated to top tech company rubrics.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-cyan-400" /> Saturday System Design Mock Drill
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                    SCHEDULED
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  45-minute interactive simulated system design interview with multi-AI feedback.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setActiveNavModal(null);
                  handleSendMessage(`Aven, start today's scheduled technical interview practice drill for ${targetRole}.`);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95"
              >
                🚀 Run Scheduled Mock Drill Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. PLUGINS MODAL (From ChatGPT Sidebar 'Plugins') */}
      {activeNavModal === 'plugins' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#0F1422] border border-white/20 rounded-3xl shadow-2xl p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <AtSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">AI Plugins & Integrations</h3>
                  <p className="text-xs text-slate-400">Active intelligence extensions for Aven</p>
                </div>
              </div>
              <button
                onClick={() => setActiveNavModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'ATS Resume Calibrator', desc: 'Real-time keyword scoring & ATS compliance matching', active: true },
                { name: 'LeetCode Live Interview Grader', desc: 'Synthesizes code correctness, Big-O complexity & test cases', active: true },
                { name: 'GitHub Repository Analyzer', desc: 'Evaluates project architectures and repo documentation', active: true },
                { name: 'Market Demand & Compensation Engine', desc: 'Live market salary and skill demand index scanner', active: true }
              ].map((plugin, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{plugin.name}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{plugin.desc}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold shrink-0 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> ENABLED
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Universal Media & Document Viewer Modal for Photos, Videos, Audio, PDFs, Code, Docs */}
      {selectedAttachmentForModal && (
        <ChatAttachmentViewerModal
          attachment={selectedAttachmentForModal}
          onClose={() => setSelectedAttachmentForModal(null)}
          onNavigateToTab={onNavigateToTab}
          onAskAvenAboutFile={(fileName) => {
            handleSendMessage(`Aven, please analyze the attached file "${fileName}" and provide deep insights.`);
          }}
        />
      )}

    </div>
  );
};
