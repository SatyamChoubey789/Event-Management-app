const { Router } = require("express");

const { Signup } = require("../controllers/auth.controller");
const router = new Router();


router.post("/signup", Signup);


module.exports = {router};