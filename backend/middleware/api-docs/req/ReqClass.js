module.exports = {
    ReqCreateClass: {
        type: "object",
        required: [ "className" ],
        properties: {
          className: { type: "string", description: "수업의 이름" },
          classTime: { type: "string", description: "수업 시간"}
        } 
      }
}