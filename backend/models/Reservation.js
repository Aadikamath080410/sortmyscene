const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    seatNumbers: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one seat number is required",
      },
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // MongoDB TTL index — auto-deletes expired docs
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
