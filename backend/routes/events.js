const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Event = require("../models/Event");
const Seat = require("../models/Seat");
const Reservation = require("../models/Reservation");

// Release seats held by expired reservations so they don't stay stuck as "reserved"
const releaseExpiredReservations = async (eventId) => {
  const expired = await Reservation.find({
    eventId,
    expiresAt: { $lt: new Date() },
  });

  for (const reservation of expired) {
    await Seat.updateMany(
      {
        eventId: reservation.eventId,
        seatNumber: { $in: reservation.seatNumbers },
        status: "reserved",
      },
      { $set: { status: "available" } }
    );
    await Reservation.findByIdAndDelete(reservation._id);
  }
};

// @route   GET /api/events
// @desc    Retrieve all events with available seat counts
// @access  Public
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ dateTime: 1 });

    // Attach seat availability summary to each event
    const eventsWithSeats = await Promise.all(
      events.map(async (event) => {
        const seatCounts = await Seat.aggregate([
          { $match: { eventId: event._id } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        const counts = { available: 0, reserved: 0, booked: 0 };
        seatCounts.forEach(({ _id, count }) => {
          counts[_id] = count;
        });

        return {
          ...event.toObject(),
          seatSummary: counts,
        };
      })
    );

    res.json(eventsWithSeats);
  } catch (error) {
    console.error("GET /api/events error:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// @route   GET /api/events/:id
// @desc    Retrieve a single event with its full seat grid
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await releaseExpiredReservations(id);

    // Fetch all seats for this event, sorted by seat number
    const seats = await Seat.find({ eventId: id }).sort({ seatNumber: 1 });

    res.json({
      ...event.toObject(),
      seats,
    });
  } catch (error) {
    console.error("GET /api/events/:id error:", error);
    res.status(500).json({ message: "Failed to fetch event details" });
  }
});

module.exports = router;
