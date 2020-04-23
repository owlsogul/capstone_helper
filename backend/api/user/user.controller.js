/**
 * @swagger
 * tags:
 *   name: User
 *   description: user 관련 API들
 * definitions:
 *   ReqSignIn:
 *     type: object
 *     required:
 *       - user_id
 *       - password
 *     properties:
 *       user_id:
 *         type: string
 *         description: 아이디
 *       password:
 *         type: string
 *         description: 비밀번호
 *   ResSignIn:
 *     type: object
 *     required:
 *       - status
 *     properties:
 *       status:
 *         type: string
 *         description: 로그인 성공 여부- error, success
 *       token:
 *         type: object
 *         description: 계정 정보
 *   Response_error:
 *     type: object
 *     required:
 *       - status
 *     properties:
 *       message:
 *         type: string
 *         description: 오류 사유
 *       status:
 *         type: integer
 *         description: response code
 */

const models = require("../../models")
const crypto = require("crypto")
const coder = require("../../util/coder")
const tokener = require("../../util/tokener")
const newErr = require("../../middleware/error")
const mailer = require("../../util/mailer")

function ifNot(l, v){
    return l ? l : v
}

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

function makeRandomString(from, length) {
    var chars = from ? from : "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = length ? length : 20;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
}

/**
 * @swagger
 *  paths:
 *    /login:
 *      post:
 *        tags:
 *        - "User"
 *        summary: "Login process"
 *        description: ""
 *        consumes:
 *        - "application/json"
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - in: "body"
 *          name: "body"
 *          description: "로그인 계정 정보와 서비스 정보를 전달"
 *          required: true
 *          schema:
 *            $ref: "#/definitions/ReqSignIn"
 *        responses:
 *          200:
 *            description: "로그인 결과"
 *            schema:
 *              $ref: "#/definitions/Auth_response"
 *          400:
 *            description: "잘못된 데이터"
 *            schema:
 *              $ref: "#/definitions/Response_error"
 *          500:
 *            description: "로그인 오류 & 실패"
 *            schema:
 *              $ref: "#/definitions/Response_error"
 */

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

exports.logout = (req, res, next) => {

    res.clearCookie("token").status(200).json({ message: "logout successfully"})

}

exports.register = (req, res) => {

    let userId = req.body.userId
    let userPw = req.body.userPw
    let userName = req.body.userName
    let studentCode = req.body.studentCode

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

    if (!studentCode){
        req.Error.wrongParameter(res, "studentCode")
        return
    }

    models.sequelize.transaction().then(t=>{

        const createAuthData = (user)=>{
            return models.UserAuthData.create({
                user: userId,
                authLink: makeRandomString(false, 20),
                expireDate: Date.now() + (1000 * 60 * 60 * 24)
            }, { transaction: t })
        }

        const createStudentMeta = (user)=>{
            return models.StudentMeta.create({
                user: userId,
                studentCode: studentCode,
            }, { transaction: t })
        }
    
        const sendEmail = (authData) => {
            return mailer.sendMail(
                authData.user, 
                "가입 인증 메일", 
                `<p>귀하의 인증 번호는 다음과 같습니다.</p> 
                <p><strong>${authData.authLink}</strong></p>
                <p>다음 URL로 들어가주십시오.</p>
                http://localhost/api/user/auth_check/${authData.authLink}
                `
            )
        }
    
        return models.User
            .create({
                email: userId,
                password: hashPassword,
                name: userName,
                salt: salt,
            }, { transaction: t })
            .then(createStudentMeta)
            .then(createAuthData)
            .then(sendEmail)
            .then(result => {
                res.json({ userId: userId })
                return t.commit()
            })
            .catch(err => {
                let name = err.userName
                if (name == "SequelizeUniqueConstraintError"){ req.Error.duplicatedUser(res) }
                else { console.log(err); req.Error.internal(res) }
                return t.rollback()
            })
    })
    

}

exports.registerProf = (req, res) => {

    let userId = req.body.userId
    let userPw = req.body.userPw
    let userName = req.body.userName
    let userPhone = req.body.userPhone

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

    if (!userPhone){
        req.Error.wrongParameter(res, "userName")
        return
    }

    models.sequelize.transaction().then(t=>{
        const createProfessorData = (user)=>{
            return models.ProfessorMeta.create({
                user: user.email,
                phoneNumber: userPhone,
            }, { transaction: t })
        }
    
        return models.User
            .create({
                email: userId,
                password: hashPassword,
                name: userName,
                level: 100,
                salt: salt,
            }, { transaction: t })
            .then(createProfessorData)
            .then(result => {
                res.json({ userId: userId })
                return t.commit()
            })
            .catch(err => {
                let name = err.userName
                if (name == "SequelizeUniqueConstraintError"){ req.Error.duplicatedUser(res) }
                else { console.log(err); req.Error.internal(res) }
                return t.rollback()
            })
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

exports.authCheck = (req, res, next)=>{
    var authLink = req.params.authLink ? req.params.authLink : ""
    
    const checkExpire = (authData) =>{
        let expireDate = authData.expireDate
        console.log(expireDate)
        if (authData.expireDate < Date.now()){
            console.log("expired!")
            throw "Expired!"
        }
        return authData
    }

    const registerConfirm = (authData) =>{
        return new Promise((res, rej)=>{
            if (!authData) { rej("Already Check"); return; }
            models.User
                .update({ level: 1 }, {where: { email: authData.user }})
                .then(result=>{
                    console.log(result)
                    if (result.length == 0){ rej("No User"); return; }
                    authData.destroy()
                    res()
                })
        })
    }

    models.UserAuthData
        .findOne({
            where: { authLink: authLink }
        })
        .then(checkExpire)
        .then(registerConfirm)
        .then(()=>{
            res.json({message: "GOOD"})
        })
        .catch((err)=>{
            console.log(err)
            res.status(400).json({message: "NO!!"})
        })

}