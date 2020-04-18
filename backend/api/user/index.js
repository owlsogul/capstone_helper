const express = require('express');
const router = express.Router();

const serviceUser = require("../../middleware/serviceuser")
const uc = require("./user.controller")

router.post("/login", uc.login)

router.post("/logout", [serviceUser.checkLogin, uc.logout])

router.post("/checkToken", [serviceUser.checkLogin, uc.checkToken])

router.post("/register", uc.register)

router.post("/refresh", (req, res, next)=>{

})


module.exports = router