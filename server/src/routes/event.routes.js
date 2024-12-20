const express = require("express");
const eventRoutes = express.Router();
const {
  createEvent,
  getEventById,
  getAllEvents,
  updateEvent,
  deleteEvent,
  registerForEvent,
} = require("../controllers/event.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const verifyRole = require("../middlewares/role.middleware");

// Public Routes (Common users)
eventRoutes.get("/getallevents", verifyJWT, getAllEvents); // View all events
eventRoutes.get("/:id", verifyJWT, getEventById); // View a specific event
eventRoutes.post("/register-event/:eventId", verifyJWT, registerForEvent); //

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

module.exports = eventRoutes;
