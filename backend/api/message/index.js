const express = require('express');
const router = express.Router();

const serviceUser = require("../../middleware/serviceuser")
const mc = require("./message.controller")

// 일반 유저용 메시지 열람
router.post("/get_message", [serviceUser.checkLogin, mc.getMessage])

// 수업 관리자용 메시지 열람
router.post("/get_class_message", [serviceUser.checkLogin, mc.getClassMessage])

// 수업 관리자에게 메시지 보냄
router.post("/send_message",  [serviceUser.checkLogin, mc.sendMessage])

// 일반 유저에게 답변함
router.post("/send_reply", [serviceUser.checkLogin, mc.sendReply])

module.exports = router