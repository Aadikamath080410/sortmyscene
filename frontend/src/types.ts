/**
 * Core type interfaces for NEONBEAT Ticket platform.
 */

export interface ApiUser {
  _id: string;
  name: string;
  email: string;
}

export interface ApiEvent {
  _id: string;
  name: string;
  dateTime: string;
  venue: string;
  totalSeats: number;
  description?: string;
  seatSummary?: {
    available: number;
    reserved: number;
    booked: number;
  };
}

export interface ApiSeat {
  _id: string;
  eventId: string;
  seatNumber: string;
  status: 'available' | 'reserved' | 'booked';
}

export interface ApiEventDetail extends ApiEvent {
  seats: ApiSeat[];
}

export interface ApiReservationResponse {
  message: string;
  reservation: {
    _id: string;
    eventId: string;
    seatNumbers: string[];
    expiresAt: string;
  };
  expiresAt: string;
  durationSeconds: number;
}

export interface ApiBookingResponse {
  message: string;
  booking: {
    eventId: string;
    seatNumbers: string[];
    userId: string;
    bookedAt: string;
  };
}

export interface ReservationResult {
  success: boolean;
  reservationId?: string;
  expiresAt?: string;
  durationSeconds?: number;
  error?: string;
  unavailableSeats?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'Dreamer' | 'VIP' | 'Legend';
  memberSince: string;
  festivalCount: number;
  upcomingCount: number;
}

export type SeatState = 'available' | 'booked' | 'reserved' | 'selected';

export interface Seat {
  id: string;
  row: string;
  col: number;
  state: SeatState;
  price: number;
  category: string;
}

export type EventStage = 'Creative Gigs' | 'Community Hub' | 'Social Space';

export interface MusicEvent {
  id: string;
  title: string;
  stage: EventStage;
  venue?: string;
  price: number;
  description: string;
  longDescription: string;
  date: string;
  time: string;
  imageUrl: string;
  isLive?: boolean;
  isFree?: boolean;
  artists: string[];
  seatSummary?: {
    available: number;
    reserved: number;
    booked: number;
  };
}

export interface Booking {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  stageName: string;
  seats: string[];
  subtotal: number;
  bookingFee: number;
  total: number;
  bookedAt: string;
  qrCodeUrl: string;
}

export interface Venue {
  id: string;
  name: string;
  stage: EventStage;
  address: string;
  capacity: number;
  description: string;
  imageUrl: string;
  features: string[];
  coordinates: string;
}
