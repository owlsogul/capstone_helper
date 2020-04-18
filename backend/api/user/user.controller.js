const models = require("../../models")
const crypto = require("crypto")
const coder = require("../../util/coder")
const tokener = require("../../util/tokener")
const newErr = require("../../middleware/error")

function validateUserId(userId){
  if (!userId) return false;
  return true
}

function validateUserPw(userPw){
  if (!userPw) return false;
  const pwRegExp = /^[a-zA-Z0-9!@]{8,20}$/;
  return pwRegExp.test(userPw)
}

function validateUser(userId, userPw){
  return validateUserId(userId) && validateUserPw(userPw)
}

exports.login = (req, res) => {

    let userId = req.body.userId
    let userPw = req.body.userPw

    console.log("###################################")
    console.log("              log in               ")
    console.log("###################################")
    console.log(userId, userPw)

  let loginToken = ""
  if (!validateUser(userId, userPw)) {
    req.Error.wrongParameter(res, "userId or userPw")
    return
  }

  const check = (user) => {
        if(!user) {
            throw new newErr.UserNotExistError(userId)
        } else {

        let salt = user.salt
        let hashPw = crypto.createHash("sha512").update(userPw + salt).digest("hex");
        let dbPw = user.password

        if (hashPw == dbPw){
            return user
        }
        else {
            throw new newErr.UserNotExistError(userId)
        }
    }
    }

    const issueLoginToken = (user) => {
      let token = tokener.signLoginToken(user.email)
      let encrptedToken = coder.encrypt(token)
      if (token) {
        loginToken = encrptedToken
        return user
      }
      else {
        throw new newErr.TokenCreationError("Can't Make Token")
      }
    }

    // respond the token
    const respond = (user) => {
        res
        .cookie("token", loginToken, { maxAge: 1000* 60 * 60 * 2, httpOnly: true, signed: true })
        .status(200)
        .json({
            message: 'logged in successfully'
        })
    }

    models.User
      .findOne({
        where: { email: userId }
      })
      .then(check)
      .then(issueLoginToken)
      .then(respond)
      .catch(err =>{
        console.log(err)
        let name = err.name
        if (name == "UserNotExistError") { req.Error.wrongParameter(res, "Not User") }
        else { req.Error.internal(res) }
      })

}

exports.logout = (req, res) => {



}

exports.register = (req, res) => {

  let userId = req.body.userId
  let userPw = req.body.userPw
  let userName = req.body.userName

  let salt = Math.round((new Date().valueOf() * Math.random())) + "";
  let hashPassword = crypto.createHash("sha512").update(userPw + salt).digest("hex");

  if (!validateUser(userId, userPw)) {
    req.Error.wrongParameter(res, "userId or userPw")
    return
  }

  if (!userName){
      req.Error.wrongParameter(res, "userName")
      return
  }

  models.User
    .create({
      email: userId,
      password: hashPassword,
      name: userName,
      salt: salt,
    })
    .then(result => {
      res.json({ userId: result.email })
    })
    .catch(err => {
      let name = err.name

      if (name == "SequelizeUniqueConstraintError"){ req.Error.duplicatedUser(res) }
      else { console.log(err); req.Error.internal(res) }
    })

}

exports.checkToken = (req, res, next) =>{

    let rawToken = req.signedCookies.token
    console.log("raw token : " + rawToken)
    let token = coder.decrypt(rawToken)
    console.log("token " + token)
    let verify = tokener.verifyToken(token)
    console.log("verify " + verify)

    res.json({ rawToken: rawToken, token: token, verfiy: verify })

}