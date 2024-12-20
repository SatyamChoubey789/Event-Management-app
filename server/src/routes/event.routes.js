const express = require("express");
const eventRoutes = express.Router();
const {
  createEvent,
  getEventById,
  getAllEvents,
  updateEvent,
  approveEvent,
  deleteEvent,
  registerForEvent,
} = require("../controllers/event.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Public Routes
eventRoutes.get("/getallevents", getAllEvents);
eventRoutes.get("/getall/:id", getEventById);

// Protected Routes
eventRoutes.post("/create-event", verifyToken, createEvent);
eventRoutes.put("/update-event/:id", verifyToken, updateEvent);
eventRoutes.delete("/delete-event/:id", verifyToken, deleteEvent);

// Admin/Organizer Routes
eventRoutes.put("/:id/approve", verifyToken, approveEvent);
eventRoutes.post("/:id/register", verifyToken, registerForEvent);

module.exports = eventRoutes;
