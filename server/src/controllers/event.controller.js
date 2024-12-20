const Event = require("../models/event.model");
const Ticket = require("../models/ticket.model");


// Create a new event
const createEvent = async (req, res) => {
  try {
    const { name, description, date, venue } = req.body;
    const newEvent = new Event({
      name,
      description,
      date,
      venue,
      organizer: req.user.id,
    });
    const savedEvent = await newEvent.save();
    res
      .status(201)
      .json({ message: "Event created successfully", event: savedEvent });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating event", error: err.message });
  }
};

// Get event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizer",
      "name email"
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching event", error: err.message });
  }
};

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("organizer", "name email");
    res.status(200).json(events);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching events", error: err.message });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedEvent)
      return res.status(404).json({ message: "Event not found" });
    res
      .status(200)
      .json({ message: "Event updated successfully", event: updatedEvent });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating event", error: err.message });
  }
};

// Approve event
const approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    event.approved = true;
    const savedEvent = await event.save();
    res
      .status(200)
      .json({ message: "Event approved successfully", event: savedEvent });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error approving event", error: err.message });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent)
      return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting event", error: err.message });
  }
};

// Register for event
const registerForEvent = async (req, res) => {
  try {
    console.log("Event ID from URL: ", req.params.eventId); // Log the event ID
    const { ticketId } = req.body;
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.approved === true) {
      return res
        .status(400)
        .json({ message: "Cannot register for approved events" });
    }

    // Create a new ticket for the user
    const newTicket = new Ticket({
      ticketId,
      user: req.user.id,
      event: event._id,
    });

    // Save the ticket and add it to the event's attendees
    await newTicket.save();
    event.attendees.push({ user: req.user.id, ticketId });
    await event.save();

    res.status(200).json({
      message: "Registered for event successfully",
      ticket: newTicket,
      event: event,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering for event", error: err.message });
  }
};

module.exports = {
  createEvent,
  getEventById,
  getAllEvents,
  updateEvent,
  approveEvent,
  deleteEvent,
  registerForEvent,
};
