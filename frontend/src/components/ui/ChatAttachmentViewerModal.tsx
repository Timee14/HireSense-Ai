import React, { useState } from 'react';
import {
  X, Download, ExternalLink, FileText, Image as ImageIcon,
  Film, Music, Code, Eye, ZoomIn, ZoomOut, RotateCw,
  Sparkles, FileCode, Check, Copy, ArrowRight, Play, Maximize2
} from 'lucide-react';

export interface ChatAttachment {
  name: string;
  size?: string;
  type?: 'image' | 'video' | 'audio' | 'pdf' | 'code' | 'document' | 'other';
  url?: string;
  file?: File;
  textContent?: string;
}

export function detectAttachmentType(fileName: string, mimeType?: string): 'image' | 'video' | 'audio' | 'pdf' | 'code' | 'document' | 'other' {
  if (mimeType) {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.includes('json') || mimeType.includes('javascript') || mimeType.includes('typescript')) return 'code';
  }

  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'avif', 'ico'].includes(ext)) return 'image';
  if (['mp4', 'webm', 'ogg', 'mov', 'm4v', 'mkv', 'avi'].includes(ext)) return 'video';
  if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(ext)) return 'audio';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'cs', 'go', 'rs', 'php', 'html', 'css', 'json', 'md', 'sql', 'sh', 'yml', 'yaml', 'xml', 'env'].includes(ext)) return 'code';
  if (['doc', 'docx', 'txt', 'rtf', 'csv', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)) return 'document';
  return 'other';
}

interface ChatAttachmentViewerModalProps {
  attachment: ChatAttachment | null;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
  onAskAvenAboutFile?: (fileName: string) => void;
}

export const ChatAttachmentViewerModal: React.FC<ChatAttachmentViewerModalProps> = ({
  attachment,
  onClose,
  onNavigateToTab,
  onAskAvenAboutFile
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  if (!attachment) return null;

  const fileType = attachment.type || detectAttachmentType(attachment.name);
  const fileExt = attachment.name.split('.').pop()?.toUpperCase() || 'FILE';

  const handleDownload = () => {
    if (attachment.url) {
      const a = document.createElement('a');
      a.href = attachment.url;
      a.download = attachment.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (attachment.textContent) {
      const blob = new Blob([attachment.textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Create mock file content download for demo/history files
      const content = `HireSense AI Document Preview: ${attachment.name}\nGenerated & Analyzed with Aven AI.\n\nTarget File: ${attachment.name}\nStatus: Verified ATS Indexed\nExtracted Skills: Python, React, TypeScript, FastAPI, Cloud Microservices, PostgreSQL\nSummary: High-impact technical deliverable parsed by HireSense AI platform.`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleOpenInNewTab = () => {
    if (attachment.url) {
      window.open(attachment.url, '_blank');
    } else {
      handleDownload();
    }
  };

  const handleCopyText = () => {
    if (attachment.textContent) {
      navigator.clipboard.writeText(attachment.textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div 
        className="w-full max-w-4xl max-h-[92vh] bg-[#0C101B] border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Navigation Bar */}
        <div className="px-5 py-4 bg-white/[0.04] border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
              {fileType === 'image' && <ImageIcon className="w-5 h-5 text-cyan-400" />}
              {fileType === 'video' && <Film className="w-5 h-5 text-emerald-400" />}
              {fileType === 'audio' && <Music className="w-5 h-5 text-purple-400" />}
              {fileType === 'pdf' && <FileText className="w-5 h-5 text-rose-400" />}
              {fileType === 'code' && <FileCode className="w-5 h-5 text-amber-400" />}
              {(fileType === 'document' || fileType === 'other') && <FileText className="w-5 h-5 text-blue-400" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white truncate">{attachment.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-cyan-300 border border-white/10 uppercase shrink-0">
                  {fileExt}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {attachment.size || 'Attachment'} • {fileType.toUpperCase()} Preview
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 shrink-0">
            {fileType === 'image' && (
              <div className="hidden sm:flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 mr-1">
                <button
                  type="button"
                  onClick={() => setZoom(prev => Math.max(0.5, prev - 0.25))}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-slate-400 px-1">{Math.round(zoom * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setZoom(prev => Math.min(3, prev + 0.25))}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation(prev => (prev + 90) % 360)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                  title="Rotate 90°"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleDownload}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
              title="Download File"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleOpenInNewTab}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
              title="Open in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/10 transition-colors"
              title="Close Preview (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#080B11]/70 flex flex-col items-center justify-center min-h-[360px] max-h-[68vh] relative">
          
          {/* IMAGE VIEWER */}
          {fileType === 'image' && (
            <div className="w-full h-full flex items-center justify-center overflow-auto p-2">
              <img
                src={attachment.url || `https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80`}
                alt={attachment.name}
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease-in-out'
                }}
                className="max-h-[58vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10 bg-black/40"
              />
            </div>
          )}

          {/* VIDEO PLAYER */}
          {fileType === 'video' && (
            <div className="w-full max-w-3xl flex flex-col items-center justify-center">
              <video
                src={attachment.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                controls
                autoPlay
                playsInline
                className="w-full max-h-[58vh] rounded-2xl shadow-2xl border border-white/15 bg-black"
              >
                Your browser does not support HTML5 video streaming.
              </video>
            </div>
          )}

          {/* AUDIO PLAYER */}
          {fileType === 'audio' && (
            <div className="w-full max-w-lg p-6 rounded-3xl bg-white/[0.04] border border-white/15 shadow-2xl space-y-6 text-center">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg animate-pulse">
                <Music className="w-10 h-10 text-white" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{attachment.name}</h4>
                <p className="text-xs text-purple-300 font-mono mt-1">Audio Recording & Speech Clip</p>
              </div>
              <audio
                src={attachment.url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'}
                controls
                autoPlay
                className="w-full"
              >
                Your browser does not support HTML5 audio.
              </audio>
            </div>
          )}

          {/* PDF DOCUMENT VIEWER */}
          {fileType === 'pdf' && (
            <div className="w-full h-full flex flex-col items-center">
              {attachment.url ? (
                <iframe
                  src={attachment.url}
                  title={attachment.name}
                  className="w-full h-[58vh] rounded-2xl border border-white/15 bg-white shadow-2xl"
                />
              ) : (
                /* Sleek Structured ATS Resume Preview for candidate PDF files */
                <div className="w-full max-w-2xl bg-[#0F1423] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        PDF DOCUMENT
                      </span>
                      <h4 className="text-base font-extrabold text-white mt-1.5">{attachment.name}</h4>
                      <p className="text-xs text-slate-400">Verified Candidate Resume & Engineering Portfolio</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-400 font-mono">94% ATS Match</div>
                      <div className="text-[10px] text-slate-400 font-mono">Calibrated Profile</div>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-slate-300 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" /> Extracted Executive Summary
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Senior Software Development Engineer with extensive experience architecting high-throughput distributed microservices, scalable async APIs with FastAPI & Node.js, and modern reactive frontends with React & TypeScript.
                    </p>

                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-slate-400 block mb-1 font-mono uppercase tracking-wider">
                        Core Competencies & Stack
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {['Python', 'FastAPI', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS ECS', 'System Design', 'Redis', 'pgvector', 'Kubernetes'].map(skill => (
                          <span key={skill} className="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-400 font-mono">Page 1 of 1 • Ready for ATS Screening</span>
                    {onNavigateToTab && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onNavigateToTab('resume_analyzer');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold inline-flex items-center gap-1.5 transition-all"
                      >
                        <span>Open in Resume Analyzer</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CODE / TEXT VIEWER */}
          {fileType === 'code' && (
            <div className="w-full h-full max-h-[58vh] flex flex-col bg-[#050810] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-2.5 bg-white/[0.04] border-b border-white/10 flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-300 font-semibold flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  {attachment.name}
                </span>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white inline-flex items-center gap-1 font-mono text-[11px] transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-cyan-500/30">
                {attachment.textContent || `// File: ${attachment.name}
// Analyzed by Aven AI Code Reviewer

export interface UserSession {
  id: string;
  role: 'admin' | 'candidate';
  skills: string[];
}

export async function processPipeline(payload: UserSession) {
  console.log("Analyzing ATS metrics for candidate", payload.id);
  return { status: 200, score: 98.4 };
}`}
              </pre>
            </div>
          )}

          {/* GENERIC DOCUMENT / SPREADSHEET / OTHER */}
          {(fileType === 'document' || fileType === 'other') && (
            <div className="w-full max-w-lg p-6 rounded-3xl bg-white/[0.04] border border-white/15 shadow-2xl space-y-4 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{attachment.name}</h4>
                <p className="text-xs text-slate-400 mt-1 font-mono">{attachment.size || 'Document File'} • Ready to review</p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 text-left space-y-2">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Aven Document Intelligence
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  This file is attached to your active Aven AI session. You can ask Aven to summarize, parse keywords, check technical specs, or optimize resume formatting from this file.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenInNewTab}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 text-xs font-bold inline-flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open File</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer with "Ask Aven About This File" Shortcut */}
        <div className="px-5 py-3.5 bg-white/[0.03] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">
            ⚡ Click anywhere outside or press <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-white font-mono text-[10px]">Esc</kbd> to close
          </span>

          {onAskAvenAboutFile && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onAskAvenAboutFile(attachment.name);
              }}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 hover:from-cyan-500/30 hover:to-emerald-500/30 border border-cyan-500/40 text-cyan-300 font-bold inline-flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ask Aven to analyze "{attachment.name}"</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
