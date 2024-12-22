// Write Admin controller functions here for our ems application
const User = require("../models/user.model");
const AsyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");


// Get all users

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a user by id

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a user by id

exports.updateUser = async (req, res) => {
  const { name, email, role } = req.body;
  const user = new User({
    _id: req.params.id,
    name,
    email,
    role,
  });

  try {
    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user by id

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users by role

exports.getUsersByRole = async (req, res) => {
  try {
    const users = await User.find({ role: req.params.role });
    if (!users) return res.status(404).json({ message: "No users found" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all users by email

exports.getUsersByEmail = async (req, res) => {
  try {
    const users = await User.find({ email: req.params.email });
    if (!users) return res.status(404).json({ message: "No users found" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all users by name

exports.getUsersByName = async (req, res) => {
  try {
    const users = await User.find({ name: req.params.name });
    if (!users) return res.status(404).json({ message: "No users found" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users by role and email

exports.getUsersByRoleAndEmail = async (req, res) => {
  try {
    const users = await User.find({ role: req.params.role, email: req.params.email });
    if (!users) return res.status(404).json({ message: "No users found" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users by role and name

exports.getUsersByRoleAndName = async (req, res) => {
  try {
    const users = await User.find({ role: req.params.role, name: req.params.name });
    if (!users) return res.status(404).json({ message: "No users found" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users by email and name

exports.getUsersByEmailAndName = async (req, res) => {
  try {
    const users = await User.find({ email: req.params.email, name: req.params.name });
    if (!users) return res.status(404).json({ message: "No users found" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users by role, email, and name

exports.getUsersByRoleEmailAndName = async (req, res) => {
  try {
    const users = await User.find({ role: req.params.role, email: req.params.email, name: req.params.name });
    if (!users) return res.status(404).json({ message: "No users found" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


