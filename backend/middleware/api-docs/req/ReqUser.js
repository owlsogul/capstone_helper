module.exports = {
    ReqSignIn: {
        type: "object",
        required: [ "userId", "userPw" ],
        properties: {
            userId: { type: "string", description: "아이디"},
            userPw: { type: "string", description: "비밀번호"}
        }
    },
    ReqSignUp: {
        type: "object",
        required: [ "userId", "userPw", "userName", "studentConde" ],
        properties: {
            userId: { type: "string", description: "아이디"},
            userPw: { type: "string", description: "비밀번호"},
            userName: { type: "string", description: "학생의 이름"},
            studentCode: { type: "string", description: "학생의 학번"}
        }
    },
    ReqSignUpProf: {
        type: "object",
        required: [ "userId", "userPw", "userName", "userPhone" ],
        properties: {
            userId: { type: "string", description: "아이디"},
            userPw: { type: "string", description: "비밀번호"},
            userName: { type: "string", description: "교수님의 이름"},
            userPhone: { type: "string", description: "교수님의 전화번호"}
        }
    }

}