const express = require("express");
const adminRoutes = express.Router();

const {getUser, getUsersByEmail}= require("../controllers/admin.controller");

// Get a all users

adminRoutes.route("/all-users").get(getUser);
adminRoutes.route("/getuserbyemail").get(getUsersByEmail);




module.exports = adminRoutes;