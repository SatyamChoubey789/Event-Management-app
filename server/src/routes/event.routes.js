const express = require("express");
const eventRoutes = express.Router();
const {
  createEvent,
  getEventById,
  getAllEvents,
  updateEvent,
  deleteEvent,
  approveEvent,
  registerForEvent,
  deregisterEvent,
  searchEvents,
  getUserEvents,
} = require("../controllers/event.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const verifyRole = require("../middlewares/role.middleware");

// Public Routes (Common users)
eventRoutes.get("/getallevents", verifyJWT, getAllEvents); // View all events
eventRoutes.get("/:id", verifyJWT, getEventById); // View a specific event
eventRoutes.get("/search", verifyJWT, searchEvents); // Search events
eventRoutes.get("/user/events", verifyJWT, getUserEvents); // Get all events user is registered for
eventRoutes.post("/register-event/:eventId", verifyJWT, registerForEvent); // Register for event
eventRoutes.post("/deregister-event/:eventId", verifyJWT, deregisterEvent); // Deregister from event

// Protected Routes (Admin/Organizer only)
eventRoutes.post(
  "/create-event",
  verifyJWT,
  verifyRole(["admin", "organizer"]),
  createEvent
); // Admin/Organizer can create events
eventRoutes.put(
  "/update-event/:id",
  verifyJWT,
  verifyRole(["admin", "organizer"]),
  updateEvent
); // Admin/Organizer can update events
eventRoutes.delete(
  "/delete-event/:id",
  verifyJWT,
  verifyRole(["admin", "organizer"]),
  deleteEvent
); // Admin/Organizer can delete events
eventRoutes.post(
  "/approve-event/:id",
  verifyJWT,
  verifyRole(["admin", "organizer"]),
  approveEvent
); // Admin/Organizer can approve events

module.exports = eventRoutes;
