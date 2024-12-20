const { Router } = require("express");
const organizerRoutes = new Router();
const { verifyJWT } = require("../middlewares/auth.middleware");
const verifyRole = require("../middlewares/role.middleware");
const {
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
} = require("../controllers/organizer.controller");

// Organizer routes
organizerRoutes
  .route("/events")
  .post(verifyJWT, verifyRole(["organizer", "admin"]), createEvent) // Create an event
  .get(verifyJWT, verifyRole(["organizer", "admin"]), getMyEvents); // Get organizer's events

organizerRoutes
  .route("/events/:id")
  .put(verifyJWT, verifyRole(["organizer", "admin"]), updateEvent) // Update an event
  .delete(verifyJWT, verifyRole(["organizer", "admin"]), deleteEvent); // Delete an event

module.exports = organizerRoutes;
