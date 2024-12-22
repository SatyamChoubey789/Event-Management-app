const express = require("express");
const adminRoutes = express.Router();

const {getUser, getUsersByEmail}= require("../controllers/admin.controller");

// Get a all users

adminRoutes.route("/users").get(getUser);
adminRoutes.route("/users").get(getUsersByEmail);




module.exports = adminRoutes;