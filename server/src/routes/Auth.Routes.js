const { Router } = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  verifyUser,
} = require("../controllers/auth.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const authRoutes = new Router();

authRoutes.route("/register").post(registerUser);
authRoutes.route("/verify/:token").get(verifyUser);
authRoutes.route("/login").post(loginUser);
authRoutes.route("/logout").post(verifyJWT,logoutUser);

module.exports = authRoutes;
