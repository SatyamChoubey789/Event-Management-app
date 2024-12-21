const express = require("express");
const router = express.Router();
const approvalController = require("./approval.routes");
const verifyRole = require("../middlewares/role.middleware");

// Request approval for an event
router.post(
  "/request/:eventId",
  verifyRole(["organizer"]),
  approvalController.requestApproval
);

// Approve or deny an event
router.patch(
  "/review/:approvalId",
  verifyRole(["admin"]),
  approvalController.reviewApproval
);

// Get approval requests (for admin)
router.get("/", verifyRole(["admin"]), approvalController.getApprovals);

module.exports = router;
