module.exports = {
    ResAuth: {
      type: "object",
      required: [ "message" ],
      properties: {
          message: { type: "string", description: "로그인/회원가입 성공 여부 - error, success" },
          userId: { type: "string", description: "로그인/회원가입이 성공 했을 경우 userId 반환" }
      }
    },
    ResUserExit: {
      type: "object",
      required: [ "message" ],
      properties: {
          message: { type: "string", description: "탈퇴 성공 여부 - error, success" },
      }
    },
}