const express = require('express');
const router = express.Router(); 

router.use("/user", require("./user"))
router.use("/class", require("./class"))
router.use("/team", require("./team"))

module.exports = router 