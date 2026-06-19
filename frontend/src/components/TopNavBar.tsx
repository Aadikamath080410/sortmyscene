import React from 'react';
import { User } from '../types';
import { Sparkles, LogIn, UserPlus, LogOut, Ticket, Bell, Flame, Home, User as UserIcon, Music, Eye, Wallet, MapPin } from 'lucide-react';

interface TopNavBarProps {
  user: User | null;
  currentView: string;
  onNavigate: (view: 'home' | 'events' | 'venues' | 'event-details' | 'seat-selection' | 'my-tickets' | 'login' | 'signup') => void;
  onLogOut: () => void;
  onShowNotification: (msg: string) => void;
  walletAddress: string | null;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  isWalletConnecting: boolean;
}

export default function TopNavBar({
  user,
  currentView,
  onNavigate,
  onLogOut,
  onShowNotification,
  walletAddress,
  onConnectWallet,
  onDisconnectWallet,
  isWalletConnecting
}: TopNavBarProps) {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [pulseChecked, setPulseChecked] = React.useState(false);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#0b1326]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_20px_rgba(183,109,255,0.1)]">
        <nav className="flex justify-between items-center h-20 px-3 sm:px-6 md:px-12 max-w-7xl mx-auto">
        {/* Logo */}
        <div 
          onClick={() => onNavigate('home')}
          className="font-black italic text-lg sm:text-2xl tracking-tighter text-[#ddb7ff] drop-shadow-[0_0_8px_rgba(221,183,255,0.5)] cursor-pointer hover:scale-105 transition-transform duration-200 uppercase"
        >
          NEONBEAT
        </div>

        {/* Navigation links for big screens */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <button 
            onClick={() => onNavigate('home')}
            className={`font-semibold text-xs lg:text-sm uppercase tracking-wider transition-all duration-200 pb-1 ${
              currentView === 'home' 
                ? 'text-[#ddb7ff] border-b-2 border-[#ddb7ff]' 
                : 'text-[#cfc2d6] hover:text-[#ddb7ff]'
            }`}
          >
            Home
          </button>

          <button 
            onClick={() => onNavigate('events')}
            className={`font-semibold text-xs lg:text-sm uppercase tracking-wider transition-all duration-200 pb-1 ${
              currentView === 'events' 
                ? 'text-[#ddb7ff] border-b-2 border-[#ddb7ff]' 
                : 'text-[#cfc2d6] hover:text-[#ddb7ff]'
            }`}
          >
            Lineup
          </button>

          <button 
            onClick={() => onNavigate('venues')}
            className={`font-semibold text-xs lg:text-sm uppercase tracking-wider transition-all duration-200 pb-1 ${
              currentView === 'venues' 
                ? 'text-[#ddb7ff] border-b-2 border-[#ddb7ff]' 
                : 'text-[#cfc2d6] hover:text-[#ddb7ff]'
            }`}
          >
            Venues
          </button>
        </div>

        {/* Actions / Auth states */}
        <div className="flex items-center gap-2 sm:gap-4 font-mono">
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-3 font-sans">
              {/* User Avatar & Dreamer Tag */}
              <div 
                onClick={() => onNavigate('my-tickets')}
                className="hidden sm:flex flex-col items-end text-right cursor-pointer group"
              >
                <span className="font-bold text-sm text-white group-hover:text-[#ddb7ff] transition-colors">{user.name}</span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#38bdf8] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" /> {user.status} Status
                </span>
              </div>

              <div 
                onClick={() => onNavigate('my-tickets')}
                className="w-10 h-10 rounded-full border-2 border-[#ddb7ff] overflow-hidden cursor-pointer hover:border-white transition-all shadow-[0_0_10px_rgba(183,109,255,0.4)]"
              >
                <img referrerPolicy="no-referrer" src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              </div>

              <button 
                onClick={onLogOut}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-full transition-all"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-3 font-sans">
              <button 
                onClick={() => onNavigate('login')}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 font-semibold text-sm text-[#cfc2d6] hover:text-white transition-all"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
              
              <button 
                onClick={() => onNavigate('signup')}
                className="electric-gradient text-[#0b1326] scale-100 hover:scale-105 active:scale-95 duration-200 px-3.5 sm:px-6 py-2 rounded-full font-bold text-[10px] sm:text-xs uppercase tracking-wider shadow-lg shadow-[#b76dff]/20 flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Get Passes
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>

    {/* FLOAT MOBILE NAVIGATION DOCK */}
    <div className="md:hidden fixed bottom-5 left-4 right-4 z-50 bg-[#0e1627]/90 backdrop-blur-2xl border border-white/10 rounded-2xl py-3 px-4 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_15px_rgba(183,109,255,0.15)] flex justify-around items-center">
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center gap-1 transition-all ${
          currentView === 'home' ? 'text-[#ddb7ff] scale-110' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[9px] font-mono font-medium">Home</span>
      </button>

      <button
        onClick={() => onNavigate('events')}
        className={`flex flex-col items-center gap-1 transition-all ${
          currentView === 'events' ? 'text-[#ddb7ff] scale-110' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Music className="w-5 h-5" />
        <span className="text-[9px] font-mono font-medium">Lineup</span>
      </button>

      <button
        onClick={() => onNavigate('venues')}
        className={`flex flex-col items-center gap-1 transition-all ${
          currentView === 'venues' ? 'text-[#ddb7ff] scale-110' : 'text-slate-400 hover:text-white'
        }`}
      >
        <MapPin className="w-5 h-5" />
        <span className="text-[9px] font-mono font-medium">Venues</span>
      </button>

      <button
        onClick={() => {
          if (!user) {
            onShowNotification("Please sign in to view your tickets.");
            onNavigate('login');
          } else {
            onNavigate('my-tickets');
          }
        }}
        className={`flex flex-col items-center gap-1 transition-all ${
          currentView === 'my-tickets' ? 'text-[#ddb7ff] scale-110' : 'text-slate-400 hover:text-white'
        }`}
      >
        <UserIcon className="w-5 h-5" />
        <span className="text-[9px] font-mono font-medium font-semibold">Profile</span>
      </button>
    </div>
  </>
  );
}
