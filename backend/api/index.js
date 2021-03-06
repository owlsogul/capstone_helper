const express = require('express');
const router = express.Router(); 

router.use("/user", require("./user"))
router.use("/class", require("./class"))
router.use("/team", require("./team"))
router.use("/message", require("./message"))
router.use("/lecture", require("./lecture"))
router.use("/presentation", require("./presentation"))
router.use("/feedback", require("./feedback"))

module.exports = router 