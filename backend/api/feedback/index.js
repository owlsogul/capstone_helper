const express = require('express');
const router = express.Router();

const serviceUser = require("../../middleware/serviceuser")
const fc = require("./feedback.controller")


router.post("/list_form", [serviceUser.checkLogin, fc.listForm])

router.post("/edit_form", [serviceUser.checkLogin, fc.editForm])

router.post("/delete_form", [serviceUser.checkLogin, fc.deleteForm])

router.post("/publish_form", [serviceUser.checkLogin, fc.publishForm])

router.post("/list_post", [serviceUser.checkLogin, fc.listPost])

router.post("/delete_post", [serviceUser.checkLogin, fc.deletePost])

router.post("/save_reply", [serviceUser.checkLogin, fc.replyPost])

router.post("/list_response", [serviceUser.checkLogin, fc.listResponse])

module.exports = router