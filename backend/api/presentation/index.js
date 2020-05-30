const express = require('express');
const router = express.Router();

const serviceUser = require("../../middleware/serviceuser")
const pc = require("./presentation.controller")

router.post("/start_presentation", [serviceUser.checkLogin, pc.startPresentation])

router.post("/end_presentation", [serviceUser.checkLogin, pc.endPresentation])

router.post("/get_current_presentation", [serviceUser.checkLogin, pc.getCurrentPresentation])

router.post("/list_presentation", [serviceUser.checkLogin, pc.listPresentation])

router.post("/list_user_presentation", [serviceUser.checkLogin, pc.listUserPresentation])

module.exports = router