const { Router } = require("express");
const organizerRoutes = new Router();
const { verifyJWT } = require("../middlewares/auth.middleware");
const verifyRole = require("../middlewares/role.middleware");
const {
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
  requestEventApproval,
  approveUserRegistration,
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

organizerRoutes
  .route("/events/:id/request-approval")
  .put(verifyJWT, verifyRole(["organizer"]), requestEventApproval); // Request approval for an event

organizerRoutes
  .route("/events/:eventId/registrations/:userId/approve")
  .put(verifyJWT, verifyRole(["organizer", "admin"]), approveUserRegistration); // Approve user registration for an event


module.exports = organizerRoutes;

