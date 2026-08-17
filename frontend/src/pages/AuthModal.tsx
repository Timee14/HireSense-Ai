import React, { useState } from 'react';
import { X, User, Briefcase, Mail, Lock, Sparkles, KeyRound, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, pass: string) => Promise<void>;
  onRegister: (email: string, pass: string, role: 'candidate' | 'recruiter', name: string) => Promise<void>;
  onResetPassword?: (email: string, newPass: string) => Promise<void>;
  onQuickDemo: (role: 'candidate' | 'recruiter') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  onResetPassword,
  onQuickDemo
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot_password'>('login');
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (authMode === 'forgot_password') {
        if (password.length < 4) {
          setError('Password must be at least 4 characters');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match. Please re-enter.');
          setLoading(false);
          return;
        }
        if (onResetPassword) {
          await onResetPassword(email, password);
        }
        setSuccessMsg('Password updated successfully! Logging you in...');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else if (authMode === 'register') {
        await onRegister(email, password, role, name);
        onClose();
      } else {
        await onLogin(email, password);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToForgot = () => {
    setError('');
    setSuccessMsg('');
    setAuthMode('forgot_password');
  };

  const handleSwitchToLogin = () => {
    setError('');
    setSuccessMsg('');
    setAuthMode('login');
  };

  const handleSwitchToRegister = () => {
    setError('');
    setSuccessMsg('');
    setAuthMode('register');
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
            {authMode === 'forgot_password' ? (
              <KeyRound className="w-7 h-7" />
            ) : (
              <Sparkles className="w-7 h-7" />
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit">
            {authMode === 'forgot_password'
              ? 'Reset Your Password'
              : authMode === 'register'
              ? 'Create Account'
              : 'Sign In to HireSense'}
          </h2>
          <p className="text-xs text-emerald-100/70 font-medium">
            {authMode === 'forgot_password'
              ? 'Enter your email and create a new password to restore instant access.'
              : 'AI-Powered Resume Analysis & Talent Screening Command Center'}
          </p>
        </div>

        {/* Quick Demo Presets (Only in Login Mode) */}
        {authMode === 'login' && (
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
        )}

        {/* Error Banner with Direct "Forgot Password?" Action Link */}
        {error && (
          <div className="p-3.5 text-xs font-bold rounded-xl bg-rose-950/90 border border-rose-500/60 text-rose-200 space-y-1.5 text-center shadow-lg animate-fade-in">
            <div>{error}</div>
            {authMode === 'login' && (
              <div className="pt-1 border-t border-rose-500/30">
                <button
                  type="button"
                  onClick={handleSwitchToForgot}
                  className="text-amber-300 hover:text-white underline inline-flex items-center gap-1 font-bold"
                >
                  <span>Forgot your password? Reset it here</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Success Banner */}
        {successMsg && (
          <div className="p-3.5 text-xs font-bold rounded-xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 flex items-center justify-center gap-2 shadow-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {authMode === 'register' && (
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

          {authMode === 'register' && (
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

          {/* Email Address */}
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

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-emerald-100/90">
                {authMode === 'forgot_password' ? 'New Password' : 'Password'}
              </label>
              {authMode === 'login' && (
                <button
                  type="button"
                  onClick={handleSwitchToForgot}
                  className="text-[11px] text-[#34d399] hover:underline font-bold"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={authMode === 'forgot_password' ? 'Enter new password' : '••••••••'}
              className="w-full px-4 py-2.5 rounded-xl bg-[#022c22] border border-[#34d399]/30 text-xs text-white placeholder-emerald-100/40 focus:outline-none focus:border-[#34d399]"
            />
          </div>

          {/* Confirm Password Field (Only in Forgot Password Mode) */}
          {authMode === 'forgot_password' && (
            <div>
              <label className="block text-xs font-bold text-emerald-100/90 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-4 py-2.5 rounded-xl bg-[#022c22] border border-[#34d399]/30 text-xs text-white placeholder-emerald-100/40 focus:outline-none focus:border-[#34d399]"
              />
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-sky-blue !h-12 !text-sm !w-full"
          >
            {loading
              ? 'Processing...'
              : authMode === 'forgot_password'
              ? 'Update Password & Sign In'
              : authMode === 'register'
              ? 'Create Account'
              : 'Sign In Now'}
          </button>
        </form>

        {/* Footer Navigation Links */}
        <div className="text-center pt-2 space-y-2 text-xs">
          {authMode === 'forgot_password' ? (
            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={handleSwitchToLogin}
                className="text-[#34d399] hover:underline font-bold inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
              <button
                type="button"
                onClick={handleSwitchToRegister}
                className="text-emerald-100/70 hover:text-white font-bold"
              >
                Create Account
              </button>
            </div>
          ) : authMode === 'register' ? (
            <button
              type="button"
              onClick={handleSwitchToLogin}
              className="text-[#34d399] hover:underline font-bold"
            >
              Already have an account? Sign In
            </button>
          ) : (
            <div className="space-y-1">
              <button
                type="button"
                onClick={handleSwitchToRegister}
                className="text-[#34d399] hover:underline font-bold block mx-auto"
              >
                Don't have an account? Register Now
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
