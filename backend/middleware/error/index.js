/**

ResponseCode
  성공
    - 200 : 요청이 성공
    - 204 : 요청은 성공했지만 보내줄 값이 없음
  실패 - 클라이언트 측
    - 400 : 잘못된 파라메터가 들어가 있음
      {
        err: "Wrong Parameter",
        data: "Parameter Name" // 디버그 시에만 전달
      }
    - 401 : 토큰이 만료됨
      {
        err:"Token is invalid"
      }
    - 403 : 인증이 안되어있음
      {
        err: "No Authorization"
      }
    - 404 : 찾을 수 없음
  실패 - 서버 측
    - 500 : 알 수 없는 에러
      {
        err: "Internal Server Error"
      }

*/

const express = require("express");
const initRouter = express.Router();

initRouter.use((req, res, next) => {
  req.Error = {
    wrongParameter: (res, data) => res.status(400).json({ err: "Wrong Parameter", data: data }),
    noAuthorization: (res) => res.status(403).json({ err: "No Authorization" }),
    tokenExpired: (res) => res.status(401).json({err:"Token is invalid"}),
    internal: (res) => res.status(500).json({ err: "Internal Server Error" }),
    duplicatedUser: (res) => res.status(400).json({ err: "Duplicated User" })
  }
  next()
})

class CustomError extends Error {
  constructor(message) {
    super(message);
   // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;
   // This clips the constructor invocation from the stack trace.
   // It's not absolutely essential, but it does make the stack trace a little nicer.
   //  @see Node.js reference (bottom)
    Error.captureStackTrace(this, this.constructor);
  }
}

class UserNotExistError extends CustomError {
  constructor(userId){
    super(userId + " is not exist")
  }
}

class SMSAuthorizeError extends CustomError {
  constructor(message){
    super(message)
  }
}

class AlreadySMSAuthorizeError extends CustomError {
  constructor(message){
    super(message)
  }
}

class TokenExpiredError extends CustomError {
  constructor(message){
    super(message)
  }
}

class TokenCreationError extends CustomError {
  constructor(message){
    super(message)
  }
}

class NoAuthorizationError extends CustomError {
  constructor(message){
    super(message)
  }
}

module.exports = {

  initModule: initRouter,

  UserNotExistError,
  TokenExpiredError,
  NoAuthorizationError,
  SMSAuthorizeError,
  AlreadySMSAuthorizeError


}
