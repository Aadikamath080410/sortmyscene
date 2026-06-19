import { Venue } from '../types';

export const mockVenues: Venue[] = [
  {
    id: 'foundry-warehouse',
    name: 'The Foundry Art Warehouse',
    stage: 'Creative Gigs',
    address: '404 Maker Alley, Creative District',
    capacity: 450,
    description: 'An expansive industrial space featuring raw concrete acoustics, state-of-the-art interactive modular projection screens, and warm ambient neon illumination networks.',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1000',
    features: ['Modular Neon Arrays', 'Multi-channel Surround Array', 'Digital Projection Walls', 'Outdoor Chill Garden', 'Local Craft Beverage Stations'],
    coordinates: 'Lat 45.5152° N, Lon 122.6784° W'
  },
  {
    id: 'greenhouse-gardens',
    name: 'Central Meadow Greenhouse & Gardens',
    stage: 'Community Hub',
    address: '101 Parkside Avenue, Central Park',
    capacity: 350,
    description: 'A spectacular, climate-controlled glass dome oasis filled with exotic botanical arrays, offering natural spatial reverberation and high-fidelity sound bath integrations.',
    imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=1000',
    features: ['Sonic Transparency Glass', 'Solar Powered Grid', 'Preloaded Beanbag Seating', 'Organic Tea & Cider Labs', 'Interactive Plant Sensors'],
    coordinates: 'Lat 45.5230° N, Lon 122.6678° W'
  },
  {
    id: 'vista-cloud-lounge',
    name: 'The Vista Cloud Lounge & Deck',
    stage: 'Social Space',
    address: '777 Heights Tower (Penthouse Deck), Downtown',
    capacity: 200,
    description: 'Perched 30 stories high, enjoying panoramic 360-degree metropolitan glass sunset vistas, cozy fire pit arrangements, and a legendary high-end vinyl hifi audiophile playback arrays.',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1000',
    features: ['360° Skydeck Vistas', 'Audiophile Vinyl System', 'Premium Cozy Fire Pits', 'Zero-Proof Elixir Bar', 'Heated Glass Barriers'],
    coordinates: 'Lat 45.5084° N, Lon 122.6821° W'
  }
];
