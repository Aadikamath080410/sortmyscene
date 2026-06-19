/**
 * seed.js — Populates MongoDB with rich sample events and seats.
 * Usage: node seed.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Event = require("./models/Event");
const Seat = require("./models/Seat");

dotenv.config();

const sampleEvents = [
  {
    name: "Coldplay: Music of the Spheres World Tour",
    dateTime: new Date("2025-08-15T19:30:00"),
    venue: "DY Patil Stadium, Navi Mumbai",
    totalSeats: 50,
    price: 4999,
    category: "Creative Gigs",
    description: "One of the most spectacular live shows on earth comes to Mumbai. Coldplay's Music of the Spheres tour features an immersive LED wristband experience, jaw-dropping pyrotechnics, and a setlist spanning three decades of anthems — from Yellow to My Universe.",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    venueProfile: {
      name: "DY Patil Stadium",
      description: "Mumbai's largest outdoor stadium with a seating capacity of 55,000. Renowned for its state-of-the-art acoustics, massive LED screens, and seamless crowd management systems built for world-class international acts.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    },
    lineup: [
      { name: "Coldplay", role: "Headliner" },
      { name: "H.E.R.", role: "Special Guest" },
      { name: "Local Natives", role: "Support Act" },
    ],
    tags: ["Live Music", "International", "Stadium", "Pop Rock", "Family Friendly"],
  },
  {
    name: "Sunburn Festival 2025",
    dateTime: new Date("2025-12-27T16:00:00"),
    venue: "Vagator Beach, Goa",
    totalSeats: 60,
    price: 2999,
    category: "Festival",
    description: "Asia's biggest electronic dance music festival returns to the sun-drenched shores of Goa. Three days of non-stop music across six stages, with global headliners, sunrise sets on the beach, and the legendary Sunburn atmosphere that draws over 200,000 fans every year.",
    image: "https://images.unsplash.com/photo-1574039677524-9cddedd4e9d1?w=800&q=80",
    venueProfile: {
      name: "Vagator Beach, Goa",
      description: "An iconic stretch of Goa's northern coastline transformed into a festival city every December. Six stages, premium camping zones, artisan food villages, and uninterrupted ocean views make this the most coveted festival destination in Asia.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    },
    lineup: [
      { name: "Martin Garrix", role: "Headliner" },
      { name: "Amelie Lens", role: "Headliner" },
      { name: "KSHMR", role: "Main Stage" },
      { name: "Ritviz", role: "India Spotlight" },
      { name: "Nucleya", role: "India Spotlight" },
    ],
    tags: ["EDM", "Festival", "Beach", "3-Day Event", "Camping"],
  },
  {
    name: "Mumbai Film Festival — Opening Night Gala",
    dateTime: new Date("2025-10-20T18:00:00"),
    venue: "Liberty Cinema, Mumbai",
    totalSeats: 30,
    price: 1499,
    category: "Film & Arts",
    description: "The curtain rises on South Asia's most prestigious film festival with an exclusive opening night gala. This year's edition premieres a critically acclaimed international co-production followed by a curated panel discussion featuring the director, lead cast, and festival jury members.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    venueProfile: {
      name: "Liberty Cinema",
      description: "A Grade I heritage landmark of Mumbai's art deco era, Liberty Cinema has screened legendary films since 1949. Fully restored with Dolby Atmos sound and modern projection while retaining its iconic single-screen grandeur and ornate interiors.",
      image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80",
    },
    lineup: [
      { name: "Opening Film Premiere", role: "Main Screening" },
      { name: "Director Q&A", role: "Panel Discussion" },
      { name: "Jury Announcement", role: "Ceremony" },
    ],
    tags: ["Film", "Cinema", "Gala", "Panel Discussion", "Heritage Venue"],
  },
  {
    name: "Arijit Singh Live — Ek Shaam Arijit Ke Naam",
    dateTime: new Date("2025-09-06T19:00:00"),
    venue: "MMRDA Grounds, BKC, Mumbai",
    totalSeats: 50,
    price: 2499,
    category: "Creative Gigs",
    description: "India's most beloved voice performs live in an intimate yet spectacular concert experience. Arijit Singh takes you on a journey through his most iconic compositions — from Tum Hi Ho and Channa Mereya to Kesariya — accompanied by a full live orchestra of 40 musicians.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    venueProfile: {
      name: "MMRDA Grounds, BKC",
      description: "Mumbai's premier open-air concert venue at the heart of the Bandra-Kurla Complex. With a sprawling 60,000 sq. ft. ground, top-tier sound infrastructure, and excellent metro connectivity, MMRDA is the go-to destination for major live events in the city.",
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
    },
    lineup: [
      { name: "Arijit Singh", role: "Headliner" },
      { name: "Live Orchestra (40 Musicians)", role: "Live Band" },
      { name: "Shilpa Rao", role: "Special Guest" },
    ],
    tags: ["Bollywood", "Live Music", "Orchestra", "Romantic", "Hindi"],
  },
  {
    name: "NH7 Weekender 2025",
    dateTime: new Date("2025-11-28T14:00:00"),
    venue: "Mahalaxmi Racecourse, Mumbai",
    totalSeats: 55,
    price: 1999,
    category: "Community Hub",
    description: "The Happiest Music Festival on Earth is back! NH7 Weekender 2025 brings together indie, alternative, hip-hop, and electronic acts across four stages over two days. Expect an eclectic mix of homegrown talent and international acts in a warm, community-driven atmosphere.",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    venueProfile: {
      name: "Mahalaxmi Racecourse",
      description: "Set against Mumbai's stunning skyline, the Mahalaxmi Racecourse transforms into a festival paradise every winter. Sprawling green grounds, multiple stage zones, curated food courts with over 40 vendors, and easy access from South Mumbai make it the perfect festival backdrop.",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    },
    lineup: [
      { name: "Prateek Kuhad", role: "Headliner" },
      { name: "When Chai Met Toast", role: "Main Stage" },
      { name: "Divine", role: "Hip-Hop Stage" },
      { name: "Bloodywood", role: "Rock Stage" },
      { name: "Dualist Inquiry", role: "Electronic Stage" },
    ],
    tags: ["Indie", "Multi-Stage", "2-Day", "Alternative", "Homegrown"],
  },
  {
    name: "Dark Matter: Mumbai Underground Techno Night",
    dateTime: new Date("2025-09-20T22:00:00"),
    venue: "The Foundry Art Warehouse, Lower Parel",
    totalSeats: 25,
    price: 999,
    category: "Underground",
    description: "Mumbai's most immersive underground techno experience returns to The Foundry. Six hours of relentless dark techno, industrial beats, and experimental electronics in a raw warehouse space transformed with projection mapping, fog machines, and spatial audio. Strictly 18+.",
    image: "https://images.unsplash.com/photo-1571266028243-3716f4b14a4a?w=800&q=80",
    venueProfile: {
      name: "The Foundry Art Warehouse",
      description: "An expansive industrial space in Lower Parel featuring raw concrete acoustics, state-of-the-art interactive modular projection screens, and warm ambient neon illumination networks. Formerly a textile mill, now Mumbai's most celebrated underground event space.",
      image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80",
    },
    lineup: [
      { name: "Alignment", role: "Headliner" },
      { name: "Blawan", role: "Special Guest" },
      { name: "Kohra", role: "Mumbai Resident" },
      { name: "Sandunes", role: "Opening Set" },
    ],
    tags: ["Techno", "Underground", "18+", "Late Night", "Warehouse"],
  },
  {
    name: "LOL Mumbai: Stand-Up Comedy Special",
    dateTime: new Date("2025-10-04T20:00:00"),
    venue: "G5A Foundation for Contemporary Culture, Mumbai",
    totalSeats: 35,
    price: 799,
    category: "Social Space",
    description: "A curated evening of stand-up comedy featuring Mumbai's finest comedians alongside rising stars from Delhi and Bangalore. Expect sharp social commentary, personal storytelling, and laugh-out-loud crowd work across two back-to-back sets. Seating is cabaret-style with drinks available.",
    image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80",
    venueProfile: {
      name: "G5A Foundation for Contemporary Culture",
      description: "A beautifully converted century-old mill building in Mahalaxmi that houses Mumbai's most intimate performance space. With a capacity of just 200, every seat offers a personal connection to the performers. Known for nurturing independent artists and unconventional performances.",
      image: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80",
    },
    lineup: [
      { name: "Zakir Khan", role: "Headliner" },
      { name: "Kaneez Surka", role: "Feature Act" },
      { name: "Rahul Subramanian", role: "Feature Act" },
      { name: "Aakash Gupta", role: "Opening Act" },
    ],
    tags: ["Comedy", "Stand-Up", "Hindi", "English", "Intimate Venue"],
  },
  {
    name: "Mumbai Creator Summit 2025",
    dateTime: new Date("2025-11-08T10:00:00"),
    venue: "Jio World Convention Centre, BKC",
    totalSeats: 40,
    price: 3499,
    category: "Tech & Culture",
    description: "Where technology meets creativity. The Mumbai Creator Summit brings together 50+ speakers across product design, AI, music production, filmmaking, and content creation. Full-day event with keynotes, workshops, portfolio reviews, and a closing networking mixer.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    venueProfile: {
      name: "Jio World Convention Centre",
      description: "India's largest and most technologically advanced convention centre, spread across 18 acres in BKC. Equipped with AI-powered translation booths, broadcast-ready auditoriums, high-speed Wi-Fi throughout, and a premium F&B experience spanning multiple curated outlets.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    },
    lineup: [
      { name: "Nikhil Kamath", role: "Keynote Speaker" },
      { name: "Ankur Warikoo", role: "Keynote Speaker" },
      { name: "AI & Product Panel", role: "Panel Discussion" },
      { name: "Music Production Workshop", role: "Workshop" },
      { name: "Networking Mixer", role: "Closing Event" },
    ],
    tags: ["Tech", "Creators", "Networking", "Workshops", "Day Event"],
  },
];

const generateSeats = (eventId, totalSeats) => {
  const seats = [];
  for (let i = 1; i <= totalSeats; i++) {
    const row = String.fromCharCode(65 + Math.floor((i - 1) / 10));
    const col = ((i - 1) % 10) + 1;
    seats.push({
      eventId,
      seatNumber: `${row}${col}`,
      status: "available",
    });
  }
  return seats;
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    await Event.deleteMany({});
    await Seat.deleteMany({});
    console.log("Cleared existing events and seats.");

    const createdEvents = await Event.insertMany(sampleEvents);
    console.log(`\nInserted ${createdEvents.length} events:\n`);

    for (const event of createdEvents) {
      const seats = generateSeats(event._id, event.totalSeats);
      await Seat.insertMany(seats);
      console.log(`   "${event.name}" — ${seats.length} seats`);
    }

    const totalSeats = sampleEvents.reduce((sum, e) => sum + e.totalSeats, 0);
    console.log(`\n  Total: ${createdEvents.length} events, ${totalSeats} seats`);
    console.log("✅ Database seeded successfully!\n");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();