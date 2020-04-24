const express = require("express")
const router = express.Router()
var app = null

router.use((req, res, next) => {
    req.AppSetting = app.settings
    next()
})

module.exports = function(expApp){
    app = expApp
    return router;
}