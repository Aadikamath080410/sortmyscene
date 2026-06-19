import React from 'react';
import { User, Booking } from '../types';
import { Calendar, MapPin, Sparkles, Sliders, Play, Award, CheckCircle, Clock } from 'lucide-react';

interface MyTicketsViewProps {
  user: User;
  bookings: Booking[];
  onSelectBookingDetail: (booking: Booking) => void;
  onNavigateToDiscovery: () => void;
  onShowNotification: (msg: string) => void;
}

export default function MyTicketsView({
  user,
  bookings,
  onSelectBookingDetail,
  onNavigateToDiscovery,
  onShowNotification
}: MyTicketsViewProps) {
  const [minsRemaining, setMinsRemaining] = React.useState(33);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setMinsRemaining(prev => (prev > 0 ? prev - 1 : 59));
    }, 60000); // decrement each minute
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1 text-left animate-in fade-in duration-500">
      
      {/* Profile summary header bar */}
      <section className="glass-panel p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-[-30px] left-[-30px] w-36 h-36 bg-[#b76dff]/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-[-10px] right-[-10px] w-40 h-40 bg-[#38bdf8]/10 rounded-full blur-2xl"></div>

        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 w-full sm:w-auto text-center sm:text-left">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[#ddb7ff] overflow-hidden shadow-lg shadow-[#b76dff]/30">
            <img referrerPolicy="no-referrer" src={user.avatar} alt="Avatar profile" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-1">
            <h1 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight leading-none uppercase">
              {user.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/30 px-3 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-300" /> {user.status} Status
              </span>
              <span className="text-xs text-slate-400 font-sans">{user.memberSince}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-8 md:gap-12 relative z-10 select-none">
          <div className="text-center sm:text-right">
            <p className="font-display font-extrabold text-2xl text-[#ddb7ff] leading-none mb-1">
              {user.festivalCount}
            </p>
            <p className="text-[10px] font-mono whitespace-nowrap uppercase tracking-widest text-[#cfc2d6]">
              Pulses Visited
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="font-display font-extrabold text-2xl text-[#38bdf8] leading-none mb-1">
              {user.upcomingCount + bookings.length}
            </p>
            <p className="text-[10px] font-mono whitespace-nowrap uppercase tracking-widest text-[#cfc2d6]">
              Upcoming bookings
            </p>
          </div>
        </div>
      </section>

      {/* Main dashboard body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Your Upcoming passes list (take 8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center px-1">
            <h2 className="font-display font-extrabold text-lg md:text-xl text-white uppercase tracking-tight">
              Your Bookings ({bookings.length})
            </h2>
            <button 
              onClick={onNavigateToDiscovery}
              className="text-xs text-[#ddb7ff] hover:underline uppercase tracking-wider font-semibold"
            >
              Secure other passes +
            </button>
          </div>

          {/* DYNAMIC BOOKED PASSES BY USER */}
          {bookings.map(book => (
            <div 
              key={book.id} 
              className="glass-panel rounded-2xl overflow-hidden flex flex-col md:flex-row group hover:border-[#b76dff]/40 transition-all duration-300 animate-in fade-in zoom-in-95"
            >
              {/* Thumbnail image block */}
              <div className="md:w-1/3 relative h-40 md:h-auto overflow-hidden bg-slate-900 border-r border-[#b76dff]/10">
                <img 
                  src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400" 
                  alt="Live lasers grid" 
                  className="w-full h-full object-cover group-hover:scale-105 duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-transparent opacity-40"></div>
              </div>
              {/* Content body */}
              <div className="p-6 md:w-2/3 flex flex-col justify-between text-left space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-[#ddb7ff] duration-200">
                      {book.eventName}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-[#cfc2d6]">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {book.eventDate}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {book.stageName}</span>
                    </div>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded text-[10px] font-mono uppercase tracking-wider">
                    CONFIRMED
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-white/5 text-xs text-[#cfc2d6]">
                  <div>
                    <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Locked Seats</p>
                    <p className="font-semibold text-[#38bdf8]">{book.seats.join(', ')}</p>
                  </div>
                  <button 
                    onClick={() => onSelectBookingDetail(book)}
                    className="border border-[#ddb7ff] text-[#ddb7ff] hover:bg-[#ddb7ff]/10 font-bold text-xs uppercase tracking-wider px-5 py-2 rounded-full duration-200 transition-all"
                  >
                    View Ticket ID
                  </button>
                </div>
              </div>
            </div>
          ))}

          {bookings.length === 0 && (
            <div className="glass-panel rounded-2xl p-12 text-center space-y-3">
              <p className="text-sm text-[#cfc2d6]">No confirmed bookings yet.</p>
              <button
                type="button"
                onClick={onNavigateToDiscovery}
                className="text-[#38bdf8] hover:underline text-xs font-semibold uppercase"
              >
                Browse events and book seats
              </button>
            </div>
          )}

        </div>

        {/* Right Column: Countdown Alarm Clock (takes 4 cols) */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* Active imminent visual Alarm Clock box representation */}
          <div className="glass-panel p-6 rounded-2xl text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#b76dff]/15 rounded-full blur-3xl"></div>
            
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#cfc2d6] block mb-3">Imminent Pulse in</span>
            
            <div className="flex justify-center items-center gap-4 select-none">
              <div className="flex flex-col items-center">
                <span className="font-display font-black text-4xl text-[#ddb7ff] leading-none">14</span>
                <span className="font-mono text-[9px] uppercase text-slate-500 mt-2">DYS</span>
              </div>
              <span className="font-display font-black text-xl text-slate-600 animate-pulse">:</span>
              <div className="flex flex-col items-center">
                <span className="font-display font-black text-4xl text-[#ddb7ff] leading-none">08</span>
                <span className="font-mono text-[9px] uppercase text-slate-500 mt-2">HRS</span>
              </div>
              <span className="font-display font-black text-xl text-slate-600 animate-pulse">:</span>
              <div className="flex flex-col items-center">
                <span className="font-display font-black text-4xl text-[#ddb7ff] leading-none">
                  {minsRemaining.toString().padStart(2, '0')}
                </span>
                <span className="font-mono text-[9px] uppercase text-slate-500 mt-2">MIN</span>
              </div>
            </div>

            <p className="mt-6 text-xs text-[#cfc2d6] leading-relaxed">
              Get your cybernetic attire ready for <br />
              <strong className="text-white uppercase text-xs font-semibold">Neon Skyline Vol. 4</strong>.
            </p>

            <button 
              onClick={() => onShowNotification("Seeded calendar invitation ICS exported to devices local calendars.")}
              className="mt-6 w-full py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white/10 text-white transition-colors flex items-center justify-center gap-1.5"
            >
              Add to device calendar
            </button>
          </div>

          {/* Past Experiences listings */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="font-display font-semibold text-sm uppercase text-slate-300">
              Past Experiences
            </h3>
            
            <div className="space-y-4 divide-y divide-white/5">
              
              {/* Past Item 1 */}
              <div className="flex gap-4 pt-4 first:pt-0 items-center opacity-60 hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900">
                  <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=150" alt="Sunset garden" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white leading-tight">Prism Valley Festival</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">June 14, 2024</p>
                </div>
              </div>

              {/* Past Item 2 */}
              <div className="flex gap-4 pt-4 items-center opacity-60 hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900">
                  <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=150" alt="White laser grids" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white leading-tight">Echo Chamber Sessions</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">April 02, 2024</p>
                </div>
              </div>

              {/* Past Item 3 */}
              <div className="flex gap-4 pt-4 items-center opacity-60 hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900">
                  <img src="https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=150" alt="Stadium show climax" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white leading-tight">Zenith Ground Zero</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Dec 31, 2023</p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
