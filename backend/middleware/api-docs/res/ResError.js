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
  }
}