import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, KeyRound, Sparkles, RefreshCw } from 'lucide-react';
import { User } from '../types';
import { login } from '../services/authService';
import { ApiError } from '../services/api';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  onNavigateToSignup: () => void;
  onBackToEvents: () => void;
}

export default function LoginView({
  onLoginSuccess,
  onNavigateToSignup,
  onBackToEvents
}: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const apiUser = await login(email, password);
      onLoginSuccess({
        id: apiUser._id,
        name: apiUser.name,
        email: apiUser.email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
        status: 'Dreamer',
        memberSince: 'Member since 2026',
        festivalCount: 0,
        upcomingCount: 0,
      });
    } catch (err) {
      setErrorMsg(err instanceof ApiError ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] px-6 select-none relative z-10 mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="glass-panel rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[150px] h-[150px] bg-[#b76dff] opacity-10 blur-2xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[180px] h-[180px] bg-[#38bdf8] opacity-10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex p-3 bg-white/5 rounded-full border border-white/10 mb-4 animate-bounce">
            <Sparkles className="w-6 h-6 text-[#38bdf8]" />
          </div>
          <h1 className="font-display font-extrabold text-[#dae2fd] text-2xl md:text-3xl tracking-tight mb-2 uppercase">
            Welcome Back, <span className="text-[#38bdf8]">Dreamer</span>
          </h1>
          <p className="text-sm font-sans text-[#cfc2d6] leading-relaxed">
            Sign in to reserve seats and manage your bookings.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 text-xs font-semibold p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold tracking-wider text-[#cfc2d6] uppercase ml-1 block" htmlFor="email-input">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                id="email-input"
                type="email"
                className="w-full bg-[#131b2e]/60 border border-[#4d4354]/40 rounded-xl py-4 pl-12 pr-4 text-[#dae2fd] placeholder:text-slate-500 text-sm focus:border-[#b76dff] focus:ring-1 focus:ring-[#b76dff] transition-all outline-none"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold tracking-wider text-[#cfc2d6] uppercase ml-1 block" htmlFor="password-input">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                className="w-full bg-[#131b2e]/60 border border-[#4d4354]/40 rounded-xl py-4 pl-12 pr-12 text-[#dae2fd] placeholder:text-slate-500 text-sm focus:border-[#b76dff] focus:ring-1 focus:ring-[#b76dff] transition-all outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ddb7ff] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 electric-gradient text-[#0b1326] hover:brightness-110 active:scale-[0.98] py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-200 shadow-xl shadow-[#b76dff]/15 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Signing in...</>
            ) : (
              <><KeyRound className="w-4 h-4" /> Sign In</>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm font-sans text-[#cfc2d6]">
            Don&apos;t have an account?{' '}
            <button type="button" onClick={onNavigateToSignup} className="text-[#38bdf8] font-semibold hover:underline">
              Sign Up
            </button>
          </p>
          <button type="button" onClick={onBackToEvents} className="text-xs text-slate-400 hover:text-white mt-4 font-semibold">
            ← Browse events without signing in
          </button>
        </div>
      </div>
    </div>
  );
}
