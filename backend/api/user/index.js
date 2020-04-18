const express = require('express');
const router = express.Router();

const uc = require("./user.controller")

router.post("/login", uc.login)

router.post("/checkToken", uc.checkToken)

router.post("/register", uc.register)

router.post("/refresh", (req, res, next)=>{

})


module.exports = router