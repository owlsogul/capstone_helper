const express = require('express');
const router = express.Router();

const tc = require("./team.controller")
const serviceUser = require("../../middleware/serviceuser")

router.post("/list", [serviceUser.checkLogin, tc.listTeam])

router.post("/create", [serviceUser.checkLogin, tc.createTeam])

router.post("/get_myteam", [serviceUser.checkLogin, tc.getMyTeam])


router.post("/get_invite", [serviceUser.checkLogin, tc.getInvite])

router.post("/invite", [serviceUser.checkLogin, tc.inviteMember])

router.post("/accept_invite", [serviceUser.checkLogin, tc.acceptInvite])

router.post("/deny_invite", [serviceUser.checkLogin, tc.denyInvite])




router.post("/join", (req, res, next)=>{
  res.json({ msg: "success"})
})

router.post("/quit", (req, res, next)=>{
  res.json({ msg: "success"})
})

module.exports = router