const ApiError = require("../utils/ApiError");

// Middleware to verify user role
const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Access denied. Insufficient permissions!");
    }
    next();
  };
};

module.exports = verifyRole;
