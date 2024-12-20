const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -accesstoken"
  );
  res.status(200).json({
    success: true,
    user,
  });
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  // Validate input data
  if (!fullName || !email) {
    throw new ApiError(400, "Full name and email are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { fullName, email },
    { new: true }
  );
  console.log("User Updated Successfull");

  res.status(200).json({
    success: true,
    user,
  });
});

// Get a list of all users (Admin only)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -accessToken");
  res.status(200).json({
    success: true,
    users,
  });
});

// Delete a user account (Admin only)
const deleteUserAccount = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.status(200).json({
    success: true,
    message: `User ${user.fullName} deleted successfully`,
  });
});

// Update user role (Admin only)
const updateUserRole = asyncHandler(async (req, res) => {
  const { id, role } = req.body;

  if (!["user", "organizer", "admin"].includes(role)) {
    throw new ApiError(400, "Invalid role provided");
  }

  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    message: `User role updated to ${role} successfully`,
    user,
  });
});

module.exports = {
  getCurrentUser,
  updateAccountDetails,
  getAllUsers,
  deleteUserAccount,
  updateUserRole,
};
