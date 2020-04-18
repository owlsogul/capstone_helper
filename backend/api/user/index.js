const express = require('express');
const router = express.Router();

const uc = require("./user.controller")

router.get('/', function(req, res) {
  res.send("test");
});

router.post("/login", uc.login)

router.post("/refresh", (req, res, next)=>{

})

router.post("/register", uc.register)

module.exports = router