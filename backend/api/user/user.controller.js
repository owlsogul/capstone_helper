/**
 * @swagger
 * tags:
 *   name: User
 *   description: user 관련 API들
 * definitions:
 *   ReqSignIn:
 *     type: object
 *     required:
 *       - userId
 *       - userPw
 *     properties:
 *       userId:
 *         type: string
 *         description: 아이디
 *       userPw:
 *         type: string
 *         description: 비밀번호
 *   ReqSignUp:
 *     type: object
 *     required:
 *       - userId
 *       - userPw
 *       - userName
 *       - studentCode
 *     properties:
 *       userId:
 *         type: string
 *         description: 아이디
 *       userPw:
 *         type: string
 *         description: 비밀번호
 *       userName:
 *          type: string
 *          description: 학생의 이름
 *       studentCode:
 *          type: string
 *          description: 학생의 학번
 *   ReqSignUpProf:
 *     type: object
 *     required:
 *       - userId
 *       - userPw
 *       - userName
 *       - userPhone
 *     properties:
 *       userId:
 *         type: string
 *         description: 아이디
 *       userPw:
 *         type: string
 *         description: 비밀번호
 *       userName:
 *          type: string
 *          description: 교수님의 이름
 *       userPhone:
 *          type: string
 *          description: 교수님의 전화 번호
 *   ResAuth:
 *     type: object
 *     required:
 *       - message
 *     properties:
 *       message:
 *         type: string
 *         description: 로그인/회원가입 성공 여부 - error, success
 *       userId:
 *         type: string
 *         description: 로그인/회원가입이 성공 했을 경우 userId 반환
 *   ReqBasic:
 *     type: object
 *     required:
 *     properties:
 *   ResBasic:
 *     type: object
 *     required:
 *       - message
 *     properties:
 *       message:
 *         type: string
 *         description: 기본적인 메시지
 *   ResUserInfo:
 *     type: object
 *     required:
 *       - userId
 *       - level
 *     properties:
 *       message:
 *         type: string
 *         description: 유저 아이디
 *       level:
 *         type: integer
 *         description: 유저 권한 레벨
 *   ResError:
 *     type: object
 *     required:
 *       - err
 *     properties:
 *       err:
 *         type: string
 *         description: 오류 사유
 *       data:
 *         type: string
 *         description: 오류 추가적인 데이터
 * 
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
 *    /api/user/signin:
 *      post:
 *        tags:
 *        - "User"
 *        summary: "로그인할 때 호출하는 API"
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
 *            description: "로그인을 성공했을 때 반환됨"
 *            schema:
 *              $ref: "#/definitions/ResAuth"
 *          400:
 *            description: "잘못된 데이터거나 로그인 데이터가 없거나 할때 반환됨"
 *            schema:
 *              $ref: "#/definitions/ResError"
 *          500:
 *            description: "서버 내부 오류"
 *            schema:
 *              $ref: "#/definitions/ResError"
 */

exports.signin = (req, res) => {

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
        let dbPw = user.userPw

        if (hashPw == dbPw){
            return user
        }
        else {
            throw new newErr.UserNotExistError(userId)
        }
    }
    }

    const issueLoginToken = (user) => {
      let token = tokener.signLoginToken(user.userId)
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
            message: "success"
        })
    }

    models.User
      .findOne({
        where: { userId: userId }
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


/**
 * @swagger
 *  paths:
 *    /api/user/signout:
 *      post:
 *        tags:
 *        - "User"
 *        summary: "로그아웃 할 때 호출하는 API"
 *        description: "로그인이 되어있지 않으면 오류를 리턴하므로 참고하도록 한다."
 *        consumes:
 *        - "application/json"
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - in: "body"
 *          name: "body"
 *          description: "아무것도 없다."
 *          required: true
 *          schema:
 *            $ref: "#/definitions/ReqBasic"
 *        responses:
 *          200:
 *            description: "로그아웃을 성공했을 때 반환"
 *            schema:
 *              $ref: "#/definitions/ResBasic"
 *          401:
 *            description: "로그인이 만료되어있을 때 반환"
 *            schema:
 *              $ref: "#/definitions/ResError"
 *          403:
 *            description: "로그인이 안되어 있을 때 반환"
 *            schema:
 *              $ref: "#/definitions/ResError"
 * 
 */
exports.signout = (req, res, next) => {

    res.clearCookie("token").status(200).json({ message: "success"})

}

/**
 * @swagger
 *  paths:
 *    /api/user/signup:
 *      post:
 *        tags:
 *        - "User"
 *        summary: "학생 회원가입 할 때 호출하는 API"
 *        description: ""
 *        consumes:
 *        - "application/json"
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - in: "body"
 *          name: "body"
 *          description: "회원가입 계정 정보와 서비스 정보를 전달"
 *          required: true
 *          schema:
 *            $ref: "#/definitions/ReqSignUp"
 *        responses:
 *          200:
 *            description: "회원가입을 성공했을 때 반환됨"
 *            schema:
 *              $ref: "#/definitions/ResAuth"
 *          400:
 *            description: "잘못된 데이터거나 회원가입 할 데이터가 없거나 할때 반환됨"
 *            schema:
 *              $ref: "#/definitions/ResError"
 *          500:
 *            description: "서버 내부 오류"
 *            schema:
 *              $ref: "#/definitions/ResError"
 */
exports.signup = (req, res) => {

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
                ${ifNot(req.AppSetting.host, "localhost")}/api/user/auth_check/${authData.authLink}
                `
            )
        }
    
        return models.User
            .create({
                userId: userId,
                userPw: hashPassword,
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
                let name = err.name
                if (name == "SequelizeUniqueConstraintError"){ req.Error.duplicatedUser(res) }
                else { console.log(err); req.Error.internal(res) }
                return t.rollback()
            })
    })
    

}

/**
 * @swagger
 *  paths:
 *    /api/user/signup_prof:
 *      post:
 *        tags:
 *        - "User"
 *        summary: "교수 회원가입 할 때 호출하는 API"
 *        description: ""
 *        consumes:
 *        - "application/json"
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - in: "body"
 *          name: "body"
 *          description: "회원가입 계정 정보와 서비스 정보를 전달"
 *          required: true
 *          schema:
 *            $ref: "#/definitions/ReqSignUpProf"
 *        responses:
 *          200:
 *            description: "회원가입을 성공했을 때 반환됨"
 *            schema:
 *              $ref: "#/definitions/ResAuth"
 *          400:
 *            description: "잘못된 데이터거나 회원가입 할 데이터가 없거나 할때 반환됨"
 *            schema:
 *              $ref: "#/definitions/ResError"
 *          500:
 *            description: "서버 내부 오류"
 *            schema:
 *              $ref: "#/definitions/ResError"
 */
exports.signupProf = (req, res) => {

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
                userId: userId,
                userPw: hashPassword,
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
/**
 * @swagger
 *  paths:
 *    /api/user/auth_check:
 *      get:
 *        tags:
 *        - "User"
 *        summary: "이메일 인증 링크"
 *        description: "이메일 인증 링크입니다. 들어오면 정회원으로 등급업 됩니다."
 *        consumes:
 *        - "application/json"
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - in: "paramater"
 *          name: "authLink"
 *          description: "회원가입 계정 정보와 서비스 정보를 전달"
 *          required: true
 *        responses:
 *          200:
 *            description: "회원가입을 성공했을 때 반환됨"
 *            schema:
 *              $ref: "#/definitions/ResAuth"
 *          400:
 *            description: "잘못된 데이터거나 회원가입 할 데이터가 없거나 할때 반환됨"
 *            schema:
 *              $ref: "#/definitions/ResError"
 *          500:
 *            description: "서버 내부 오류"
 *            schema:
 *              $ref: "#/definitions/ResError"
 */
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
                .update({ level: 1 }, {where: { userId: authData.user }})
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

/**
 * @swagger
 *  paths:
 *    /api/user/user_info:
 *      get:
 *        tags:
 *        - "User"
 *        summary: "로그인 한 유저의 정보를 가져오는 API"
 *        description: "Cookie 정보를 바탕으로 권한 레벨만 리턴함"
 *        consumes:
 *        - "application/json"
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - in: "body"
 *          name: "body"
 *          description: "아무것도 없다."
 *          required: true
 *          schema:
 *            $ref: "#/definitions/ReqBasic"
 *        responses:
 *          200:
 *            description: "유저 정보"
 *            schema:
 *              $ref: "#/definitions/ResUserInfo"
 *          401:
 *            description: "로그인이 만료되어있을 때 반환"
 *            schema:
 *              $ref: "#/definitions/ResError"
 *          403:
 *            description: "로그인이 안되어 있을 때 반환"
 *            schema:
 *              $ref: "#/definitions/ResError"
 *          500:
 *            description: "서버 오류일 때 반환"
 *            schema:
 *              $ref: "#/definitions/ResError"
 * 
 */
exports.getUserInfo = (req, res, next) => {
    
    let userId = req.ServiceUser.userId
    
    const respond = (user) =>{
        res.status(200).json({
            userId: userId,
            level : user.level
        })
    }

    models.User
        .findOne({ where: { userId: userId } })
        .then(respond)
        .catch((err)=>{
            console.log(err)
            req.Error.internal(res)
        })

}