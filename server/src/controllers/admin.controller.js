const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const AsyncHandler = require("../utils/asyncHandler");

// Get all users
exports.getUsers = AsyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// Get a user by id
exports.getUser = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.params._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.status(200).json(user);
});

// Update a user by id
exports.updateUser = AsyncHandler(async (req, res) => {
  const { name, email, role } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role },
    { new: true, runValidators: true }
  );
  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }
  res.status(200).json(updatedUser);
});

// Delete a user by id
exports.deleteUser = AsyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.status(200).json({ message: "User deleted successfully" });
});

// Get all users by role
exports.getUsersByRole = AsyncHandler(async (req, res) => {
  const users = await User.find({ role: req.params.role });
  if (users.length === 0) {
    throw new ApiError(404, "No users found with the specified role");
  }
  res.status(200).json(users);
});

// Get all users by email
exports.getUsersByEmail = AsyncHandler(async (req, res) => {
  const users = await User.find({ email: req.params.email });
  if (users.length === 0) {
    throw new ApiError(404, "No users found with the specified email");
  }
  res.status(200).json(users);
});

// Get all users by name
exports.getUsersByName = AsyncHandler(async (req, res) => {
  const users = await User.find({ name: req.params.name });
  if (users.length === 0) {
    throw new ApiError(404, "No users found with the specified name");
  }
  res.status(200).json(users);
});

// Get all users by role and email
exports.getUsersByRoleAndEmail = AsyncHandler(async (req, res) => {
  const users = await User.find({
    role: req.params.role,
    email: req.params.email,
  });
  if (users.length === 0) {
    throw new ApiError(404, "No users found with the specified role and email");
  }
  res.status(200).json(users);
});

// Get all users by role and name
exports.getUsersByRoleAndName = AsyncHandler(async (req, res) => {
  const users = await User.find({
    role: req.params.role,
    name: req.params.name,
  });
  if (users.length === 0) {
    throw new ApiError(404, "No users found with the specified role and name");
  }
  res.status(200).json(users);
});

// Get all users by email and name
exports.getUsersByEmailAndName = AsyncHandler(async (req, res) => {
  const users = await User.find({
    email: req.params.email,
    name: req.params.name,
  });
  if (users.length === 0) {
    throw new ApiError(404, "No users found with the specified email and name");
  }
  res.status(200).json(users);
});

// Get all users by role, email, and name
exports.getUsersByRoleEmailAndName = AsyncHandler(async (req, res) => {
  const users = await User.find({
    role: req.params.role,
    email: req.params.email,
    name: req.params.name,
  });
  if (users.length === 0) {
    throw new ApiError(
      404,
      "No users found with the specified role, email, and name"
    );
  }
  res.status(200).json(users);
});
