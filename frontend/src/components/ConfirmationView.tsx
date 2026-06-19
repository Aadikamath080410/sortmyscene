import React, { useEffect, useState } from 'react';
import { Booking } from '../types';
import { Calendar, MapPin, CheckCircle, Ticket, ArrowLeft, Layers, ShieldCheck } from 'lucide-react';

interface ConfirmationViewProps {
  booking: Booking;
  onNavigateToPasses: () => void;
  onNavigateToEvents: () => void;
}

export default function ConfirmationView({
  booking,
  onNavigateToPasses,
  onNavigateToEvents
}: ConfirmationViewProps) {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; size: number; color: string }>>([]);

  // Generate festive confetti particles representation on load
  useEffect(() => {
    const colors = ['#ddb7ff', '#38bdf8', '#89ceff', '#b76dff', '#00a2e6'];
    const generated = Array.from({ length: 45 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto px-4 py-8 select-none z-10 animate-in fade-in duration-700 bg-light-trail min-h-[80vh] flex flex-col justify-center items-center">
      
      {/* Confetti floats */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map(p => (
          <div 
            key={p.id}
            className="absolute rounded-full opacity-60 animate-bounce"
            style={{
              left: `${p.left}%`,
              top: `${-10}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>

      {/* Check Header Success indicator */}
      <div className="text-center mb-8 relative z-10 animate-in slide-in-from-bottom-4 duration-500">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#b76dff]/25 border border-[#b76dff]/40 mb-4 shadow-[0_0_30px_rgba(221,183,255,0.4)] animate-pulse">
          <CheckCircle className="w-10 h-10 text-[#ddb7ff]" />
        </div>
        <h1 className="font-display font-black text-3xl md:text-4xl text-[#ddb7ff] tracking-tight neon-glow uppercase mb-1">
          SUCCEEDED!
        </h1>
        <p className="text-[#cfc2d6] text-sm max-w-sm mx-auto leading-relaxed">
          Your pulse is set. Your energy is locked. See you at the cybernetic beat.
        </p>
      </div>

      {/* Ticket notched card container */}
      <div className="w-full relative group z-10 mb-8 max-w-md">
        {/* Ambient background glow */}
        <div className="absolute -inset-4 bg-[#b76dff]/10 blur-3xl rounded-full opacity-60 pointer-events-none group-hover:opacity-80 transition-opacity"></div>
        
        {/* Notched Ticket panel */}
        <div className="glass-panel ticket-shape overflow-hidden rounded-2xl shadow-2xl relative">
          
          {/* Header Image with dynamic details overlays */}
          <div className="h-44 w-full relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600" 
              alt="Festival Stage Lasers" 
              className="w-full h-full object-cover brightness-95 transform scale-100 hover:scale-105 duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-transparent to-transparent"></div>
            <div className="absolute top-4 left-4">
              <span className="bg-[#b76dff] text-[#0b1326] px-3.5 py-1 rounded-full font-mono font-bold text-[9px] uppercase tracking-wider shadow">
                ★ CONFIRMED RESPASS ★
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-left">
              <p className="text-[10px] font-mono text-[#38bdf8] uppercase tracking-widest">{booking.stageName}</p>
              <h2 className="font-display font-extrabold text-white text-lg tracking-tight uppercase leading-none">
                {booking.eventName}
              </h2>
            </div>
          </div>

          {/* Ticket Details Body representation */}
          <div className="p-6 md:p-8 space-y-6 text-left">
            <div className="grid grid-cols-2 gap-6 py-4 border-y border-white/10">
              <div className="space-y-1">
                <span className="text-[9px] text-[#cfc2d6] uppercase tracking-widest block font-mono">DATE &amp; TIMING</span>
                <p className="text-xs font-bold text-white uppercase">{booking.eventDate}</p>
                <p className="text-[10px] text-slate-400">Gate open: 20:00</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-[#cfc2d6] uppercase tracking-widest block font-mono">SEAT LOCKS</span>
                <p className="text-xs font-bold text-yellow-300 uppercase leading-snug">
                  {booking.seats.join(', ')}
                </p>
                <p className="text-[10px] text-slate-400">Total {booking.seats.length} Tickets</p>
              </div>
            </div>

            {/* QR Scanner visual blocks */}
            <div className="flex flex-col sm:flex-row items-center gap-6 bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="bg-white p-2.5 rounded-lg flex-shrink-0 shadow-lg relative group">
                <img 
                  src={booking.qrCodeUrl} 
                  alt="QR secure confirmation mapping" 
                  className="w-20 h-20 bg-white" 
                />
              </div>
              <div className="text-center sm:text-left space-y-1">
                <span className="text-[9px] font-mono uppercase text-[#b76dff] tracking-widest block">PASS SECURE DECRYPTER</span>
                <p className="text-[11px] text-[#cfc2d6] leading-relaxed">
                  Present this digital QR map on entering gates of Sector 7. 
                  Double integrity block <strong className="text-white">#{booking.id}</strong>.
                </p>
                <div className="pt-1 flex items-center gap-1 justify-center sm:justify-start">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[9px] text-emerald-400 font-mono font-bold uppercase">Transaction Cleared • ${booking.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Button action triggers */}
      <div className="flex flex-col gap-3 w-full max-w-sm relative z-10 animate-in slide-in-from-bottom-8 duration-700 font-sans">
        <button 
          onClick={onNavigateToPasses}
          className="electric-gradient text-[#0b1326] font-bold text-xs uppercase tracking-wider py-3.5 rounded-full hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-[#b76dff]/20 flex items-center justify-center gap-2"
        >
          <Ticket className="w-4 h-4 animate-spin" /> View My Passes
        </button>
        
        <button 
          onClick={onNavigateToEvents}
          className="glass-panel text-[#cfc2d6] hover:text-white font-semibold text-xs uppercase tracking-wider py-3.5 rounded-full hover:bg-white/5 transition-all text-center flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Lineups
        </button>
      </div>

    </div>
  );
}
