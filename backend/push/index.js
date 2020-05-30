const express = require("express");
const router = express.Router();
const cmd = require("node-cmd")

function doCmd(command) {
  return new Promise((res, rej)=>{
    cmd.get(command, function(err, success, stderr){
      if (err) rej(err)
      else res(success)
      console.log(command + " done")
    })
  })
}

router.use("/", (req, res, next)=>{
  console.log("push arrive")
  let commands = [
    doCmd("npm i").then(console.log),
    doCmd("cd ../frontend/capstone && npm i && npm run-script build").then(console.log),
  ]
  commands.reduce((prev, item)=>{
    return prev.then(()=>item)
  }, Promise.resolve())
  .then(()=>{
    console.log("build complete")
  })
  .catch(err=>{
    console.log("build error")
    console.log(err)
  })
  res.json({})
})

module.exports = router