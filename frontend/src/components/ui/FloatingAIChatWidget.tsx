import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, X, Send, Bot, Sparkles, Target, ArrowRight,
  Maximize2, RefreshCw, CheckCircle2, ChevronRight, Layers,
  Plus, Paperclip, Globe, Check, Award, FolderPlus,
  Image as ImageIcon, Film, Music, Eye, FileCode,
  SquarePen, Images, Library, Clock, AtSign, MoreHorizontal
} from 'lucide-react';
import { Resume } from '../../types';
import { sendChatMessage } from '../../api/client';
import {
  ChatAttachmentViewerModal,
  ChatAttachment,
  detectAttachmentType
} from './ChatAttachmentViewerModal';

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
  const [attachedDoc, setAttachedDoc] = useState<ChatAttachment | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<ChatAttachment | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant';
    text: string;
    attached?: string;
    attachmentInfo?: ChatAttachment;
    perspectives?: any;
  }>>([
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
    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        text: query,
        attached: currentDoc ? currentDoc.name : undefined,
        attachmentInfo: currentDoc || undefined
      }
    ]);
    setInputMsg('');
    setAttachedDoc(null);
    setLoading(true);

    // Infer role from message or resume headline
    let inferredRole = 'Software Development Engineer (SDE)';
    const qLower = query.toLowerCase();
    if (/\b(sde|sde[- ]?[123]|software development engineer|software dev engineer)\b/.test(qLower)) {
      inferredRole = 'Software Development Engineer (SDE)';
    } else if (/\b(frontend|front-end|react|ui engineer)\b/.test(qLower)) {
      inferredRole = 'Frontend Engineer';
    } else if (/\b(backend|back-end|python developer|fastapi)\b/.test(qLower)) {
      inferredRole = 'Backend Engineer';
    } else if (resume?.analysis?.career_level) {
      inferredRole = resume.analysis.career_level;
    }

    try {
      const res = await sendChatMessage({
        message: query + (currentDoc ? ` [Attached ${currentDoc.type || 'file'}: ${currentDoc.name}]` : '') + (webSearch ? ' [Web Search: Active]' : ''),
        candidate_skills: resume?.analysis?.extracted_skills || ['Python', 'FastAPI', 'React', 'PostgreSQL', 'Docker'],
        target_role: inferredRole
      });

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: res?.content || 'Here are targeted recommendations from Aven.',
          perspectives: res?.perspectives
        }
      ]);
    } catch (e) {
      // Fallback
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `### 👨‍💻 Software Development Engineer (SDE) Role Guide\n\nAn **SDE** designs and scales core software applications, backend services, and APIs.\n\n* **Core Focus**: Data Structures & Algorithms, System Design (HLD/LLD), and Microservices.\n* **Career Tiers**: SDE-1 (Execution) ➔ SDE-2 (Ownership & LLD) ➔ SDE-3 (Distributed HLD).\n* **Interview Stages**: DSA Problem Solving (LeetCode) ➔ System Design ➔ STAR Behavioral.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const sizeMb = (f.size / (1024 * 1024)).toFixed(2);
      const sizeStr = f.size > 1024 * 1024 ? `${sizeMb} MB` : `${(f.size / 1024).toFixed(1)} KB`;
      const detected = detectAttachmentType(f.name, f.type);
      const objUrl = URL.createObjectURL(f);

      const newAtt: ChatAttachment = {
        name: f.name,
        size: sizeStr,
        type: detected,
        url: objUrl,
        file: f
      };

      if (detected === 'code' || detected === 'document' || f.type.startsWith('text/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          newAtt.textContent = event.target?.result as string;
          setAttachedDoc(newAtt);
        };
        reader.readAsText(f);
      } else {
        setAttachedDoc(newAtt);
      }

      setIsMenuOpen(false);
      e.target.value = '';
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        role: 'assistant',
        text: `👋 New conversation started. Ask Aven about skill gap analysis, STAR resume optimization, or system design!`
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      
      <input
        type="file"
        ref={fileRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.csv,.json,.md,.js,.ts,.py,*"
      />

      {/* Floating Toggle Bubble (Positioned on Left Side) */}
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

      {/* Floating Chat Drawer Window with Left Navigation Bar */}
      {isOpen && (
        <div className="w-[360px] sm:w-[440px] h-[520px] rounded-3xl bg-[#0B0F19]/95 backdrop-blur-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-scale-up">
          
          {/* Header */}
          <div className="p-3.5 bg-white/[0.04] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center p-0.5 shadow-md">
                <Bot className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Aven AI Copilot</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300">ChatGPT-4o</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Multi-AI Career Intelligence</div>
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

          {/* Body with Left ChatGPT-Style Navigation Strip + Right Chat Messages */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* Left Mini ChatGPT Navigation Strip */}
            <div className="w-14 bg-black/60 border-r border-white/10 flex flex-col items-center py-2.5 space-y-2 shrink-0">
              <button
                type="button"
                onClick={handleNewChat}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all group"
                title="New Chat"
              >
                <SquarePen className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              </button>
              <button
                type="button"
                onClick={() => handleSend('Aven, generate a visual system architecture diagram for scalable microservices.')}
                className="w-9 h-9 rounded-xl hover:bg-white/10 text-slate-400 hover:text-cyan-300 flex items-center justify-center transition-colors"
                title="Images & Architecture Diagrams"
              >
                <Images className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleSend('Aven, provide the STAR resume polish formula checklist.')}
                className="w-9 h-9 rounded-xl hover:bg-white/10 text-slate-400 hover:text-emerald-300 flex items-center justify-center transition-colors"
                title="Resource & STAR Library"
              >
                <Library className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleSend('Aven, schedule today\'s technical interview practice question.')}
                className="w-9 h-9 rounded-xl hover:bg-white/10 text-slate-400 hover:text-purple-300 flex items-center justify-center transition-colors"
                title="Scheduled Practice Drills"
              >
                <Clock className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleSend('Aven, calibrate my resume against ATS keyword benchmarks.')}
                className="w-9 h-9 rounded-xl hover:bg-white/10 text-slate-400 hover:text-amber-300 flex items-center justify-center transition-colors"
                title="AI Plugins (ATS Calibrator)"
              >
                <AtSign className="w-4 h-4" />
              </button>
              <div className="flex-1" />
              <button
                type="button"
                onClick={() => onOpenFullHub && onOpenFullHub()}
                className="w-9 h-9 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                title="Open Full AI Hub"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Right Chat Column */}
            <div className="flex-1 flex flex-col min-w-0">
              
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
                    <button
                      type="button"
                      onClick={() => {
                        const att: ChatAttachment = m.attachmentInfo || {
                          name: m.attached!,
                          type: detectAttachmentType(m.attached!),
                          size: 'Attached File'
                        };
                        setPreviewAttachment(att);
                      }}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/60 border border-white/20 hover:border-cyan-300 font-mono text-cyan-200 inline-flex items-center gap-1.5 transition-all text-left group/att cursor-pointer"
                      title="Click to open and preview file"
                    >
                      {(() => {
                        const t = m.attachmentInfo?.type || detectAttachmentType(m.attached!);
                        if (t === 'image') return <ImageIcon className="w-3 h-3 text-cyan-300" />;
                        if (t === 'video') return <Film className="w-3 h-3 text-emerald-300" />;
                        if (t === 'audio') return <Music className="w-3 h-3 text-purple-300" />;
                        if (t === 'code') return <FileCode className="w-3 h-3 text-amber-300" />;
                        return <Paperclip className="w-3 h-3 text-cyan-300" />;
                      })()}
                      <span className="truncate max-w-[140px] font-semibold">{m.attached}</span>
                      <Eye className="w-2.5 h-2.5 opacity-60 group-hover/att:opacity-100" />
                    </button>
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
            <div className="px-3 py-1.5 bg-cyan-950/80 border-t border-cyan-500/30 flex items-center justify-between text-[11px] text-cyan-300">
              <button
                type="button"
                onClick={() => setPreviewAttachment(attachedDoc)}
                className="flex items-center gap-1.5 truncate hover:text-white transition-colors"
                title="Click to preview file"
              >
                {attachedDoc.type === 'image' && <ImageIcon className="w-3 h-3 text-cyan-400 shrink-0" />}
                {attachedDoc.type === 'video' && <Film className="w-3 h-3 text-emerald-400 shrink-0" />}
                {attachedDoc.type === 'audio' && <Music className="w-3 h-3 text-purple-400 shrink-0" />}
                {attachedDoc.type === 'code' && <FileCode className="w-3 h-3 text-amber-400 shrink-0" />}
                {(attachedDoc.type === 'pdf' || attachedDoc.type === 'document' || attachedDoc.type === 'other') && (
                  <Paperclip className="w-3 h-3 shrink-0" />
                )}
                <span className="truncate max-w-[200px]">{attachedDoc.name}</span>
                <span className="text-[9px] opacity-75 font-mono">({attachedDoc.size})</span>
                <Eye className="w-3 h-3 opacity-80" />
              </button>
              <button
                type="button"
                onClick={() => setAttachedDoc(null)}
                className="hover:text-white p-0.5"
                title="Remove attachment"
              >
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
                <span>Add files, photos or videos</span>
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
          </div>

        </div>
      )}

      {/* Media & Document Viewer Modal */}
      {previewAttachment && (
        <ChatAttachmentViewerModal
          attachment={previewAttachment}
          onClose={() => setPreviewAttachment(null)}
          onNavigateToTab={() => {
            setIsOpen(false);
            if (onOpenFullHub) onOpenFullHub();
          }}
          onAskAvenAboutFile={(fileName) => {
            handleSend(`Aven, analyze the attached file "${fileName}" and provide key recommendations.`);
          }}
        />
      )}
    </div>
  );
};
