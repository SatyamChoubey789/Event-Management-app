const Event = require("../models/event.model");
const User = require("../models/user.model");
const Ticket = require("../models/ticket.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const {
  generateQRCode,
} = require("../utils/GenerateIDs");

// Create a new event
const createEvent = asyncHandler(async (req, res) => {
  const { name, description, date, location } = req.body;

  if (!name || !description || !date || !location) {
    throw new ApiError(400, "All fields are required");
  }

  // Create the event and associate it with the authenticated organizer
  const event = await Event.create({
    name,
    description,
    date,
    location,
    organizer: req.user._id, // Link the event to the organizer (authenticated user)
  });

  res.status(201).json({
    success: true,
    message: "Event created successfully",
    event,
  });
});

// Get all events created by the organizer
const getMyEvents = asyncHandler(async (req, res) => {
  // Fetch events where the organizer is the logged-in user
  const events = await Event.find({ organizer: req.user._id });

  res.status(200).json({
    success: true,
    events,
  });
});

// Update an event
const updateEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params; // Use eventId from the request params
  const { name, description, date, location } = req.body;

  // Find and update the event. It must be created by the authenticated user.
  const event = await Event.findOneAndUpdate(
    { _id: eventId, organizer: req.user._id }, // Ensure the event belongs to the user
    { name, description, date, location }, // Fields to update
    { new: true } // Return the updated event
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

// Delete an event
const deleteEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params; // Use eventId from the request params

  // Find the event by ID and ensure it belongs to the authenticated user
  const event = await Event.findOneAndDelete({
    _id: eventId,
    organizer: req.user._id, // Ensure the user has permission to delete the event
  });

  if (!event) {
    throw new ApiError(404, "Event not found or not authorized");
  }

  res.status(200).json({
    success: true,
    message: "Event deleted successfully",
  });
});

// get pending approval of events
const getPendingApprovalEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({
    organizer: req.user._id,
    approvalStatus: "requested", // Assuming `approvalStatus` exists
  });

  res.status(200).json({
    success: true,
    events,
  });
});

// update organizer profile
const updateOrganizerProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const updatedOrganizer = await User.findByIdAndUpdate(
    req.user._id, // Assuming `req.user._id` holds the authenticated user's ID
    { name, email },
    { new: true } // Return updated organizer
  );

  if (!updatedOrganizer) throw new ApiError(404, "Organizer not found");

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    organizer: updatedOrganizer,
  });
});

// get profile  information of the organizer
const getOrganizerProfile = asyncHandler(async (req, res) => {
  const organizer = req.user; // Assuming `req.user` contains authenticated user data

  res.status(200).json({
    success: true,
    organizer,
  });
});

// Approve a registered user for an event
const approveUserRegistration = asyncHandler(async (req, res) => {
  const { eventId, ticketId } = req.params;

  const event = await Event.findOne({ eventId });
  if (!event) throw new ApiError(404, "Event not found");

  const attendee = event.attendees.find(
    (attendee) => attendee.ticketId === ticketId
  );
  if (!attendee) throw new ApiError(404, "Attendee not found");

  attendee.approvalStatus = "approved";

  // Generate QR code for the user
  const qrCode = await generateQRCode(event.eventId, ticketId);
  await Ticket.findOneAndUpdate({ ticketId }, { qrCode });

  await event.save();

  res.status(200).json({
    success: true,
    message: "User registration approved",
    attendee,
  });
});

// Request approval for an event
const requestEventApproval = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const event = await Event.findOne({ eventId, organizer: req.user._id });
  if (!event) throw new ApiError(404, "Event not found or not authorized");

  event.approvalStatus = "requested"; // Update the approval status
  await event.save();

  res.status(200).json({
    success: true,
    message: "Approval request sent to admin",
    event,
  });
});


module.exports = {
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
  getPendingApprovalEvents,
  updateOrganizerProfile,
  getOrganizerProfile,
  approveUserRegistration,
  requestEventApproval,
};
