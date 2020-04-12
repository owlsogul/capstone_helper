const express = require('express');
const router = express.Router(); 

router.get('/', function(req, res) {
  res.send("test");
});

router.use("/user", require("./user"))

module.exports = router 