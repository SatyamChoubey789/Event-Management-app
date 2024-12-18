const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const process = require("node:process");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const {
  sendVerificationEmail,
  sendVerificationSuccessEmail,
} = require("../services/sendMail");

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

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, role, password } = req.body;

  // Validate input data
  if (!fullname || !email || !role || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ fullname }, { email }] });
  if (existingUser) {
    throw new ApiError(409, "User with that email or username already exists");
  }

  // Create a new user
  const newUser = await User.create({
    fullname,
    email,
    password,
    role,
  });

  // Generate tokens
  const { accessToken, refreshToken } = await generateTokens(newUser._id);

  // Send verification email
  const verificationUrl = `${process.env.CLIENT_URL}/verify/${accessToken}`;
  await sendVerificationEmail(email, verificationUrl);

  // Send response with tokens
  res.status(201).json({
    success: true,
    accessToken,
    refreshToken,
    user: newUser,
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

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
};
