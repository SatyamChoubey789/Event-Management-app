const Event = require("../models/event.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

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

module.exports = {
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
};
