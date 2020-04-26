module.exports = {
  ResListClass:{
    description: "참여중인 수업에 대한 정보",
    schema: {
      type: "object",
      required: [ "take", "manage", "own" ],
      properties: {
        take: { 
          type: "array",
          description: "학생이 수강 중인 수업",
          items: { 
            type: "object", 
            properties: { classId: {type: "integer"}, takeStatus: {type: "integer", description: "허가 받았으면 1, 대기중이면 0"} }
          } 
        },
        manage: { 
          type: "array",
          description: "조교님이 관리 중인 수업",
          items: { 
            type: "object", 
            properties: { classId: {type: "integer"} }
          } 
        },
        own : { 
          type: "array", 
          description: "교수님이 강의 중인 수업",
          items: { 
            type: "object", 
            properties: { classId: {type: "integer"} }
          } 
        }
      }
    }
  },

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

  ResCreateInviteCode: {
    description: "만들어진 초대코드를 반환한다.",
    schema: {
      type: "object",
      required: [ "code" ],
      properties: {
        code: { type: "string", description: "만들어진 초대코드" },
      }
    }
  },

  ResClassInvite: {
    description: "가입된 수업코드를 반환한다..",
    schema: {
      type: "object",
      required: [ "classId" ],
      properties: {
        classId: { type: "string", description: "가입된 수업 코드" },
      }
    }
  }
  

}