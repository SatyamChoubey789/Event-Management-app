const User = require("../models/user.model"); // Correct path to the User model

const roleMiddleware = (roles) => (req, res, next) => {
  const userRole = req.user.role; // req.user will be populated from authMiddleware

  if (!roles.includes(userRole)) {
    return res
      .status(403)
      .json({ msg: "Access denied: You don't have the required role" });
  }

  next();
};

module.exports = roleMiddleware;
