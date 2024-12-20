const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const process = require("node:process");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // console.log(token);
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Token missing!" });
  }
  try {
    const decoded = jwt.verify(
      token.split(" ")[1],
      process.env.ACCESS_TOKEN_SECRET
    );
    req.user = decoded; // Attach user payload to the request
    next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired token!" });
  }
};

module.exports = {
  verifyToken,
};
