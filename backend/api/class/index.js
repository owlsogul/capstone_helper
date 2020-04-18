const express = require('express');
const router = express.Router();

const serviceUser = require("../../middleware/serviceuser")
const cc = require("./class.controller")

router.post("/create", [serviceUser.checkLogin, cc.createClass])




module.exports = router