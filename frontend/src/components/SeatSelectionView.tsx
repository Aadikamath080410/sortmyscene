import React, { useState, useEffect, useCallback } from 'react';
import { MusicEvent, Seat, User, ReservationResult } from '../types';
import { Calendar, AlertTriangle, ShieldCheck, Timer, X, RefreshCw } from 'lucide-react';
import { fetchEventById } from '../services/eventService';
import { mapApiSeatsToSeats } from '../utils/eventMapper';

interface SeatSelectionViewProps {
  event: MusicEvent;
  user: User | null;
  onReserve: (eventId: string, selectedSeatsIds: string[]) => Promise<ReservationResult>;
  onConfirm: (reservationId: string, selectedSeatsIds: string[]) => Promise<boolean>;
  onBack: () => void;
  onNavigate: (view: 'home' | 'events' | 'seat-selection' | 'my-tickets' | 'login' | 'signup') => void;
  onShowNotification: (msg: string) => void;
  walletAddress: string | null;
  onConnectWallet: () => Promise<string>;
}

export default function SeatSelectionView({
  event,
  user,
  onReserve,
  onConfirm,
  onBack,
  onNavigate,
  onShowNotification,
}: SeatSelectionViewProps) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [seatsLoading, setSeatsLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isReserving, setIsReserving] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [totalDuration, setTotalDuration] = useState(600);
  const [isConfirming, setIsConfirming] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const loadSeats = useCallback(async () => {
    setSeatsLoading(true);
    try {
      const detail = await fetchEventById(event.id);
      setSeats(mapApiSeatsToSeats(detail.seats, event.price));
    } catch {
      onShowNotification('Failed to load seat grid. Please try again.');
    } finally {
      setSeatsLoading(false);
    }
  }, [event.id, event.price, onShowNotification]);

  useEffect(() => {
    loadSeats();
  }, [loadSeats]);

  useEffect(() => {
    if (!isReserved) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onShowNotification('Your reservation has expired. Seats returned to the pool.');
          resetLocks();
          loadSeats();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isReserved, loadSeats, onShowNotification]);

  const resetLocks = () => {
    setIsReserved(false);
    setReservationId(null);
    setSelectedSeats([]);
    setApiError(null);
    setTimeLeft(600);
    setTotalDuration(600);
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.state !== 'available') return;
    if (isReserved) {
      onShowNotification('Seats are locked. Confirm your booking or cancel the hold.');
      return;
    }

    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats((prev) => prev.filter((id) => id !== seat.id));
    } else if (selectedSeats.length >= 6) {
      onShowNotification('Maximum 6 seats per reservation.');
    } else {
      setSelectedSeats((prev) => [...prev, seat.id]);
    }
  };

  const handleReserveClick = async () => {
    if (!user) {
      onShowNotification('Please sign in to reserve seats.');
      onNavigate('login');
      return;
    }

    if (selectedSeats.length === 0) {
      onShowNotification('Please select at least one available seat.');
      return;
    }

    setIsReserving(true);
    setApiError(null);

    const result = await onReserve(event.id, selectedSeats);

    if (result.success && result.reservationId && result.expiresAt) {
      const expiresAt = new Date(result.expiresAt).getTime();
      const secondsLeft = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      const duration = result.durationSeconds || secondsLeft || 600;

      setReservationId(result.reservationId);
      setIsReserved(true);
      setTimeLeft(secondsLeft || duration);
      setTotalDuration(duration);
      onShowNotification(`${selectedSeats.length} seat(s) reserved for ${Math.floor(duration / 60)} minutes.`);

      setSeats((prev) =>
        prev.map((s) =>
          selectedSeats.includes(s.id) ? { ...s, state: 'reserved' as const } : s
        )
      );
    } else {
      const unavailable = result.unavailableSeats || [];
      if (unavailable.length > 0) {
        setApiError(
          `Seat(s) ${unavailable.join(', ')} are no longer available. Please update your selection.`
        );
        setSeats((prev) =>
          prev.map((s) =>
            unavailable.includes(s.id) ? { ...s, state: 'booked' as const } : s
          )
        );
        setSelectedSeats((prev) => prev.filter((id) => !unavailable.includes(id)));
      } else {
        setApiError(result.error || 'Reservation failed. Please try again.');
      }
      onShowNotification(result.error || 'Reservation failed.');
      await loadSeats();
    }

    setIsReserving(false);
  };

  const handleConfirmClick = async () => {
    if (!reservationId) {
      setApiError('No active reservation. Please reserve seats first.');
      return;
    }

    setIsConfirming(true);
    setApiError(null);

    const confirmed = await onConfirm(reservationId, selectedSeats);

    if (!confirmed) {
      setApiError('Booking failed. Your reservation may have expired or seats were taken.');
      await loadSeats();
      resetLocks();
    }

    setIsConfirming(false);
  };

  const SEAT_PRICE = event.price || 149;
  const subtotal = selectedSeats.length * SEAT_PRICE;
  const bookingFee = subtotal * 0.08;
  const total = subtotal + bookingFee;

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto px-1 text-left animate-in fade-in duration-500">

      <div className="lg:col-span-8 flex flex-col items-center">
        <div className="w-full glass-panel rounded-2xl p-6 md:p-8 flex flex-col items-center relative overflow-hidden">
          <div className="flex justify-between items-center w-full pb-4 border-b border-white/5 mb-8">
            <button type="button" onClick={onBack} className="text-xs text-[#38bdf8] flex items-center gap-1.5 font-bold hover:underline">
              ← Back to Events
            </button>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Seat Selection</span>
              <p className="text-xs text-[#ddb7ff] font-bold">{event.title}</p>
            </div>
          </div>

          <div className="w-full max-w-2xl mb-12 relative select-none">
            <div className="stage-gradient absolute -top-16 left-1/2 -translate-x-1/2 w-[110%] h-32 animate-pulse-glow"></div>
            <div className="relative z-10 border-t-2 border-[#b76dff]/30 rounded-[100%] h-10 w-full flex items-center justify-center bg-[#131b2e]/60 backdrop-blur-md">
              <span className="font-display font-extrabold text-[#b76dff] tracking-[0.6em] text-xs md:text-sm uppercase opacity-90 pl-3">STAGE</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-8 text-xs select-none">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/40 seat-glow-available"></div>
              <span className="font-semibold text-[#cfc2d6]">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-400 text-[#0b1326] flex items-center justify-center font-bold text-[8px] seat-glow-selected shadow-md">★</div>
              <span className="font-semibold text-yellow-300">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500/25 border border-red-500/40 seat-glow-booked opacity-60"></div>
              <span className="font-semibold text-[#cfc2d6]">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-500/35 border border-purple-500/40 seat-glow-reserved opacity-60"></div>
              <span className="font-semibold text-[#cfc2d6]">Reserved</span>
            </div>
          </div>

          {seatsLoading ? (
            <div className="py-16 text-center text-slate-400 text-sm flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" /> Loading seat grid...
            </div>
          ) : (
            <div className="w-full overflow-x-auto custom-scrollbar pb-6 select-none bg-black/10 rounded-xl p-4 md:p-6 mb-6">
              <div className="inline-block min-w-full">
                <div className="grid grid-cols-10 gap-3 md:gap-4 mx-auto w-fit">
                  {seats.map((seat) => {
                    const isSelected = selectedSeats.includes(seat.id);
                    let stateClass = '';

                    if (isSelected) {
                      stateClass = 'bg-yellow-400 text-[#0b1326] border-yellow-500 seat-glow-selected font-extrabold scale-105';
                    } else if (seat.state === 'available') {
                      stateClass = 'bg-emerald-500/10 hover:bg-emerald-500/25 border-emerald-500/40 text-emerald-400 cursor-pointer hover:border-emerald-400 seat-glow-available';
                    } else if (seat.state === 'booked') {
                      stateClass = 'bg-red-500/20 border-red-500/30 text-red-400/40 cursor-not-allowed opacity-50 seat-glow-booked';
                    } else if (seat.state === 'reserved') {
                      stateClass = 'bg-purple-500/25 border-purple-500/35 text-purple-400 cursor-not-allowed opacity-60 seat-glow-reserved';
                    }

                    return (
                      <button
                        key={seat.id}
                        type="button"
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.state !== 'available' || isReserved}
                        className={`w-10 h-10 md:w-11 md:h-11 border rounded-lg flex flex-col items-center justify-center text-[10px] tracking-tighter transition-all duration-200 outline-none ${stateClass}`}
                        title={`${seat.id} - ${seat.category}`}
                      >
                        <span className="font-bold">{isSelected ? '★' : seat.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <p className="text-[11px] font-sans text-slate-400 italic text-center">
            Select up to 6 seats, then click Reserve to hold them for 10 minutes.
          </p>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-6">
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
              <img referrerPolicy="no-referrer" src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[9px] font-mono bg-[#b76dff]/20 text-[#ddb7ff] px-2 py-0.5 rounded uppercase">{event.stage}</span>
              <h3 className="font-display font-bold text-sm text-white leading-tight mt-1">{event.title}</h3>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-[#38bdf8]" /> {event.date} • {event.time}
              </p>
            </div>
          </div>
        </div>

        {isReserved && (
          <div className="glass-panel rounded-2xl p-5 border-[#b76dff]/50 bg-[#b76dff]/10 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-[#b76dff] animate-pulse" />
                <span className="text-xs font-semibold uppercase text-[#dae2fd]">Reservation Timer</span>
              </div>
              <span className="font-display font-black text-[#b76dff] text-xl tracking-wider tabular-nums">
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#b76dff] to-[#38bdf8] transition-all duration-1000 ease-linear"
                style={{ width: `${totalDuration > 0 ? (timeLeft / totalDuration) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-[#cfc2d6] italic mt-2 text-center">
              Confirm your booking before the timer expires.
            </p>
          </div>
        )}

        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between min-h-[360px]">
          <div>
            <h3 className="font-display font-bold text-sm text-[#dae2fd] border-b border-white/10 pb-3 mb-4 flex items-center justify-between uppercase tracking-wider">
              <span>Summary</span>
              <span className="font-mono text-xs text-[#38bdf8]">{selectedSeats.length} Selected</span>
            </h3>

            {apiError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 space-y-1 text-left animate-in shake duration-300">
                <div className="flex gap-2 text-red-300 items-start">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-xs font-bold font-mono">Booking Error</p>
                </div>
                <p className="text-[10px] text-[#cfc2d6] leading-relaxed">{apiError}</p>
              </div>
            )}

            <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
              {selectedSeats.length === 0 ? (
                <div className="text-center py-8 opacity-40 space-y-1.5">
                  <X className="w-8 h-8 mx-auto text-slate-500" />
                  <p className="text-xs font-mono">No seats selected</p>
                </div>
              ) : (
                selectedSeats.map((id) => {
                  const detail = seats.find((s) => s.id === id);
                  return (
                    <div key={id} className="flex justify-between items-center bg-[#131b2e]/60 border border-white/5 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 bg-yellow-400 text-[#0b1326] flex items-center justify-center font-black rounded text-xs">{id}</span>
                        <p className="text-[11px] font-bold text-white">{detail?.category || 'Floor zone'}</p>
                      </div>
                      <span className="text-xs font-bold text-[#ddb7ff]">${SEAT_PRICE}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-400"><span>Booking Fee (8%)</span><span>${bookingFee.toFixed(2)}</span></div>
              <div className="flex justify-between font-display font-extrabold text-sm text-white pt-2 border-t border-white/5">
                <span className="text-[#38bdf8] uppercase tracking-wider">Total</span>
                <span className="text-lg text-[#ddb7ff]">${total.toFixed(2)}</span>
              </div>
            </div>

            {!isReserved ? (
              <button
                type="button"
                disabled={selectedSeats.length === 0 || isReserving || seatsLoading}
                onClick={handleReserveClick}
                className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 ${
                  selectedSeats.length === 0 || seatsLoading
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                    : 'bg-white/5 text-[#ddb7ff] border border-[#ddb7ff]/30 hover:bg-[#b76dff]/10 hover:border-[#b76dff] cursor-pointer shadow-lg active:scale-95'
                }`}
              >
                {isReserving ? (
                  <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Calling /api/reserve...</span>
                ) : (
                  'Reserve Seats (10 min hold)'
                )}
              </button>
            ) : (
              <div className="space-y-2">
                {user ? (
                  <button
                    type="button"
                    disabled={isConfirming}
                    onClick={handleConfirmClick}
                    className="w-full electric-gradient text-[#0b1326] py-3.5 rounded-xl font-display font-extrabold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#b76dff]/20 flex items-center justify-center gap-2"
                  >
                    {isConfirming ? (
                      <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Calling /api/bookings...</span>
                    ) : (
                      <><ShieldCheck className="w-4 h-4" /> Confirm Booking</>
                    )}
                  </button>
                ) : (
                  <div className="bg-[#121c33] border border-[#38bdf8]/20 rounded-xl p-4 text-left space-y-3">
                    <p className="text-[#38bdf8] font-semibold text-xs uppercase">Account Required</p>
                    <p className="text-[11px] text-[#cfc2d6]">Sign in to confirm your reservation.</p>
                    <div className="flex gap-2.5">
                      <button type="button" onClick={() => onNavigate('signup')} className="flex-1 electric-gradient text-[#0b1326] py-2 rounded-lg text-[10px] font-black uppercase">Sign Up</button>
                      <button type="button" onClick={() => onNavigate('login')} className="flex-1 bg-white/5 border border-white/10 text-white py-2 rounded-lg text-[10px] font-bold uppercase">Log In</button>
                    </div>
                  </div>
                )}
                <button type="button" onClick={() => { resetLocks(); loadSeats(); }} className="w-full py-2 bg-transparent hover:text-red-400 text-slate-400 text-xs transition-colors">
                  Cancel Hold
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
