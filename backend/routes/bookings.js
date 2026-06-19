const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Seat = require("../models/Seat");
const Reservation = require("../models/Reservation");
const Booking = require("../models/Booking");
const { protect } = require("../middleware/auth");

// @route   POST /api/bookings
// @desc    Confirm a reservation: marks seats as "booked", saves a permanent
//          Booking record, and deletes the reservation.
// @access  Private
router.post("/", protect, async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { reservationId } = req.body;
    const userId = req.user._id;

    if (!reservationId) {
      return res.status(400).json({ message: "reservationId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(reservationId)) {
      return res.status(400).json({ message: "Invalid reservationId" });
    }

    session.startTransaction();

    const reservation = await Reservation.findById(reservationId).session(session);

    if (!reservation) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "Reservation not found. It may have already expired or been used.",
      });
    }

    // Ownership check
    if (reservation.userId.toString() !== userId.toString()) {
      await session.abortTransaction();
      return res.status(403).json({
        message: "You are not authorised to confirm this reservation",
      });
    }

    // Expiry check
    if (reservation.expiresAt < new Date()) {
      await Seat.updateMany(
        {
          eventId: reservation.eventId,
          seatNumber: { $in: reservation.seatNumbers },
          status: "reserved",
        },
        { $set: { status: "available" } },
        { session }
      );
      await Reservation.findByIdAndDelete(reservationId, { session });
      await session.commitTransaction();

      return res.status(410).json({
        message: "Reservation has expired. Seats have been released. Please reserve again.",
      });
    }

    // Atomically flip seats from "reserved" → "booked"
    const updateResult = await Seat.updateMany(
      {
        eventId: reservation.eventId,
        seatNumber: { $in: reservation.seatNumbers },
        status: "reserved",
      },
      { $set: { status: "booked" } },
      { session }
    );

    if (updateResult.modifiedCount !== reservation.seatNumbers.length) {
      await session.abortTransaction();
      return res.status(409).json({
        message: "One or more seats could not be confirmed. Please try again.",
      });
    }

    // ✅ Save a permanent Booking record per seat so profile page works correctly
    const bookingDocs = reservation.seatNumbers.map((seatNumber) => ({
      userId,
      eventId: reservation.eventId,
      seatNumbers: [seatNumber],
      bookedAt: new Date(),
      status: "confirmed",
    }));
    await Booking.insertMany(bookingDocs, { session });

    // Delete the fulfilled reservation
    await Reservation.findByIdAndDelete(reservationId, { session });

    await session.commitTransaction();

    res.status(200).json({
      message: "Booking confirmed successfully! 🎉",
      booking: {
        eventId: reservation.eventId,
        seatNumbers: reservation.seatNumbers,
        userId: reservation.userId,
        bookedAt: new Date(),
      },
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("POST /api/bookings error:", error);
    res.status(500).json({ message: "Booking failed. Please try again." });
  } finally {
    session.endSession();
  }
});

// @route   GET /api/bookings/my
// @desc    Get all confirmed bookings for the logged-in user only
// @access  Private
router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user._id,   // ← strictly filtered by logged-in user
      status: "confirmed",
    })
      .populate("eventId", "name dateTime venue image price category")
      .sort({ bookedAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("GET /api/bookings/my error:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

module.exports = router;
