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

module.exports = {
  getCurrentUser,
  updateAccountDetails,
};
