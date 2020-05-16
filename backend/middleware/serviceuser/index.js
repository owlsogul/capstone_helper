/*
미들웨어 이름 : Service User
토큰 정보를 통해 유저들의 정보를 쉽게 코딩한다.
*/
const coder = require("../../util/coder")
const tokener = require("../../util/tokener")
const CustomError = require("../error")

function parseToken(token){

  if (!token) return [ null, new CustomError.NoAuthorizationError("no-token")];
  token = coder.decrypt(token)

  try {
    let decoded = tokener.verifyToken(token)
    console.log(decoded.userId + ", " + decoded.exp)
    return [ decoded.userId, null ]
  }
  catch(err){
    return [ null, err ]
  }
}

module.exports = {
  checkLogin: function(req, res, next){

    // 데이터 파싱
    let token = req.signedCookies.token
    let [ user, err ] = parseToken(token)

    // 에러 처리
    if (err){
      if (err.name == "TokenExpiredError") { req.Error.tokenExpired(res) }
      else if (err.name = "JsonWebTokenError") { req.Error.tokenExpired(res) }
      else if (err.name = "NoAuthorizationError") { req.Error.tokenExpired(res) }
      else { req.Error.internal(res) }
      return;
    }

    if (!user){
      req.Error.wrongParameter(res)
      return
    }

    req.ServiceUser = {
      userId: user,
    }
    next();
  }
};
