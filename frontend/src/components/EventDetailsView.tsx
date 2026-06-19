import React, { useState, useEffect } from 'react';
import { MusicEvent, User } from '../types';
import { mockVenues } from '../data/mockVenues';
import { 
  ArrowLeft, Calendar, Clock, DollarSign, MapPin, Sparkles, 
  Users, Music, AlertTriangle, ShieldCheck, Ticket, Users2, Share2, Eye 
} from 'lucide-react';

interface EventDetailsViewProps {
  event: MusicEvent;
  user: User | null;
  onBack: () => void;
  onBookNow: (event: MusicEvent) => void;
  onShowNotification: (msg: string) => void;
}

export default function EventDetailsView({
  event,
  user,
  onBack,
  onBookNow,
  onShowNotification
}: EventDetailsViewProps) {
  // Find associated venue
  const venue = mockVenues.find(v => v.stage === event.stage);

  // Dynamic simulation of available tickets to drive urgency
  const [ticketUrgency, setTicketUrgency] = useState(14);
  const [viewsCounter, setViewsCounter] = useState(82);

  useEffect(() => {
    // Generate organic pulse views counter and countdown urgency slightly
    const interval = setInterval(() => {
      setViewsCounter(prev => prev + Math.floor(Math.random() * 3) - 1);
      if (Math.random() > 0.7) {
        setTicketUrgency(prev => (prev > 3 ? prev - 1 : prev));
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const priceFormatted = event.price === 0 || event.isFree 
    ? 'FREE ACCESS' 
    : `$${event.price.toFixed(2)}`;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      
      {/* Navigation and Actions Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 duration-200 text-[#b76dff]" /> 
          Back to lineup list
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              onShowNotification("Event coordinates address copied to clipboard!");
            }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 border border-white/10 hover:border-white/30 rounded-xl text-xs font-mono text-slate-300 hover:text-white bg-[#11192e]/40 backdrop-blur-xl transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" /> Share Flow
          </button>
          
          <div className="text-xs font-mono text-[#38bdf8] bg-[#38bdf8]/10 border border-[#38bdf8]/20 px-3 py-2 rounded-xl flex items-center gap-1.5">
            <Eye className="w-4 h-4 animate-pulse" />
            <span>{viewsCounter} viewing this event right now</span>
          </div>
        </div>
      </div>

      {/* Main Grid Frame: Cover & Booking Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cover, Info details, Lineup list (Cards) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Visual Cover Billboard card */}
          <div className="relative rounded-3xl overflow-hidden min-h-[300px] sm:min-h-[450px] border border-white/10 shadow-2xl">
            <img 
              referrerPolicy="no-referrer"
              src={event.imageUrl} 
              alt={event.title} 
              className="absolute inset-0 w-full h-full object-cover select-none"
            />
            {/* Dark organic gradient backdrop */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-[#0b1326]/30 to-transparent" />
            
            {/* Live event badge */}
            {event.isLive && (
              <div className="absolute top-6 left-6 bg-red-550 border border-red-400/50 bg-red-600 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest text-white flex items-center gap-1.5 animate-pulse shadow-lg shadow-red-600/30">
                <span className="w-2 h-2 rounded-full bg-white block animate-ping" />
                Live Now
              </div>
            )}

            {/* Float category & price */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#38bdf8] bg-[#38bdf8]/20 border border-[#38bdf8]/40 px-3.5 py-1 rounded-full">
                  {event.stage}
                </span>
                <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight uppercase italic drop-shadow-md">
                  {event.title}
                </h1>
              </div>

              <div className="bg-[#111827]/90 backdrop-blur-md border border-[#ddb7ff]/20 px-5 py-3 rounded-2xl flex flex-col items-center sm:items-end text-center sm:text-right">
                <span className="text-[10px] font-mono uppercase text-slate-400">Pass Price</span>
                <span className="text-xl font-display font-black text-[#ddb7ff] electric-glow">
                  {priceFormatted}
                </span>
              </div>
            </div>
          </div>

            {/* Detailed summary tabs */}
            <div className="bg-[#11192e]/60 border border-white/10 p-6 sm:p-8 rounded-3xl space-y-6">
              <h2 className="text-sm font-mono uppercase tracking-widest text-white border-b border-white/5 pb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ddb7ff]" /> About Curated Experience
              </h2>
              
              <p className="text-base text-white leading-relaxed font-semibold">
                {event.description}
              </p>
              
              <p className="text-sm text-[#cfc2d6] leading-relaxed">
                {event.longDescription}
              </p>
            </div>

          {/* Lineup & Artists detail */}
          <div className="bg-[#11192e]/60 border border-white/10 p-6 sm:p-8 rounded-3xl space-y-6">
            <h2 className="text-sm font-mono uppercase tracking-widest text-white border-b border-white/5 pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2"><Music className="w-4 h-4 text-[#38bdf8]" /> Local Lineup</span>
              <span className="text-xs text-slate-400 font-mono italic">{event.artists.length} Acts Scheduled</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {event.artists.map((artist, idx) => (
                <div 
                  key={artist}
                  className="bg-[#16223e] border border-white/5 px-4 py-3 rounded-2xl flex items-center gap-3 hover:border-[#b76dff]/30 transition-all cursor-default"
                >
                  <div className="w-10 h-10 rounded-full electric-gradient text-[#0b1326] flex items-center justify-center font-black text-sm italic shadow-md">
                    {artist.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{artist}</h4>
                    <p className="text-[9px] font-mono text-slate-400">Scheduled Act #{idx + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Booking & Venue Panel */}
        <div className="lg:col-span-4 space-y-8 sticky top-24">
          
          {/* Main Booking Panel */}
          <div className="bg-[#11192e]/85 border-2 border-[#b76dff]/30 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden backdrop-blur-md">
            
            {/* Cyber pulse mesh header */}
            <div className="absolute top-0 left-0 w-full h-1 electric-gradient" />

            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-mono uppercase">
                <span className="text-slate-400">Availability</span>
                <span className="text-red-400 flex items-center gap-1 animate-pulse font-extrabold">
                  <AlertTriangle className="w-3.5 h-3.5" /> High Demand Spot
                </span>
              </div>
              
              <div className="font-display font-black text-3xl text-white">
                {priceFormatted}
                <span className="text-xs font-mono text-slate-400 font-normal block mt-1">exclusive floor seats allocation</span>
              </div>
            </div>

            {/* Quick specifications lists */}
            <div className="space-y-3 bg-[#0b1326]/50 p-4 rounded-2xl border border-white/5">
              <div className="flex items-start gap-3 text-xs">
                <Calendar className="w-4.5 h-4.5 text-[#b76dff] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white uppercase tracking-wider">Date</p>
                  <p className="text-slate-300 font-mono">{event.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <Clock className="w-4.5 h-4.5 text-[#b76dff] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white uppercase tracking-wider">Time Duration</p>
                  <p className="text-slate-300 font-mono">{event.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <MapPin className="w-4.5 h-4.5 text-[#b76dff] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white uppercase tracking-wider">Venue</p>
                  <p className="text-slate-300">{venue?.name || event.stage}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{venue?.address}</p>
                </div>
              </div>
            </div>

            {/* Progress capacity slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-400">Lockable Slots remaining</span>
                <span className="text-[#ddb7ff] font-extrabold">{ticketUrgency} passes left</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div 
                  className="electric-gradient h-full rounded-full transition-all duration-1000"
                  style={{ width: `${(ticketUrgency / 25) * 100}%` }}
                />
              </div>
            </div>

            {/* Action Buttons separately (instead of joined reserve/book button, we can show option to reserve or book now!) */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => onBookNow(event)}
                className="w-full electric-gradient text-[#0b1326] hover:scale-[1.02] active:scale-95 duration-200 py-4 rounded-full font-black text-xs uppercase tracking-wider shadow-lg shadow-[#b76dff]/30 cursor-pointer text-center block"
              >
                BOOK TICKET NOW
              </button>
              
              <button
                onClick={() => onBookNow(event)}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-white hover:scale-[1.02] active:scale-95 duration-200 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider cursor-pointer text-center block"
              >
                RESERVE / PRE-LOCK SEAT
              </button>
            </div>

            {/* Fine prints */}
            <p className="text-[10px] font-mono text-center text-slate-500 leading-snug">
              * 5-min auto-release timers enforce secure space distributions. No booking fee charges for refund transfers.
            </p>

          </div>

          {/* Mini Specific Venue Details Card */}
          {venue && (
            <div className="bg-[#11192e]/60 border border-white/10 p-6 rounded-3xl space-y-4">
              <span className="text-[9px] font-mono px-2 py-1 rounded bg-[#38bdf8]/10 text-[#38bdf8] uppercase border border-[#38bdf8]/15">
                Venue Location Profile
              </span>
              <h3 className="font-display font-extrabold text-sm text-white uppercase tracking-wider">
                {venue.name}
              </h3>
              
              <img 
                referrerPolicy="no-referrer"
                src={venue.imageUrl} 
                alt={venue.name} 
                className="w-full h-32 object-cover rounded-xl border border-white/5"
              />

              <p className="text-xs text-[#cfc2d6] leading-relaxed">
                {venue.description}
              </p>

              <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>📍 {venue.address}</span>
                <span>👥 Max {venue.capacity} guests</span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
