const { Router } = require("express");
const organizerRoutes = new Router();
const { verifyJWT } = require("../middlewares/auth.middleware");
const verifyRole = require("../middlewares/role.middleware");
const {
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
} = require("../controllers/organiser.controller");

// Organizer/Admin routes for event management
organizerRoutes
  .route("/events")
  .post(verifyJWT, verifyRole(["organizer", "admin"]), createEvent) // Create an event (only for organizer/admin)
  .get(verifyJWT, verifyRole(["organizer", "admin"]), getMyEvents); // Get all events for organizer/admin

organizerRoutes
  .route("/events/:id")
  .put(verifyJWT, verifyRole(["organizer", "admin"]), updateEvent) // Update an event (only for organizer/admin)
  .delete(verifyJWT, verifyRole(["organizer", "admin"]), deleteEvent); // Delete an event (only for organizer/admin)

module.exports = organizerRoutes;
