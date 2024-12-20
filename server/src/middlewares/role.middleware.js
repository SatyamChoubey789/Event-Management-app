const ApiError = require("../utils/ApiError");

// Middleware to verify user role
const verifyRole = (roles) => {
  return (req, res, next) => {
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      // If not, pass the error to the error handler
      return next(
        new ApiError(403, "Access denied. Insufficient permissions!")
      );
    }
    next(); // Proceed to the next middleware if the user has the correct role
  };
};

module.exports = verifyRole;
