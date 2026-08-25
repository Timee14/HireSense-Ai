import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, X, Send, Bot, Sparkles, Target, ArrowRight,
  Maximize2, RefreshCw, CheckCircle2, ChevronRight, Layers,
  Plus, Paperclip, Globe, Check, Award, FolderPlus
} from 'lucide-react';
import { Resume } from '../../types';
import { sendChatMessage } from '../../api/client';

interface FloatingAIChatWidgetProps {
  resume: Resume | null;
  onOpenFullHub?: () => void;
}

export const FloatingAIChatWidget: React.FC<FloatingAIChatWidgetProps> = ({
  resume,
  onOpenFullHub
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [webSearch, setWebSearch] = useState(true);
  const [attachedDoc, setAttachedDoc] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; attached?: string; perspectives?: any }>>([
    {
      role: 'assistant',
      text: `👋 Hi! I am **Aven**, your AI Career Copilot. Ask me how to upskill for Senior roles, optimize your resume for ATS algorithms, or bridge technical gaps!`
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (customText?: string) => {
    const query = (customText || inputMsg).trim();
    if (!query || loading) return;

    const currentDoc = attachedDoc;
    setMessages(prev => [...prev, { role: 'user', text: query, attached: currentDoc || undefined }]);
    setInputMsg('');
    setAttachedDoc(null);
    setLoading(true);

    try {
      const res = await sendChatMessage({
        message: query + (currentDoc ? ` [Document: ${currentDoc}]` : '') + (webSearch ? ' [Web Search: Active]' : ''),
        candidate_skills: resume?.analysis?.extracted_skills || ['Python', 'FastAPI', 'React'],
        target_role: 'Senior Full-Stack Engineer'
      });

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: res.content || 'Here are targeted recommendations from Aven.',
          perspectives: res.perspectives
        }
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `### 🎯 Aven Quick Recommendation\n* Focus on **Redis caching** and **Kubernetes containerization** to reach top 5% candidate tier.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setAttachedDoc(f.name);
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      
      <input
        type="file"
        ref={fileRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.docx,.txt,.png"
      />

      {/* Floating Toggle Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-400 text-slate-950 font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all border border-white/20 animate-bounce-subtle"
        >
          <Bot className="w-5 h-5" />
          <span className="text-xs sm:text-sm font-extrabold tracking-tight">Ask Aven</span>
          <span className="w-2 h-2 rounded-full bg-emerald-950 animate-ping" />
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] rounded-2xl bg-[#0B0F19]/95 backdrop-blur-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-scale-up">
          
          {/* Header */}
          <div className="p-3.5 bg-white/[0.04] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center p-0.5 shadow-md">
                <Bot className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Aven AI Copilot</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300">Multi-AI</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">ChatGPT • Claude • Gemini</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {onOpenFullHub && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenFullHub();
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Expand to Full Hub"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Starter Suggestions */}
          <div className="p-2 bg-white/[0.02] border-b border-white/5 flex gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => handleSend('Aven, what are my biggest skill gaps for Senior Full-Stack?')}
              className="px-2 py-1 rounded-md bg-white/[0.04] hover:bg-cyan-500/20 text-[10px] font-semibold text-cyan-300 whitespace-nowrap border border-white/10 transition-colors"
            >
              🎯 Skill Gaps
            </button>
            <button
              onClick={() => handleSend('Aven, rewrite my resume bullet points with the STAR formula')}
              className="px-2 py-1 rounded-md bg-white/[0.04] hover:bg-emerald-500/20 text-[10px] font-semibold text-emerald-300 whitespace-nowrap border border-white/10 transition-colors"
            >
              📝 STAR Bullets
            </button>
            <button
              onClick={() => handleSend('Aven, generate a 30-day upskilling roadmap for Senior engineering roles')}
              className="px-2 py-1 rounded-md bg-white/[0.04] hover:bg-purple-500/20 text-[10px] font-semibold text-purple-300 whitespace-nowrap border border-white/10 transition-colors"
            >
              🚀 30-Day Plan
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-xl p-3 max-w-[85%] whitespace-pre-wrap leading-relaxed space-y-1.5 ${
                    m.role === 'user'
                      ? 'bg-cyan-600 text-white font-medium shadow-sm'
                      : 'bg-white/[0.06] border border-white/10 text-slate-200'
                  }`}
                >
                  {m.attached && (
                    <div className="text-[10px] px-2 py-0.5 rounded bg-black/30 font-mono text-cyan-200 inline-flex items-center gap-1">
                      <Paperclip className="w-3 h-3" />
                      <span>{m.attached}</span>
                    </div>
                  )}
                  <div>{m.text}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] text-[11px] text-cyan-300">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Aven is synthesizing multi-AI response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Attached Document Indicator */}
          {attachedDoc && (
            <div className="px-3 py-1 bg-cyan-950/80 border-t border-cyan-500/30 flex items-center justify-between text-[11px] text-cyan-300">
              <span className="flex items-center gap-1 truncate">
                <Paperclip className="w-3 h-3 shrink-0" />
                <span className="truncate">{attachedDoc}</span>
              </span>
              <button onClick={() => setAttachedDoc(null)} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Action Menu Popup */}
          {isMenuOpen && (
            <div className="p-2 bg-[#121826] border-t border-white/10 text-xs space-y-1 animate-scale-up">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/10 text-slate-200 text-[11px]"
              >
                <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                <span>Add files or photos</span>
              </button>
              <button
                type="button"
                onClick={() => setWebSearch(!webSearch)}
                className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-white/10 text-slate-200 text-[11px]"
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Web search</span>
                </span>
                {webSearch && <Check className="w-3 h-3 text-blue-400" />}
              </button>
            </div>
          )}

          {/* Input Box with '+' Action Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-black/40 border-t border-white/10 flex items-center gap-1.5"
          >
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-1.5 rounded-lg transition-colors ${isMenuOpen ? 'bg-cyan-500 text-black rotate-45' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              title="Add attachment or web search"
            >
              <Plus className="w-4 h-4 transition-transform" />
            </button>

            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Write a message to Aven..."
              className="flex-1 px-2.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />

            <button
              type="submit"
              disabled={loading || !inputMsg.trim()}
              className="p-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 disabled:opacity-40 transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
