const express = require('express');
const router = express.Router();

const serviceUser = require("../../middleware/serviceuser")
const cc = require("./class.controller")

router.get("/list", [serviceUser.checkLogin, cc.listClass])

router.get("/info/:classId", [serviceUser.checkLogin, cc.getClassInfo])

router.post("/create", [serviceUser.checkLogin, cc.createClass])

router.post("/invite_assist", [serviceUser.checkLogin, cc.inviteAssist])

router.post("/create_assist_invite_code", [serviceUser.checkLogin, cc.createAssistInviteCode])

router.post("/create_student_invite_code", [serviceUser.checkLogin, cc.createStudentInviteCode])

router.get("/invite/:invitationCode", [serviceUser.checkLogin, cc.enterInvitationCode])

router.post("/member", [serviceUser.checkLogin, cc.listMember])

router.get("/set_matching", [serviceUser.checkLogin, cc.setMatching])

router.post("/list_notice", [serviceUser.checkLogin, cc.listNotice] )

router.post("/post_notice", [serviceUser.checkLogin, cc.postNotice])

router.post("/member_oper", [serviceUser.checkLogin, cc.memberOperation])

module.exports = router