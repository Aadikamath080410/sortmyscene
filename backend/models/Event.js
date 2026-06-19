const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    dateTime: { type: Date, required: true },
    venue: { type: String, required: true, trim: true },
    totalSeats: { type: Number, required: true, min: 1 },
    description: { type: String, trim: true, default: "" },
    price: { type: Number, default: 149 },
    category: {
      type: String,
      enum: ["Creative Gigs", "Community Hub", "Social Space", "Underground", "Festival", "Film & Arts", "Tech & Culture"],
      default: "Social Space",
    },
    image: { type: String, default: "" },
    venueProfile: {
      name: { type: String, default: "" },
      description: { type: String, default: "" },
      image: { type: String, default: "" },
    },
    lineup: [
      {
        name: { type: String },
        role: { type: String },
      },
    ],
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);