const { Router } = require("express");
const userRoutes = new Router();
const {
  getCurrentUser,
  updateAccountDetails,
} = require("../controllers/user.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

userRoutes.route("/profile").get(verifyJWT, getCurrentUser);
userRoutes.route("/updateprofile").post(verifyJWT, updateAccountDetails);

module.exports = userRoutes;
