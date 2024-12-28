const { Router } = require("express");
const userRoutes = new Router();
const {
  getCurrentUser,
  updateAccountDetails,
  getAllUsers,
  deleteUserAccount,
  updateUserRole,
} = require("../controllers/user.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const verifyRole = require("../middlewares/role.middleware");

userRoutes.route("/profile").get(verifyJWT, getCurrentUser);
userRoutes.route("/updateprofile").post(verifyJWT, updateAccountDetails);

// Admin-only routes
userRoutes
  .route("/admin/users")
  .get(verifyJWT, verifyRole(["admin"]), getAllUsers);
userRoutes
  .route("/admin/users/:id")
  .delete(verifyJWT, verifyRole(["admin"]), deleteUserAccount);
userRoutes
  .route("/admin/role")
  .post(verifyJWT, verifyRole(["admin"]), updateUserRole);

module.exports = userRoutes;
