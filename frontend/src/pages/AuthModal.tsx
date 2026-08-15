import React, { useState } from 'react';
import { X, User, Briefcase, Mail, Lock, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, pass: string) => Promise<void>;
  onRegister: (email: string, pass: string, role: 'candidate' | 'recruiter', name: string) => Promise<void>;
  onQuickDemo: (role: 'candidate' | 'recruiter') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  onQuickDemo
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await onRegister(email, password, role, name);
      } else {
        await onLogin(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#022c22]/85 backdrop-blur-md animate-fadeIn text-white">
      <div className="relative w-full max-w-lg bg-[#042f26] p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl space-y-4 sm:space-y-6 border border-[#34d399]/40 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-emerald-100/70 hover:text-white transition-colors p-2 rounded-full bg-[#022c22] border border-[#34d399]/30"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-[#064e3b] border border-[#34d399]/40 text-[#34d399]">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-outfit">
            {isRegister ? 'Create Account' : 'Sign In to HireSense'}
          </h2>
          <p className="text-xs text-emerald-100/70 font-medium">
            AI-Powered Resume Analysis & Talent Screening Command Center
          </p>
        </div>

        {/* Quick Demo Presets */}
        <div className="p-4 rounded-xl bg-[#022c22] border border-[#34d399]/30 space-y-3">
          <span className="block text-xs font-bold text-[#34d399] text-center uppercase tracking-widest font-mono">
            ⚡ 1-Click Demo Account Sign In
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { onQuickDemo('candidate'); onClose(); }}
              className="px-4 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#34d399] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <User className="w-4 h-4 text-white" /> Candidate Demo
            </button>
            <button
              onClick={() => { onQuickDemo('recruiter'); onClose(); }}
              className="px-4 py-2.5 rounded-xl bg-[#0ea5e9] hover:bg-[#38bdf8] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Briefcase className="w-4 h-4 text-white" /> Recruiter Demo
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 text-xs font-bold rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-emerald-100/90 mb-1">Select Role</label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#022c22] border border-[#34d399]/30">
                <button
                  type="button"
                  onClick={() => setRole('candidate')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    role === 'candidate' ? 'bg-[#10b981] text-white shadow-sm' : 'text-emerald-100/70'
                  }`}
                >
                  Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    role === 'recruiter' ? 'bg-[#0ea5e9] text-white shadow-sm' : 'text-emerald-100/70'
                  }`}
                >
                  Recruiter
                </button>
              </div>
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-emerald-100/90 mb-1">
                {role === 'candidate' ? 'Full Name' : 'Company Name'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'candidate' ? 'Alex Chen' : 'Tech Innovations Inc.'}
                className="w-full px-4 py-2.5 rounded-xl bg-[#022c22] border border-[#34d399]/30 text-xs text-white placeholder-emerald-100/40 focus:outline-none focus:border-[#34d399]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-emerald-100/90 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-[#022c22] border border-[#34d399]/30 text-xs text-white placeholder-emerald-100/40 focus:outline-none focus:border-[#34d399]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-100/90 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-[#022c22] border border-[#34d399]/30 text-xs text-white placeholder-emerald-100/40 focus:outline-none focus:border-[#34d399]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-sky-blue !h-12 !text-sm !w-full"
          >
            {loading ? 'Authenticating...' : (isRegister ? 'Create Account' : 'Sign In Now')}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-[#34d399] hover:underline font-bold"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register Now"}
          </button>
        </div>

      </div>
    </div>
  );
};
