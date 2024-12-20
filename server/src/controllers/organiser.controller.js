const Event = require("../models/event.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// Create a new event
const createEvent = asyncHandler(async (req, res) => {
  const { name, description, date, location } = req.body;

  if (!name || !description || !date || !location) {
    throw new ApiError(400, "All fields are required");
  }

  const event = await Event.create({
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
  const { id } = req.params;
  const { name, description, date, location } = req.body;

  const event = await Event.findOneAndUpdate(
    { _id: id, organizer: req.user._id },
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

// Delete an event
const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const event = await Event.findOneAndDelete({
    _id: id,
    organizer: req.user._id,
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
