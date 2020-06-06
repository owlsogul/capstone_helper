const express = require('express');
const router = express.Router();

const serviceUser = require("../../middleware/serviceuser")
const lc = require("./lecture.controller")

router.post("/start_lecture", [serviceUser.checkLogin, lc.startLecture])

router.post("/end_lecture", [serviceUser.checkLogin, lc.endLecture])

router.post("/join_lecture", [serviceUser.checkLogin, lc.joinLecture])

router.post("/get_current_lecture", [serviceUser.checkLogin, lc.getCurrentLecture])

router.post("/list_lecture", [serviceUser.checkLogin, lc.listLecture])

router.post("/get_user_map", [serviceUser.checkLogin, lc.getUserMap])

module.exports = router