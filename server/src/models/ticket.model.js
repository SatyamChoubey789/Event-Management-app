const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true, // Ensures each ticket ID is unique
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // This links the ticket to a specific user
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true, // Links the ticket to a specific event
    },
    status: {
      type: String,
      enum: ["booked", "cancelled", "pending","refunded"], // You can add more ticket statuses if needed
      default: "booked",
    },
    qrCode: {
      type: String, // Store QR code as a URL (data URL or an image URL)
      required: false, // Only populate this after approval
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create the Ticket model based on the schema
const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
