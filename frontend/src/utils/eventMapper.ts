import { ApiEvent, ApiSeat, EventStage, MusicEvent, Seat, SeatState } from '../types';

const EVENT_IMAGES = [
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000',
];

const STAGES: EventStage[] = ['Creative Gigs', 'Community Hub', 'Social Space'];

const DEFAULT_PRICE = 149;

function formatEventDate(dateTime: string): string {
  return new Date(dateTime).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatEventTime(dateTime: string): string {
  return new Date(dateTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function inferArtists(name: string): string[] {
  const beforeColon = name.split(':')[0]?.trim();
  if (beforeColon && beforeColon !== name) {
    return [beforeColon];
  }
  return ['Live Performance'];
}

export function mapApiEventToMusicEvent(apiEvent: ApiEvent, index = 0): MusicEvent {
  const stage = STAGES[index % STAGES.length];

  return {
    id: apiEvent._id,
    title: apiEvent.name,
    stage,
    venue: apiEvent.venue,
    price: DEFAULT_PRICE,
    description: apiEvent.description || 'An unforgettable live experience.',
    longDescription: apiEvent.description || 'Join us for an incredible event.',
    date: formatEventDate(apiEvent.dateTime),
    time: formatEventTime(apiEvent.dateTime),
    imageUrl: EVENT_IMAGES[index % EVENT_IMAGES.length],
    artists: inferArtists(apiEvent.name),
    seatSummary: apiEvent.seatSummary,
  };
}

function parseSeatNumber(seatNumber: string): { row: string; col: number } {
  const match = seatNumber.match(/^([A-Z]+)(\d+)$/);
  if (match) {
    return { row: match[1], col: parseInt(match[2], 10) };
  }
  return { row: seatNumber.charAt(0), col: parseInt(seatNumber.slice(1), 10) || 1 };
}

export function mapApiSeatsToSeats(apiSeats: ApiSeat[], price: number): Seat[] {
  return apiSeats.map((apiSeat) => {
    const { row, col } = parseSeatNumber(apiSeat.seatNumber);
    const state = apiSeat.status as SeatState;

    return {
      id: apiSeat.seatNumber,
      row,
      col,
      state,
      price,
      category: row === 'A' || row === 'B' ? 'Floor Zone A (Front)' : 'Floor Zone B',
    };
  });
}
