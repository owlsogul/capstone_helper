module.exports = {
  ResCreateClass:{
    description: "개설된 수업에 대한 정보",
    schema: {
      type: "object",
      required: [ "className" ],
      properties: {
        className: { type: "string", description: "만들어진 수업의 이름" },
      }
    }
  }
}