const express = require('express');
const router = express.Router();

const serviceUser = require("../../middleware/serviceuser")
const uc = require("./user.controller")

router.get("/auth_check/:authLink", uc.authCheck)

router.post("/login", uc.login)

router.post("/logout", [serviceUser.checkLogin, uc.logout])

router.post("/checkToken", [serviceUser.checkLogin, uc.checkToken])

router.post("/register", uc.register)

router.post("/register_prof", uc.registerProf)

module.exports = router