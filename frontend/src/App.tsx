import React, { useState, useEffect, useCallback } from 'react';
import { User, MusicEvent, Booking, ReservationResult, ApiUser } from './types';
import TopNavBar from './components/TopNavBar';
import LoginView from './components/LoginView';
import SignUpView from './components/SignUpView';
import EventsListView from './components/EventsListView';
import SeatSelectionView from './components/SeatSelectionView';
import ConfirmationView from './components/ConfirmationView';
import MyTicketsView from './components/MyTicketsView';
import HomeView from './components/HomeView';
import VenuesView from './components/VenuesView';
import EventDetailsView from './components/EventDetailsView';
import { Sparkles, Share2, Globe, Heart } from 'lucide-react';
import { fetchEvents } from './services/eventService';
import { fetchCurrentUser, logout as authLogout } from './services/authService';
import { reserveSeats, confirmBooking } from './services/bookingService';
import { mapApiEventToMusicEvent } from './utils/eventMapper';
import { ApiError } from './services/api';



function bookingsKey(userId: string): string {
  return `sortmyscene_bookings_${userId}`;
}

function loadStoredBookings(userId: string): Booking[] {
  try {
    const raw = localStorage.getItem(bookingsKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBookings(userId: string, bookings: Booking[]): void {
  localStorage.setItem(bookingsKey(userId), JSON.stringify(bookings));
}
// ─────────────────────────────────────────────────────────────────────────────

function apiUserToUser(apiUser: ApiUser): User {
  return {
    id: apiUser._id,
    name: apiUser.name,
    email: apiUser.email,
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
    status: 'Dreamer',
    memberSince: 'Member since 2026',
    festivalCount: 0,
    upcomingCount: 0,
  };
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<MusicEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);

  const [currentView, setCurrentView] = useState<
    | 'home'
    | 'events'
    | 'venues'
    | 'event-details'
    | 'seat-selection'
    | 'booking-confirmation'
    | 'my-tickets'
    | 'login'
    | 'signup'
  >('home');

  const [selectedEvent, setSelectedEvent] = useState<MusicEvent | null>(null);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  // Start with an empty array — bookings are loaded only once we know the user
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);

  const triggerNotification = useCallback((message: string) => {
    const id = Date.now();
    setToast({ message, id });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4500);
  }, []);

  const loadEvents = useCallback(async () => {
    setEventsLoading(true);
    setEventsError(null);
    try {
      const apiEvents = await fetchEvents();
      setEvents(apiEvents.map((e, i) => mapApiEventToMusicEvent(e, i)));
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to load events';
      setEventsError(msg);
      triggerNotification(`Could not load events: ${msg}`);
    } finally {
      setEventsLoading(false);
    }
  }, [triggerNotification]);

  // On mount: restore session and load that user's bookings
  useEffect(() => {
    const init = async () => {
      const apiUser = await fetchCurrentUser();
      if (apiUser) {
        const mappedUser = apiUserToUser(apiUser);
        setUser(mappedUser);
        // Load bookings that belong to THIS user only
        setBookings(loadStoredBookings(mappedUser.id));
      }
      setAuthLoading(false);
      await loadEvents();
    };
    init();
  }, [loadEvents]);

  // Restore wallet connection if previously connected
  useEffect(() => {
    const checkWalletConnection = async () => {
      const ethereum = (
        window as Window & {
          ethereum?: {
            request: (args: { method: string }) => Promise<string[]>;
            on?: (event: string, handler: (accounts: string[]) => void) => void;
            removeListener?: (
              event: string,
              handler: (accounts: string[]) => void
            ) => void;
          };
        }
      ).ethereum;
      if (ethereum?.request) {
        try {
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          if (accounts?.[0]) setWalletAddress(accounts[0]);
        } catch (err) {
          console.error('Error checking wallet connection:', err);
        }
      }
    };
    checkWalletConnection();
  }, []);

  const handleConnectWallet = async (): Promise<string> => {
    setIsWalletConnecting(true);
    const ethereum = (
      window as Window & {
        ethereum?: {
          request: (args: {
            method: string;
            params?: unknown[];
          }) => Promise<string[]>;
        };
      }
    ).ethereum;
    const demoWallet = '0x7a30cfde9f4d04934b12ec0ef4ec80004c1000';

    try {
      if (ethereum?.request) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts?.[0]) {
          setWalletAddress(accounts[0]);
          return accounts[0];
        }
      }
      setWalletAddress(demoWallet);
      return demoWallet;
    } catch {
      setWalletAddress(demoWallet);
      return demoWallet;
    } finally {
      setIsWalletConnecting(false);
    }
  };

  const handleDisconnectWallet = () => setWalletAddress(null);

  // ── Auth handlers ───────────────────────────────────────────────────────────

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    // Load THIS user's bookings from their own localStorage slot
    setBookings(loadStoredBookings(loggedInUser.id));
    triggerNotification(`Welcome back, ${loggedInUser.name}!`);
    setCurrentView('events');
  };

  const handleSignupSuccess = (newUser: User) => {
    setUser(newUser);
    // New user starts with empty bookings (loadStoredBookings returns [] for unknown key)
    setBookings(loadStoredBookings(newUser.id));
    triggerNotification(`Account created! Welcome, ${newUser.name}.`);
    setCurrentView('events');
  };

  const handleLogOut = () => {
    authLogout();
    setUser(null);
    setBookings([]); // Clear bookings from state so the next user starts fresh
    setSelectedEvent(null);
    triggerNotification('Logged out successfully.');
    setCurrentView('events');
  };

  // ── Booking handlers ────────────────────────────────────────────────────────

  const handleReserveSeats = async (
    eventId: string,
    selectedSeatsIds: string[]
  ): Promise<ReservationResult> => {
    if (!user) {
      triggerNotification('Please sign in to reserve seats.');
      setCurrentView('login');
      return { success: false, error: 'Authentication required' };
    }

    try {
      const data = await reserveSeats(eventId, selectedSeatsIds);
      return {
        success: true,
        reservationId: data.reservation._id,
        expiresAt: data.expiresAt,
        durationSeconds: data.durationSeconds,
      };
    } catch (err) {
      if (err instanceof ApiError) {
        const unavailableSeats = err.data.unavailableSeats as string[] | undefined;
        return { success: false, error: err.message, unavailableSeats };
      }
      return { success: false, error: 'Reservation failed. Please try again.' };
    }
  };

  const handleConfirmBooking = async (
    reservationId: string,
    selectedSeatsIds: string[]
  ): Promise<boolean> => {
    if (!selectedEvent || !user) return false;

    try {
      const data = await confirmBooking(reservationId);
      const seatPrice = selectedEvent.price;
      const subtotal = selectedSeatsIds.length * seatPrice;
      const bookingFee = subtotal * 0.08;

      const newBooking: Booking = {
        id: `NB-${Date.now().toString(36).toUpperCase()}`,
        eventId: selectedEvent.id,
        eventName: selectedEvent.title,
        eventDate: selectedEvent.date,
        stageName: selectedEvent.venue || selectedEvent.stage,
        seats: data.booking.seatNumbers.map((s) => `Seat ${s}`),
        subtotal,
        bookingFee,
        total: subtotal + bookingFee,
        bookedAt: new Date(data.booking.bookedAt).toLocaleString(),
        qrCodeUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ0hjTsGD9KgeGzimKMjesc0-__q4emkBF4yi3hlhdoww9z3jX3vkL33oSzOpH67kJV3LFci98Z2muDdxhKxnSgeyfstoQyYfw8HHqjrKgy6wKY4M7b5UCHU6CsXQRaqCN550HFFCz_awn8A27CG2F6j9ZqpY_EKF3pHbPc2f8e0KaBw3kLfy5Jpza3UG8YVnRjCuPBIOJy5ZnzufvBtseERNoONvNwD9h0rpJoEkHJMDM8fhGcUTH9x8PK4G3iAJAAeF_hF8u-vA',
      };

      const updated = [newBooking, ...bookings];
      setBookings(updated);
      // Save under THIS user's key — other users are never affected
      saveBookings(user.id, updated);

      setActiveBooking(newBooking);
      triggerNotification(`Booking confirmed! ${selectedSeatsIds.length} seat(s) secured.`);
      setCurrentView('booking-confirmation');
      await loadEvents();
      return true;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Booking failed';
      triggerNotification(msg);
      return false;
    }
  };

  // ── Navigation ──────────────────────────────────────────────────────────────

  const navigateToView = (
    view:
      | 'home'
      | 'events'
      | 'venues'
      | 'event-details'
      | 'seat-selection'
      | 'my-tickets'
      | 'login'
      | 'signup'
  ) => {
    if (view === 'my-tickets' && !user) {
      triggerNotification('Please sign in to view your bookings.');
      setCurrentView('login');
    } else if (view === 'seat-selection') {
      if (!selectedEvent && events.length > 0) {
        setSelectedEvent(events[0]);
      }
      setCurrentView('seat-selection');
    } else {
      setCurrentView(view);
    }
  };

  // ── Loading screen ──────────────────────────────────────────────────────────

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0b1326] flex items-center justify-center text-[#dae2fd]">
        <p className="text-sm font-mono animate-pulse">Loading SortMyScene...</p>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen bg-[#0b1326] text-[#dae2fd] overflow-x-hidden flex flex-col justify-between selection:bg-[#b76dff]/30">

      {toast && (
        <div className="fixed top-24 right-4 sm:right-6 z-50 max-w-[calc(100vw-2rem)] sm:max-w-sm glass-panel p-4 rounded-xl border-[#38bdf8]/30 bg-[#171f33]/90 shadow-2xl animate-in slide-in-from-right-4 duration-300 text-xs">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-spin flex-shrink-0" />
            <div className="text-left text-white leading-snug">{toast.message}</div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none z-0 bg-light-trail opacity-75"></div>

      <TopNavBar
        user={user}
        currentView={currentView}
        onNavigate={navigateToView}
        onLogOut={handleLogOut}
        onShowNotification={triggerNotification}
        walletAddress={walletAddress}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
        isWalletConnecting={isWalletConnecting}
      />

      <main className="flex-grow pt-24 pb-16 z-10 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">

        {currentView === 'home' && (
          <HomeView
            events={events}
            user={user}
            onSelectEvent={(ev) => {
              setSelectedEvent(ev);
              setCurrentView('event-details');
            }}
            onNavigate={navigateToView}
            onLogOut={handleLogOut}
          />
        )}

        {currentView === 'events' && (
          <EventsListView
            events={events}
            loading={eventsLoading}
            error={eventsError}
            onRetry={loadEvents}
            onSelectEvent={(ev) => {
              setSelectedEvent(ev);
              setCurrentView('event-details');
            }}
            onShowNotification={triggerNotification}
          />
        )}

        {currentView === 'venues' && (
          <VenuesView
            events={events}
            onSelectEventDetail={(ev) => {
              setSelectedEvent(ev);
              setCurrentView('event-details');
            }}
            onShowNotification={triggerNotification}
          />
        )}

        {currentView === 'event-details' && selectedEvent && (
          <EventDetailsView
            event={selectedEvent}
            user={user}
            onBack={() => setCurrentView('events')}
            onBookNow={(ev) => {
              setSelectedEvent(ev);
              setCurrentView('seat-selection');
            }}
            onShowNotification={triggerNotification}
          />
        )}

        {currentView === 'seat-selection' && selectedEvent && (
          <SeatSelectionView
            event={selectedEvent}
            user={user}
            onReserve={handleReserveSeats}
            onConfirm={handleConfirmBooking}
            onBack={() => {
              setSelectedEvent(null);
              setCurrentView('events');
            }}
            onNavigate={navigateToView}
            onShowNotification={triggerNotification}
            walletAddress={walletAddress}
            onConnectWallet={handleConnectWallet}
          />
        )}

        {currentView === 'booking-confirmation' && activeBooking && (
          <ConfirmationView
            booking={activeBooking}
            onNavigateToPasses={() => setCurrentView('my-tickets')}
            onNavigateToEvents={() => {
              setSelectedEvent(null);
              setActiveBooking(null);
              setCurrentView('events');
            }}
          />
        )}

        {currentView === 'my-tickets' && user && (
          <MyTicketsView
            user={user}
            bookings={bookings}
            onSelectBookingDetail={(b) => {
              setActiveBooking(b);
              setCurrentView('booking-confirmation');
            }}
            onNavigateToDiscovery={() => setCurrentView('events')}
            onShowNotification={triggerNotification}
          />
        )}

        {currentView === 'login' && (
          <LoginView
            onLoginSuccess={handleLoginSuccess}
            onNavigateToSignup={() => setCurrentView('signup')}
            onBackToEvents={() => setCurrentView('events')}
          />
        )}

        {currentView === 'signup' && (
          <SignUpView
            onSignupSuccess={handleSignupSuccess}
            onNavigateToLogin={() => setCurrentView('login')}
            onBackToEvents={() => setCurrentView('events')}
          />
        )}

      </main>

      <footer className="relative z-10 border-t border-white/5 bg-[#060e20] py-12 px-6 md:px-12 select-none">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 text-center md:text-left space-y-3">
            <h2 className="font-display font-black text-white italic text-lg tracking-tighter">
              NEONBEAT
            </h2>
            <p className="text-xs text-[#cfc2d6] leading-relaxed max-w-sm">
              Event ticket booking with real-time seat reservation and atomic
              double-booking prevention.
            </p>
          </div>
          <div className="md:col-span-4 flex justify-center gap-6 text-xs text-[#cfc2d6]">
            <button
              type="button"
              onClick={() => setCurrentView('events')}
              className="hover:text-white hover:underline transition-all"
            >
              Lineup
            </button>
            <a href="#" className="hover:text-white hover:underline transition-all">
              Privacy
            </a>
            <a href="#" className="hover:text-white hover:underline transition-all">
              Support
            </a>
          </div>
          <div className="md:col-span-4 flex justify-center md:justify-end gap-3">
            <button
              type="button"
              onClick={() => triggerNotification('Share link copied.')}
              className="p-2 border border-[#cfc2d6]/10 rounded-full hover:border-[#ddb7ff] text-[#ddb7ff] transition-all bg-white/5 hover:scale-105"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => triggerNotification('API status: connected.')}
              className="p-2 border border-[#cfc2d6]/10 rounded-full hover:border-[#ddb7ff] text-[#ddb7ff] transition-all bg-white/5 hover:scale-105"
            >
              <Globe className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-[#dae2fd]/5 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 gap-4">
          <p className="font-mono">© 2024 - 2026 SORTMYSCENE. ALL RIGHTS RESERVED.</p>
          <p className="flex items-center gap-1">
            Made with{' '}
            <Heart className="w-3 h-3 text-rose-500 fill-current animate-pulse" /> for
            event lovers
          </p>
        </div>
      </footer>
    </div>
  );
}
