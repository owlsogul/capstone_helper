module.exports = {
  ReqClassBasic: {
    type: "object",
    required: [ "classId" ],
    properties: {
      classId: { type: "integer", description: "대상" },
    }
  },
  RecListClass: {
    type: "object",
    required: [],
    properties: {} 
  },
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
      assistants: { type: "array", description: "조교들의 이메일", items: { type: "string"} }
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
  },

  ReqListMember: {
    type: "object",
    required: [ "classId" ],
    properties: {
      classId: { type: "integer", description: "수업 코드" },
    }
  },

  ReqSetMatching: {
    type: "object",
    required: [ "classId" ],
    properties: {
      classId: { type: "integer", description: "수업 코드" },
      matchingInfo: { type: "boolean", description: "매칭 할지 안할지" },
    }
  },

  ReqPostNotice: {
    type: "object",
    required: [ "classId", "title", "body" ],
    properties: {
      classId: { type: "integer", description: "수업 코드" },
      title: { type: "string", description: "공지사항 제목" },
      body: { type: "string", description: "공지사항 내용" },
    }
  }

}