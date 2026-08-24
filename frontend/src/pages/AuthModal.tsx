import React, { useState } from 'react';
import { X, User, Briefcase, KeyRound, Sparkles, CheckCircle2, ArrowLeft, ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react';
type UserRole = 'candidate' | 'recruiter';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, role: UserRole, name?: string, password?: string) => Promise<void>;
  onRegister: (email: string, role: UserRole, name: string, password?: string) => Promise<void>;
  onResetPassword?: (email: string, newPassword: string) => Promise<void>;
  onQuickDemo: (role: UserRole) => void;
}

type AuthMode = 'login' | 'register' | 'forgot_password';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  onResetPassword,
  onQuickDemo
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<UserRole>('candidate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (authMode === 'forgot_password') {
      if (!password || password.length < 6) {
        setError('New password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify.');
        return;
      }

      setLoading(true);
      try {
        if (onResetPassword) {
          await onResetPassword(email, password);
        } else {
          await onLogin(email, role, name, password);
        }
        setSuccessMsg('Password successfully updated! Logging you in...');
        setTimeout(() => {
          onClose();
        }, 1200);
      } catch (err: any) {
        setError(err.message || 'Failed to update password. Please check your email.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (authMode === 'register' && !name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }

    setLoading(true);
    try {
      if (authMode === 'login') {
        await onLogin(email, role, undefined, password);
      } else {
        await onRegister(email, role, name, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToForgot = () => {
    setError('');
    setSuccessMsg('');
    setPassword('');
    setConfirmPassword('');
    setAuthMode('forgot_password');
  };

  const handleSwitchToLogin = () => {
    setError('');
    setSuccessMsg('');
    setPassword('');
    setConfirmPassword('');
    setAuthMode('login');
  };

  const handleSwitchToRegister = () => {
    setError('');
    setSuccessMsg('');
    setPassword('');
    setConfirmPassword('');
    setAuthMode('register');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="luma-card max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-white/15">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-slate-300 font-mono text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>HireSense Intelligent Access</span>
          </div>
          <h2 className="text-2xl font-black text-white font-sans">
            {authMode === 'login' && 'Sign In to HireSense'}
            {authMode === 'register' && 'Create Your Account'}
            {authMode === 'forgot_password' && 'Reset Your Password'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {authMode === 'login' && 'Access precision candidate rankings & ATS intelligence'}
            {authMode === 'register' && 'Join candidates and engineering recruiters'}
            {authMode === 'forgot_password' && 'Enter your email and create a new secure password'}
          </p>
        </div>

        {authMode === 'login' && (
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-3">
            <span className="block text-xs font-semibold text-slate-300 text-center uppercase tracking-widest font-mono">
              ⚡ 1-Click Demo Account Sign In
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { onQuickDemo('candidate'); onClose(); }}
                className="btn-luma-primary !min-h-[40px] !text-xs !py-2 !px-3"
              >
                <User className="w-4 h-4 text-black" /> Candidate Demo
              </button>
              <button
                onClick={() => { onQuickDemo('recruiter'); onClose(); }}
                className="btn-luma-glass !min-h-[40px] !text-xs !py-2 !px-3"
              >
                <Briefcase className="w-4 h-4 text-white" /> Recruiter Demo
              </button>
            </div>
          </div>
        )}

        {/* Error Banner with Direct "Forgot Password?" Action Link */}
        {error && (
          <div className="p-3.5 text-xs font-semibold rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 space-y-1.5 text-center shadow-lg animate-fade-in">
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
          <div className="p-3.5 text-xs font-semibold rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center gap-2 shadow-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Role</label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-white/[0.04] border border-white/10">
                <button
                  type="button"
                  onClick={() => setRole('candidate')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    role === 'candidate' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    role === 'recruiter' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Recruiter
                </button>
              </div>
            </div>
          )}

          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {role === 'candidate' ? 'Full Name' : 'Company Name'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'candidate' ? 'Alex Chen' : 'Tech Innovations Inc.'}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">
                {authMode === 'forgot_password' ? 'New Password' : 'Password'}
              </label>
              {authMode === 'login' && (
                <button
                  type="button"
                  onClick={handleSwitchToForgot}
                  className="text-[11px] text-cyan-300 hover:underline font-medium"
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
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* Confirm Password Field (Only in Forgot Password Mode) */}
          {authMode === 'forgot_password' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-luma-primary !h-12 !text-sm !w-full"
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
                className="text-cyan-300 hover:underline font-semibold inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
              <button
                type="button"
                onClick={handleSwitchToRegister}
                className="text-slate-400 hover:text-white font-medium"
              >
                Create Account
              </button>
            </div>
          ) : authMode === 'register' ? (
            <button
              type="button"
              onClick={handleSwitchToLogin}
              className="text-cyan-300 hover:underline font-semibold"
            >
              Already have an account? Sign In
            </button>
          ) : (
            <div className="space-y-1">
              <button
                type="button"
                onClick={handleSwitchToRegister}
                className="text-cyan-300 hover:underline font-semibold block mx-auto"
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
