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
  },
  ReqCreateAssistInviteCode: {
    type: "object",
    required: [ "classId", "expiredDate" ],
    properties: {
      classId: { type: "integer", description: "조교를 초대할 수업" },
      expiredDate: { type: "string", description: "날짜" }
    }
  },
  ReqCreateStudentInviteCode: {
    type: "object",
    required: [ "classId", "expiredDate" ],
    properties: {
      classId: { type: "integer", description: "조교를 초대할 수업" },
      expiredDate: { type: "string", description: "날짜" },
      isAutoJoin: { type: "boolean", description: "자동으로 가입될지 설정. 기본값은 true" }
    }
  },
  ReqClassInvite: {
    type: "string",
    description: "초대링크"
  }

}