import React from 'react';
import { motion } from 'motion/react';
import { MusicEvent, User } from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  Music, 
  MapPin, 
  Calendar, 
  Volume2, 
  CheckCircle, 
  Zap, 
  ShieldCheck, 
  Users, 
  Heart,
  Sliders,
  Eye,
  Disc
} from 'lucide-react';

interface HomeViewProps {
  events: MusicEvent[];
  user: User | null;
  onSelectEvent: (event: MusicEvent) => void;
  onNavigate: (view: 'home' | 'events' | 'seat-selection' | 'my-tickets' | 'login' | 'signup') => void;
  onLogOut: () => void;
}

export default function HomeView({ events, user, onSelectEvent, onNavigate, onLogOut }: HomeViewProps) {
  // Highlight three featured events
  const featuredEvents = events.slice(0, 3);

  return (
    <div className="space-y-16 py-4 animate-in fade-in duration-700">
      
      {/* 1. HERO BANNER WITH MOTION ANIMATIONS */}
      <section className="relative min-h-[500px] flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden rounded-3xl glass-panel border border-[#b76dff]/25 bg-gradient-to-b from-[#111930] to-[#080e20] shadow-[0_0_50px_rgba(183,109,255,0.15)]">
        
        {/* Animated Background Lights and Ambient Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[350px] h-[350px] bg-[#b76dff] opacity-15 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#38bdf8] opacity-15 blur-[130px] rounded-full animate-pulse pointer-events-none"></div>

        {/* Floating Geometric Wireframes & Abstract lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-grid-pattern"></div>

        {/* Hero Title and Badge with Motion */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20 font-mono text-xs uppercase tracking-widest font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Finding Your Rhythm
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-sans font-black tracking-tighter uppercase leading-none text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            Discover Gigs, <span className="bg-gradient-to-r from-[#ddb7ff] via-[#38bdf8] to-[#b76dff] bg-clip-text text-transparent">Venues & Communities</span> Around You
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm sm:text-lg text-[#cfc2d6] md:text-xl font-normal max-w-2xl mx-auto leading-relaxed"
          >
            Unlock handpicked music experiences, neighborhood spaces, and cultural gatherings. Made for modern individuals and active lifestyle clubs seeking genuine local connections.
          </motion.p>

          {/* Interactive CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
          >
            <button
              onClick={() => onNavigate('events')}
              className="w-full sm:w-auto electric-gradient text-[#0b1326] font-extrabold text-sm uppercase tracking-wider px-8 py-4 rounded-full hover:brightness-110 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-[#b76dff]/20 flex items-center justify-center gap-2 group"
            >
              Find Events
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('my-tickets')}
              className="w-full sm:w-auto glass-panel border border-white/10 hover:border-white/30 text-white font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 active:scale-95 transition-all"
            >
              {user ? "View My Passes" : "Get Registered"}
            </button>
          </motion.div>
        </div>

        {/* Live Audio / Stage Floating Indicator */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-slate-400 border-t border-white/5 pt-4 z-10">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#38bdf8] rounded-full animate-ping"></span>
            <span>ACTIVE NEIGHBORHOOD VENUES: 42 ONLINE</span>
          </div>
          <div className="flex items-center gap-3">
            <span>WEEKEND EVENTS: 8 SCHEDULED</span>
            <span className="text-[#ddb7ff]">•</span>
            <span>COMMUNITIES ENGAGED: 2,400+</span>
          </div>
        </div>

      </section>

      {/* 2. FEATURED EVENTS SECTION */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="text-left space-y-1">
            <p className="font-mono text-xs uppercase tracking-widest text-[#38bdf8] font-bold">VIP Highlights</p>
            <h2 className="font-sans font-extrabold text-2xl sm:text-4xl text-white tracking-tight uppercase">
              Featured Festival Lineups
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Experience these premium sound phases designed to stretch cognitive limits through ambient techno and hybrid-acoustic vibes.
            </p>
          </div>
          <button
            onClick={() => onNavigate('events')}
            className="self-start md:self-end font-sans font-bold text-xs text-[#ddb7ff] hover:text-white flex items-center gap-1.5 hover:underline uppercase tracking-wider"
          >
            See All {events.length} Lineups
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Featured Events Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredEvents.map((ev, idx) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-[#b76dff]/30 shadow-lg hover:shadow-2xl hover:shadow-[#b76dff]/5 transition-all text-left flex flex-col justify-between"
            >
              
              {/* Event Cover Image with Zoom Effect */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1627] via-transparent to-black/40 z-10"></div>
                <img 
                  referrerPolicy="no-referrer"
                  src={ev.imageUrl} 
                  alt={ev.title} 
                  className="w-full h-full object-cover group-hover:scale-105 duration-500 transition-transform"
                />
                
                {/* Event Stage Label */}
                <span className="absolute top-4 left-4 z-20 text-[9px] font-mono tracking-widest bg-[#0b1326]/90 border border-white/10 text-white font-bold py-1 px-2.5 rounded-full uppercase">
                  {ev.stage}
                </span>

                {/* Event Price Tag */}
                <div className="absolute bottom-4 right-4 z-20 font-mono text-xs text-white bg-[#b76dff]/20 backdrop-blur-md border border-[#b76dff]/30 px-3 py-1 rounded-full font-extrabold">
                  {ev.price === 0 ? "FREEPASS" : `$${ev.price.toFixed(2)}`}
                </div>
              </div>

              {/* Event Meta context */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-sans font-bold text-lg text-white leading-tight group-hover:text-[#ddb7ff] transition-colors uppercase">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {ev.description}
                  </p>
                </div>

                {/* Artists scroll tags */}
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold">Billed Artists</p>
                  <div className="flex flex-wrap gap-1">
                    {ev.artists.slice(0, 3).map((artist, aIdx) => (
                      <span 
                        key={aIdx} 
                        className="text-[9px] font-mono bg-white/5 border border-white/5 text-[#dae2fd] px-2 py-0.5 rounded"
                      >
                        {artist}
                      </span>
                    ))}
                    {ev.artists.length > 3 && (
                      <span className="text-[9px] font-mono bg-[#b76dff]/10 text-[#ddb7ff] border border-[#b76dff]/10 px-1.5 py-0.5 rounded">
                        +{ev.artists.length - 3} MORE
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Date and Time Footer Row */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>{ev.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Disc className="w-3.5 h-3.5 text-[#b76dff] animate-spin-slow" />
                    <span>{ev.time}</span>
                  </div>
                </div>

                {/* ACTION TRIGGER BUTTON */}
                <button
                  onClick={() => onSelectEvent(ev)}
                  className="w-full mt-2 bg-white/5 hover:bg-[#b76dff]/20 hover:text-white hover:border-[#b76dff]/30 border border-white/10 text-[#ddb7ff] py-3 rounded-full text-xs font-extrabold uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>RESERVE / BOOK</span>
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. BENTO GRID FEATURES LIST */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-[#b76dff] font-bold">Uniting Communities</p>
          <h2 className="font-sans font-extrabold text-2xl sm:text-4xl text-white tracking-tight uppercase">
            Designed for Local Discovery
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            NeonBeat connects active individuals, community groups, and local spaces together. Discover hidden gems and secure effortless entry to neighborly gatherings.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: Local Venues & Spaces (Takes 7 cols) */}
          <div className="md:col-span-7 glass-panel rounded-2xl p-6 border border-white/5 bg-gradient-to-br from-[#121b33] to-[#040914] text-left flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="absolute top-[-30px] left-[-30px] w-48 h-48 bg-[#b76dff]/5 rounded-full blur-[70px] pointer-events-none"></div>
            
            <div className="flex items-center justify-between">
              <div className="p-3 bg-[#b76dff]/10 rounded-xl border border-[#b76dff]/20 text-[#b76dff]">
                <Volume2 className="w-6 h-6" />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 border border-white/10 rounded-full px-2.5 py-1">
                Local Finder
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-sans font-bold text-lg text-white uppercase tracking-tight">
                Handpicked Neighborhood Venues & Spaces
              </h3>
              <p className="text-xs text-[#cfc2d6] leading-relaxed">
                We partner with community centers, cozy local parks, warehouse art rooms, and acoustic pubs to transform empty corners into memorable social spaces. Every venue listed prioritizes local flavor, inclusive community access, and incredible vibes.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-[#b76dff] font-bold font-mono">
              <CheckCircle className="w-3.5 h-3.5" /> 100% REAL & VERIFIED VENUES
            </div>
          </div>

          {/* Card 2: Safe Ticket Holds (Takes 5 cols) */}
          <div className="md:col-span-5 glass-panel rounded-2xl p-6 border border-white/5 bg-gradient-to-br from-[#0c162b] to-[#040914] text-left flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="absolute bottom-[-30px] right-[-30px] w-36 h-36 bg-[#38bdf8]/5 rounded-full blur-[60px] pointer-events-none"></div>

            <div className="flex items-center justify-between">
              <div className="p-3 bg-[#38bdf8]/10 rounded-xl border border-[#38bdf8]/20 text-[#38bdf8]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 border border-white/10 rounded-full px-2.5 py-1">
                Worry-Free Ticket Hold
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-sans font-bold text-lg text-white uppercase tracking-tight">
                Temporary Hold Seat Reservations
              </h3>
              <p className="text-xs text-[#cfc2d6] leading-relaxed">
                Enjoy instant, temporary checkout protection. Our system lets you choose and lock your spots for up to 5 minutes so you can organize transit with your friends before finalizing payment or secure your place.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-[#38bdf8] font-bold font-mono">
              <Zap className="w-3.5 h-3.5" /> 5-MINUTE RESERVATION INTEGRITY
            </div>
          </div>

          {/* Card 3: Community Gathers (Takes 5 cols) */}
          <div className="md:col-span-5 glass-panel rounded-2xl p-6 border border-white/5 bg-gradient-to-br from-[#0c162b] to-[#040914] text-left flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="absolute top-[-30px] right-[-30px] w-36 h-36 bg-[#cfc2d6]/5 rounded-full blur-[60px] pointer-events-none"></div>

            <div className="flex items-center justify-between">
              <div className="p-3 bg-[#cfc2d6]/10 rounded-xl border border-white/15 text-white">
                <Eye className="w-6 h-6" />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 border border-white/10 rounded-full px-2.5 py-1">
                Mixers & Popups
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-sans font-bold text-lg text-white uppercase tracking-tight">
                Vibrant Community Gatherings
              </h3>
              <p className="text-xs text-[#cfc2d6] leading-relaxed">
                Discover jam sessions, acoustic pop-ups, small scale street festivals, and local mixers. Perfect for meeting like-minded creative minds and celebrating neighborhood activities in comfortable, safe settings.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-white font-bold font-mono">
              <Sliders className="w-3.5 h-3.5" /> CURATED SOCIAL GATHERINGS
            </div>
          </div>

          {/* Card 4: Community VIP Lounge (Takes 7 cols) */}
          <div className="md:col-span-7 glass-panel rounded-2xl p-6 border border-white/5 bg-gradient-to-br from-[#121b33] to-[#040914] text-left flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="absolute bottom-[-30px] left-[-30px] w-48 h-48 bg-[#b76dff]/5 rounded-full blur-[70px] pointer-events-none"></div>

            <div className="flex items-center justify-between">
              <div className="p-3 bg-[#b76dff]/10 rounded-xl border border-[#b76dff]/20 text-[#b76dff]">
                <Users className="w-6 h-6" />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 border border-white/10 rounded-full px-2.5 py-1">
                Lounge & Host
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-sans font-bold text-lg text-white uppercase tracking-tight">
                Private Host Decks & Group Lounges
              </h3>
              <p className="text-xs text-[#cfc2d6] leading-relaxed">
                Elevate your community meetup experience. Book modular space settings, small lounge layouts, or special coordinate sections. Access helpful staff to personalize catering, acoustics, and seating maps.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-[#b76dff] font-bold font-mono">
              <Heart className="w-3.5 h-3.5 fill-current" /> PERFECT FOR GROUPS & ORGANIZATIONS
            </div>
          </div>

        </div>
      </section>

      {/* 4. NEWSLETTER / REGISTER CTA FOR DREAMERS */}
      <section className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-8 sm:p-12 text-center bg-gradient-to-r from-[#0c1428] via-[#161f36] to-[#0c1428] shadow-xl">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#38bdf8]/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex p-3 bg-white/5 rounded-full border border-white/10 animate-bounce">
            <Sparkles className="w-6 h-6 text-[#38bdf8]" />
          </div>
          
          <h2 className="font-sans font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
            Configure Your Sound Frequency
          </h2>
          <p className="text-xs sm:text-sm text-[#cfc2d6] leading-relaxed">
            By creating your custom dreamer profile, you gain priority queue access, automatic updates for Phase 2 artist drops, and dual-integrity seat reservation support.
          </p>

          <div className="pt-4 max-w-md mx-auto">
            {user ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 font-mono">
                  You are currently authenticated as <strong className="text-[#38bdf8]">{user.name}</strong>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                  <button
                    onClick={() => onNavigate('my-tickets')}
                    className="w-full sm:w-auto px-8 py-3.5 electric-gradient text-[#0b1326] font-extrabold text-xs uppercase tracking-wider rounded-full hover:brightness-110 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-[#b76dff]/25"
                  >
                    Enter Creator Dashboard
                  </button>
                  <button
                    onClick={onLogOut}
                    className="w-full sm:w-auto px-8 py-3.5 glass-panel border border-white/10 hover:border-red-500/50 text-white hover:text-red-400 font-bold text-xs uppercase tracking-wider rounded-full hover:bg-white/5 active:scale-95 transition-all"
                  >
                    Sign Out Account
                  </button>
                </div>

                <p className="text-[10px] text-slate-400 font-mono">
                  Need to test or create a new profile? Click{' '}
                  <button 
                    onClick={() => { onLogOut(); onNavigate('signup'); }}
                    className="text-[#b76dff] hover:underline font-bold"
                  >
                    Create Profile
                  </button>{' '}
                  or{' '}
                  <button 
                    onClick={() => { onLogOut(); onNavigate('login'); }}
                    className="text-[#38bdf8] hover:underline font-bold"
                  >
                    Log In
                  </button>{' '}
                  as a guest.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                  <button
                    onClick={() => onNavigate('signup')}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#b76dff] to-[#38bdf8] text-[#0b1326] font-extrabold text-xs uppercase tracking-wider rounded-full hover:brightness-110 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-[#b76dff]/25"
                  >
                    Sign Up / Create Profile
                  </button>
                  <button
                    onClick={() => onNavigate('login')}
                    className="w-full sm:w-auto px-8 py-3.5 glass-panel border border-white/10 hover:border-[#38bdf8]/50 text-white hover:text-[#38bdf8] font-bold text-xs uppercase tracking-wider rounded-full hover:bg-white/5 active:scale-95 transition-all"
                  >
                    Log In to Existing
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">Instant activation. No credit card required to secure hold reservations.</p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
