const Approval = require("../models/approval.model");
const Event = require("../models/event.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// Request approval for an event
const requestApproval = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  // Check if event exists and belongs to the organizer
  const event = await Event.findOne({ _id: eventId, organizer: req.user._id });
  if (!event) throw new ApiError(404, "Event not found or not authorized");

  // Check if approval already exists for this event
  const existingApproval = await Approval.findOne({ event: eventId });
  if (existingApproval)
    return res.status(400).json({ message: "Approval already requested" });

  // Create an approval request
  const approval = await Approval.create({
    event: eventId,
    requestedBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Approval request created successfully",
    approval,
  });
});

// Approve or deny an event
const reviewApproval = asyncHandler(async (req, res) => {
  const { approvalId } = req.params;
  const { status, denialReason } = req.body;

  // Find the approval request
  const approval = await Approval.findById(approvalId).populate("event");
  if (!approval) throw new ApiError(404, "Approval request not found");

  if (!["approved", "denied"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  approval.status = status;
  approval.denialReason = status === "denied" ? denialReason : null;
  if (status === "approved") {
    approval.approvedAt = new Date();
    approval.event.approved = true; // Update the event's approval status
    await approval.event.save();
  }

  await approval.save();

  res.status(200).json({
    success: true,
    message: `Event ${status} successfully`,
    approval,
  });
});

// Get all approval requests
const getApprovals = asyncHandler(async (req, res) => {
  const approvals = await Approval.find()
    .populate("event", "name description date")
    .populate("requestedBy", "fullName email");

  res.status(200).json({ success: true, approvals });
});

module.exports = {
  requestApproval,
  reviewApproval,
  getApprovals,
};
