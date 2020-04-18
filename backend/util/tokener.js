
const jwt = require('jsonwebtoken')
const config = require("../config/config.json")

let secret = config.jwtSecret

function signToken(data, expiresIn){
  try {
    let signedToken = jwt.sign(
      data,
    secret,
    {
        expiresIn: expiresIn,
        issuer: 'capstone_helper',
        subject: 'userInfo'
    })
    return signedToken;
  } catch(e){
    console.log(e)
  }
  return null
}

module.exports = {

  signLoginToken: (userId) =>{
    return signToken({ type: "login", userId: userId }, "2h")
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, secret)
    }
    catch (e){
      return null
    }
  }


}
