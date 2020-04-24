const express = require('express');
const router = express.Router();

const serviceUser = require("../../middleware/serviceuser")
const uc = require("./user.controller")

router.get("/auth_check/:authLink", uc.authCheck)

router.post("/signin", uc.signin)

router.post("/signout", [serviceUser.checkLogin, uc.signout])

router.post("/signup", uc.signup)

router.post("/checkToken", [serviceUser.checkLogin, uc.checkToken])

router.post("/signup_prof", uc.signupProf)

module.exports = router