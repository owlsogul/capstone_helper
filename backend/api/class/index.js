const express = require('express');
const router = express.Router();

const serviceUser = require("../../middleware/serviceuser")
const cc = require("./class.controller")

router.get("/list", [serviceUser.checkLogin, cc.listClass])

router.post("/get_permission", [serviceUser.checkLogin, cc.getUserPermission])

router.get("/info/:classId", [serviceUser.checkLogin, cc.getClassInfo])

router.post("/create", [serviceUser.checkLogin, cc.createClass])

router.post("/invite_assist", [serviceUser.checkLogin, cc.inviteAssist])

router.post("/create_assist_invite_code", [serviceUser.checkLogin, cc.createAssistInviteCode])

router.post("/create_student_invite_code", [serviceUser.checkLogin, cc.createStudentInviteCode])

router.get("/invite/:invitationCode", [serviceUser.checkLogin, cc.enterInvitationCode])

router.post("/member", [serviceUser.checkLogin, cc.listMember])

router.post("/set_matching", [serviceUser.checkLogin, cc.setMatching])

router.post("/list_notice", [serviceUser.checkLogin, cc.listNotice] )

router.post("/post_notice", [serviceUser.checkLogin, cc.postNotice])

router.post("/member_oper", [serviceUser.checkLogin, cc.memberOperation])

router.post("/get_invite_codes", [serviceUser.checkLogin, cc.getInviteCodes])

module.exports = router