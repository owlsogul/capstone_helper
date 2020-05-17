const express = require('express');
const router = express.Router();

const tc = require("./team.controller")
const serviceUser = require("../../middleware/serviceuser")

router.post("/list", [serviceUser.checkLogin, tc.listTeam])

router.post("/create", [serviceUser.checkLogin, tc.createTeam])


router.post("/invite", (req, res, next)=>{
  res.json({ msg: "success"})
})

router.post("/join", (req, res, next)=>{
  res.json({ msg: "success"})
})

router.post("/quit", (req, res, next)=>{
  res.json({ msg: "success"})
})

module.exports = router