const express = require('express');
const router = express.Router(); 

router.get('/', function(req, res) {
  res.send("test");
});

router.post("/login", (req, res, next)=>{

})

router.post("/refresh", (req, res, next)=>{

})

router.post("/register", (req, res, next)=>{

})

module.exports = router