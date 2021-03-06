module.exports = {
  ResError: {
    type: "object",
    required: [ "message" ],
    properties: {
      message: { type: "string", description: "에러 메시지" },
      data: { type: "string", description: "추가적인 데이터" }
    }
  },
  ResInternal: {
    description: "서버 내부 오류 시 호출",
    schema: { $ref: "#/components/res/ResError" }
  },
  ResNoAuthorization: {
    description: "권한이 없을 때 호출",
    schema: { $ref: "#/components/res/ResError" }
  },
  ResWrongParameter: {
    description: "잘못된 파라메터가 있을 경우 호출",
    schema: { $ref: "#/components/res/ResError" }
  },
  ResConflict: {
    description: "중복되었을 경우",
    schema: { $ref: "#/components/res/ResError" }
  }

}