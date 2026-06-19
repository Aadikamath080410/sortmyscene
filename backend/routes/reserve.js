const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Seat = require("../models/Seat");
const Reservation = require("../models/Reservation");
const Event = require("../models/Event");
const { protect } = require("../middleware/auth");

const RESERVATION_DURATION_MS = 10 * 60 * 1000; // 10 minutes

// @route   POST /api/reserve
// @desc    Atomically reserve available seats for a user for 10 minutes.
//          Uses a MongoDB session + transaction to prevent double booking.
// @access  Private
router.post("/", protect, async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { eventId, seatNumbers } = req.body;
    const userId = req.user._id;

    // --- Input validation ---
    if (!eventId || !seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({
        message: "eventId and a non-empty seatNumbers array are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid eventId" });
    }

    // Sanitize & deduplicate seat numbers
    const uniqueSeats = [...new Set(seatNumbers.map((s) => String(s).trim()))];

    session.startTransaction();

    // --- Verify event exists ---
    const event = await Event.findById(eventId).session(session);
    if (!event) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Event not found" });
    }

    // --- Check all requested seats are available (atomic read inside transaction) ---
    const seats = await Seat.find({
      eventId,
      seatNumber: { $in: uniqueSeats },
      status: "available",
    }).session(session);

    if (seats.length !== uniqueSeats.length) {
      // Identify which seats are not available to give a helpful error
      const foundSeatNumbers = seats.map((s) => s.seatNumber);
      const unavailable = uniqueSeats.filter(
        (sn) => !foundSeatNumbers.includes(sn)
      );

      await session.abortTransaction();
      return res.status(409).json({
        message: "One or more selected seats are no longer available",
        unavailableSeats: unavailable,
      });
    }

    const expiresAt = new Date(Date.now() + RESERVATION_DURATION_MS);

    // --- Atomically flip seats from "available" → "reserved" ---
    const updateResult = await Seat.updateMany(
      {
        eventId,
        seatNumber: { $in: uniqueSeats },
        status: "available", // Double-check status in the update filter itself
      },
      { $set: { status: "reserved" } },
      { session }
    );

    // If somehow fewer seats were updated (race condition caught here), abort
    if (updateResult.modifiedCount !== uniqueSeats.length) {
      await session.abortTransaction();
      return res.status(409).json({
        message: "Seats were taken by another user. Please try again.",
      });
    }

    // --- Create the reservation record ---
    const [reservation] = await Reservation.create(
      [
        {
          userId,
          eventId,
          seatNumbers: uniqueSeats,
          expiresAt,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      message: "Seats reserved successfully",
      reservation: {
        _id: reservation._id,
        eventId: reservation.eventId,
        seatNumbers: reservation.seatNumbers,
        expiresAt: reservation.expiresAt,
      },
      expiresAt,
      durationSeconds: RESERVATION_DURATION_MS / 1000,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("POST /api/reserve error:", error);
    res.status(500).json({ message: "Reservation failed. Please try again." });
  } finally {
    session.endSession();
  }
});

module.exports = router;
