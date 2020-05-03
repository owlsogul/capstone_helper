const express = require('express');
const router = express.Router();

const tc = require("./team.controller")
const serviceUser = require("../../middleware/serviceuser")

router.get("/list", [serviceUser.checkLogin, tc.listTeam])

router.post("/create", [serviceUser.checkLogin, tc.createTeam])

module.exports = router