const express = require("express");
const router = express.Router();
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
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// Protected Routes
router.post("/", verifyToken, createEvent);
router.put("/:id", verifyToken, updateEvent);
router.delete("/:id", verifyToken, deleteEvent);

// Admin/Organizer Routes
router.put("/:id/approve", verifyToken, approveEvent);
router.post("/:id/register", verifyToken, registerForEvent);

module.exports = router;
