module.exports = {
  ReqCreateClass: {
    type: "object",
    required: [ "className" ],
    properties: {
      className: { type: "string", description: "수업의 이름" },
      classTime: { type: "string", description: "수업 시간"}
    } 
  },
  ReqInviteAssist: {
    type: "object",
    required: [ "classId", "assistants" ],
    properties: {
      classId: { type: "integer", description: "조교를 초대할 수업" },
      assistants: { type: "array", description: "조교들의 이메일" }
    }
  }
}