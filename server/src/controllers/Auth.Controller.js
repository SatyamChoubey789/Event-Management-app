const User = require("../models/user.model")
const jwt = require("jsonwebtoken");
const process = require("node:process");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { sendOTPEmail, sendSuccessMail } = require("../services/sendMail");

const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      error,
      "Something went wrong while generating refresh and access tokens"
    );
  }
};

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Unauthorized");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(401, "Invalid token");
    }

    const { accessToken, newRefreshToken } = await generateTokens(user._id);

    res.cookie("refreshToken", newRefreshToken, { httpOnly: true });
    res.status(200).json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    throw new ApiError(401, error, "Invalid token");
  }
});

const generateOTP = () => {
  // Generate a random 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register user
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, role, password } = req.body;

  // Validate input data
  if (!fullName || !email || !role || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with that email already exists");
  }

  // Create a new user
  const newUser = await User.create({
    fullName,
    email,
    password,
    role,
  });

  // Generate OTP for email verification
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

  // Store OTP and expiry time in the user's record
  newUser.otp = otp;
  newUser.otpExpiry = otpExpiry;
  await newUser.save();

  // Send OTP to the user's email
  await sendOTPEmail(email, otp);

  // Generate access and refresh tokens for the user
  const { accessToken, refreshToken } = await generateTokens(newUser._id);

  // Send response with tokens
  res.status(201).json({
    success: true,
    accessToken,
    refreshToken,
    user: newUser,
  });
});

// Verify OTP
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Validate input data
  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if OTP is expired
  if (new Date() > user.otpExpiry) {
    throw new ApiError(400, "OTP has expired. Please request a new one.");
  }

  // Check if OTP matches
  if (user.otp !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  // Mark the user as verified and clear OTP
  user.isVerified = true;
  user.otp = undefined; // Clear OTP
  user.otpExpiry = undefined; // Clear OTP expiry
  await user.save();

  // Send verification success email
  await sendSuccessMail(user.email);

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input data
  if (!email || !password) {
    throw new ApiError(400, "Email or username and password are required");
  }

  // Find user by email or username
  const user = await User.findOne({
    $or: [{ email: email }, { username: email }],
  });

  // Check if user if verified or not
  if (!user || !user.isVerified) {
    throw new ApiError(401, "User is not verified");
  }

  // Check if user exists and password matches
  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateTokens(user._id);

  // Send response with tokens
  res.status(200).json({
    success: true,
    accessToken,
    refreshToken,
    user,
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findByIdAndUpdate(userId, {
    $unset: { refreshToken: 1 },
  });

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  res.clearCookie("refreshToken");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = {
  registerUser,
  verifyOTP,
  loginUser,
  logoutUser,
  refreshAccessToken,
};
