const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    seatNumber: {
      type: String,
      required: [true, "Seat number is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["available", "reserved", "booked"],
      default: "available",
      index: true,
    },
  },
  { timestamps: true }
);

// Compound unique index — a seat number must be unique within an event
seatSchema.index({ eventId: 1, seatNumber: 1 }, { unique: true });

module.exports = mongoose.model("Seat", seatSchema);
