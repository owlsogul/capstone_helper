const express = require('express');
const router = express.Router();

const serviceUser = require("../../middleware/serviceuser")
const cc = require("./class.controller")

router.get("/list", [serviceUser.checkLogin, cc.listClass])

router.post("/create", [serviceUser.checkLogin, cc.createClass])

router.post("/invite_assist", [serviceUser.checkLogin, cc.inviteAssist])

router.post("/create_assist_invite_code", [serviceUser.checkLogin, cc.createAssistInviteCode])

router.post("/create_student_invite_code", [serviceUser.checkLogin, cc.createStudentInviteCode])

router.get("/invite/:invitationCode", [serviceUser.checkLogin, cc.enterInvitationCode])

router.get("/member", [serviceUser.checkLogin, cc.listMember])

module.exports = router