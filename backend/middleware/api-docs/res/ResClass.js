module.exports = {
  ResCreateClass:{
    description: "개설된 수업에 대한 정보",
    schema: {
      type: "object",
      required: [ "className" ],
      properties: {
        className: { type: "string", description: "만들어진 수업의 이름" },
        classId: { type: "integer", description: "만들어진 수업의 코드"}
      }
    }
  },

  ResInviteAssist: {
    description: "정말로 초대된 조교들만 반환한다. 이미 조교여도 반환된다.",
    schema: {
      type: "object",
      required: [ "className" ],
      properties: {
        className: { type: "string", description: "만들어진 수업의 이름" },
        classId: { type: "integer", description: "만들어진 수업의 코드"}
      }
    }
  },

}