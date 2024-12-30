const Event = require("../models/event.model");
const Ticket = require("../models/ticket.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const {
  generateQRCode,
  generateEventId,
  generateTicketId,
} = require("../utils/GenerateIDs");

// Create a new event
const createEvent = asyncHandler(async (req, res) => {
  const { name, description, date, location } = req.body;

  if (!name || !description || !date || !location) {
    throw new ApiError(400, "All fields are required");
  }

  // Generate a unique eventId
  const eventId = generateEventId();

  // Create the event with the generated eventId
  const event = await Event.create({
    eventId, // Use the generated eventId
    name,
    description,
    date,
    location,
    organizer: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Event created successfully",
    event,
  });
});

// Get all events created by the organizer
const getMyEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ organizer: req.user._id });
  res.status(200).json({
    success: true,
    events,
  });
});

// Update an event
const updateEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params; // Use eventId from request params
  const { name, description, date, location } = req.body;

  const event = await Event.findOneAndUpdate(
    { eventId, organizer: req.user._id }, // Use eventId instead of _id
    { name, description, date, location },
    { new: true }
  );

  if (!event) {
    throw new ApiError(404, "Event not found or not authorized");
  }

  res.status(200).json({
    success: true,
    message: "Event updated successfully",
    event,
  });
});

// Admin approval/rejection of an event
const handleEventApproval = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'

  if (!["approved", "rejected"].includes(status)) {
    throw new ApiError(400, "Invalid approval status");
  }

  const event = await Event.findOne({ eventId });
  if (!event) throw new ApiError(404, "Event not found");

  event.approvalStatus = status;

  // Generate QR codes if approved
  if (status === "approved") {
    for (const attendee of event.attendees) {
      const qrCode = await generateQRCode(event.eventId, attendee.ticketId);
      await Ticket.findOneAndUpdate(
        { ticketId: attendee.ticketId },
        { qrCode }
      );
    }
  }

  await event.save();

  res.status(200).json({
    success: true,
    message: `Event ${status} successfully`,
    event,
  });
});

// Register for an event
const registerForEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params; // Extract eventId from request params

  const event = await Event.findOne({ eventId }); // Use eventId to find the event
  if (!event) return res.status(404).json({ message: "Event not found" });

  // Check if the user is already registered for the event
  if (
    event.attendees.some(
      (attendee) => String(attendee.user) === String(req.user.id)
    )
  ) {
    return res
      .status(400)
      .json({ message: "You are already registered for this event" });
  }

  // Generate a unique ticket ID
  const newTicketId = generateTicketId(); // Use the function to generate a ticket ID

  // Create the new ticket with the generated ticket ID
  const newTicket = new Ticket({
    ticketId: newTicketId, // Use the generated ticket ID
    user: req.user.id,
    event: event._id, // Reference the event by its MongoDB _id
  });

  // Save the ticket to the database
  await newTicket.save();

  // Add the user and ticket ID to the event's attendees
  event.attendees.push({ user: req.user.id, ticketId: newTicketId });
  await event.save();

  // Respond with a success message
  res.status(200).json({
    message: "Registered for event successfully",
    ticket: newTicket, // Return the generated ticket
    event,
  });
});

// Deregister from an event
const deregisterEvent = asyncHandler(async (req, res) => {
  const { eventId, ticketId } = req.params; // Use both eventId and ticketId from request params

  const event = await Event.findOne({ eventId });
  if (!event) return res.status(404).json({ message: "Event not found" });

  const ticket = event.attendees.find(
    (attendee) => String(attendee.user) === String(req.user.id)
  );

  if (!ticket) {
    return res
      .status(404)
      .json({ message: "Ticket not found or you are not registered" });
  }

  event.attendees = event.attendees.filter(
    (attendee) => String(attendee.ticketId) !== String(ticketId)
  );

  await event.save();
  await Ticket.findByIdAndDelete(ticket._id);

  res.status(200).json({
    message: "Deregistered from event successfully",
    event,
  });
});

module.exports = {
  createEvent,
  getMyEvents,
  updateEvent,
  approveEvent: handleEventApproval, // Unified approval handling
  registerForEvent,
  deregisterEvent,
}
