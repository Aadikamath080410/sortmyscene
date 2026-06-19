import React, { useState } from 'react';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, ArrowRight, RefreshCw } from 'lucide-react';
import { User } from '../types';
import { register } from '../services/authService';
import { ApiError } from '../services/api';

interface SignUpViewProps {
  onSignupSuccess: (user: User) => void;
  onNavigateToLogin: () => void;
  onBackToEvents: () => void;
}

export default function SignUpView({
  onSignupSuccess,
  onNavigateToLogin,
  onBackToEvents
}: SignUpViewProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) { setErrorMsg('Please enter your name.'); return; }
    if (!email) { setErrorMsg('Please enter your email.'); return; }
    if (!password || password.length < 6) { setErrorMsg('Password must be at least 6 characters.'); return; }
    if (!agreed) { setErrorMsg('Please accept the terms of service.'); return; }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const apiUser = await register(fullName, email, password);
      onSignupSuccess({
        id: apiUser._id,
        name: apiUser.name,
        email: apiUser.email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
        status: 'Dreamer',
        memberSince: 'Registered 2026',
        festivalCount: 0,
        upcomingCount: 0,
      });
    } catch (err) {
      setErrorMsg(err instanceof ApiError ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] px-6 select-none relative z-10 mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="glass-panel rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-20%] w-[150px] h-[150px] bg-[#38bdf8] opacity-10 blur-2xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[180px] h-[180px] bg-[#b76dff] opacity-10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex p-3 bg-white/5 rounded-full border border-white/10 mb-4 animate-bounce">
            <UserIcon className="w-6 h-6 text-[#b76dff]" />
          </div>
          <h1 className="font-display font-extrabold text-[#dae2fd] text-2xl md:text-3xl tracking-tight mb-2 uppercase">
            Join the <span className="text-[#b76dff]">Pulse</span>
          </h1>
          <p className="text-sm font-sans text-[#cfc2d6] leading-relaxed">
            Create an account to reserve and book event seats.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 text-xs font-semibold p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold tracking-wider text-[#cfc2d6] uppercase ml-1 block" htmlFor="signup-name">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input id="signup-name" type="text" className="w-full bg-[#131b2e]/60 border border-[#4d4354]/40 rounded-xl py-4 pl-12 pr-4 text-[#dae2fd] placeholder:text-slate-500 text-sm focus:border-[#b76dff] focus:ring-1 focus:ring-[#b76dff] transition-all outline-none" placeholder="Alex Rivera" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isLoading} />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold tracking-wider text-[#cfc2d6] uppercase ml-1 block" htmlFor="signup-email">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input id="signup-email" type="email" className="w-full bg-[#131b2e]/60 border border-[#4d4354]/40 rounded-xl py-4 pl-12 pr-4 text-[#dae2fd] placeholder:text-slate-500 text-sm focus:border-[#b76dff] focus:ring-1 focus:ring-[#b76dff] transition-all outline-none" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold tracking-wider text-[#cfc2d6] uppercase ml-1 block" htmlFor="signup-password">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input id="signup-password" type={showPassword ? 'text' : 'password'} className="w-full bg-[#131b2e]/60 border border-[#4d4354]/40 rounded-xl py-4 pl-12 pr-12 text-[#dae2fd] placeholder:text-slate-500 text-sm focus:border-[#b76dff] focus:ring-1 focus:ring-[#b76dff] transition-all outline-none" placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ddb7ff] transition-colors">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-2 text-left">
            <input id="signup-terms" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-5 h-5 mt-0.5 rounded border-[#4d4354]/40 bg-[#131b2e]/60 text-[#b76dff] cursor-pointer" disabled={isLoading} />
            <label htmlFor="signup-terms" className="text-xs font-sans text-[#cfc2d6] leading-snug cursor-pointer">
              I agree to the Terms of Service and Privacy Policy.
            </label>
          </div>

          <button type="submit" disabled={isLoading} className="w-full mt-4 electric-gradient text-[#0b1326] hover:brightness-110 active:scale-[0.98] py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-200 shadow-xl shadow-[#b76dff]/15 flex items-center justify-center gap-2 disabled:opacity-60">
            {isLoading ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Creating account...</>
            ) : (
              <>Create Account <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm font-sans text-[#cfc2d6]">
            Already have an account?{' '}
            <button type="button" onClick={onNavigateToLogin} className="text-[#38bdf8] font-semibold hover:underline">Sign In</button>
          </p>
          <button type="button" onClick={onBackToEvents} className="text-xs text-slate-400 hover:text-white mt-4 font-semibold">
            ← Back to events
          </button>
        </div>
      </div>
    </div>
  );
}
