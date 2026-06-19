import { apiFetch } from './api';
import { ApiBookingResponse, ApiReservationResponse,Booking } from '../types';

export async function reserveSeats(
  eventId: string,
  seatNumbers: string[]
): Promise<ApiReservationResponse> {
  return apiFetch<ApiReservationResponse>(
    '/api/reserve',
    {
      method: 'POST',
      body: JSON.stringify({ eventId, seatNumbers }),
    },
    true
  );
}

export async function confirmBooking(
  reservationId: string
): Promise<ApiBookingResponse> {
  return apiFetch<ApiBookingResponse>(
    '/api/bookings',
    {
      method: 'POST',
      body: JSON.stringify({ reservationId }),
    },
    true
  );
}
// Add this to bookingService.ts
export async function getMyBookings(): Promise<Booking[]> {
  return apiFetch<Booking[]>(
    '/api/bookings/my',
    { method: 'GET' },
    true  // ← sends the auth token, so backend filters by logged-in user
  );
}