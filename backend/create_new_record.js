const models = require("./models")

function pad(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

const numStudent = 20
const numProfessor = 5
const numAssist = 10

module.exports = ()=>{

  const createStudentPromise = (idx)=>{
    return new Promise((res, rej)=>{
      models.User.create({ 
        userId: `student${ pad(idx, 2) }@cau.ac.kr`,
        userPw: "e5c000048557d3eb78be91e277aa975a141ea5f97932ffb1823bd857835102fb4e9c9f377fadec68030a9d1c34aa207e7eb752a277072ccbb132bd599d44fb39",
        salt: "1042274896194",
        name: "학생"+pad(idx, 2),
        level: 1
      })
      .then((student)=>{
        return models.StudentMeta.create({
          user: student.userId,
          studentCode: pad(idx, 8)
        })
      })
      .then(()=>{
        res();
      })
      .catch((err)=>{
        rej()
      })
    })
  }

  const createProfessorPromise = (idx)=>{
    return new Promise((res, rej)=>{
      models.User.create({ 
        userId: `professor${ pad(idx, 2) }@cau.ac.kr`,
        userPw: "e5c000048557d3eb78be91e277aa975a141ea5f97932ffb1823bd857835102fb4e9c9f377fadec68030a9d1c34aa207e7eb752a277072ccbb132bd599d44fb39",
        salt: "1042274896194",
        name: "교수"+pad(idx, 2),
        level: 101
      })
      .then((professor)=>{
        return models.ProfessorMeta.create({
          user: professor.userId,
          phoneNumber: pad(idx, 11)
        })
      })
      .then(()=>{
        res();
      })
      .catch((err)=>{
        rej()
      })
    })
  }

  const createAssistPromise = (idx)=>{
    return new Promise((res, rej)=>{
      models.User.create({ 
        userId: `assist${ pad(idx, 2) }@cau.ac.kr`,
        userPw: "e5c000048557d3eb78be91e277aa975a141ea5f97932ffb1823bd857835102fb4e9c9f377fadec68030a9d1c34aa207e7eb752a277072ccbb132bd599d44fb39",
        salt: "1042274896194",
        name: "조교"+pad(idx, 2),
        level: 50
      })
      .then((student)=>{
        return models.StudentMeta.create({
          user: student.userId,
          studentCode: pad(idx, 8)
        })
      })
      .then(()=>{
        res();
      })
      .catch((err)=>{
        rej()
      })
    })
  }

  let studentsPromise = []
  let professorPromise = []
  let assistPromise = []

  for (let idx = 1; idx < numStudent; idx++){
    studentsPromise.push(createStudentPromise(idx))
  }

  for (let idx = 1; idx < numProfessor; idx++){
    professorPromise.push(createProfessorPromise(idx))
  }

  for (let idx = 1; idx < numAssist; idx++){
    assistPromise.push(createAssistPromise(idx))
  }
  
  Promise.all(studentsPromise)
    .then(()=>{
      return Promise.all(professorPromise)
    })
    .then(()=>{
      return Promise.all(assistPromise)
    })
    // 수업1 생성
    .then(()=>{
      return models.Class.create({
        professor: "professor01@cau.ac.kr",
        className: "19년도 가을 캡스톤 프로젝트",
        classTime: "월) 9시 ~ 13시"
      })
      .then(()=>{
        models.ClassRelation.create({
          classId: 1,
          user: "professor01@cau.ac.kr",
          relationType: 3
        })
      })
    })
    // 학생 1~9 수업1 등록
    .then(()=>{
      let takes = []
      for (let idx = 1; idx < 15; idx++){
        takes.push(new Promise((res, rej)=>{
          models.ClassRelation.create({
            classId: 1,
            user: `student${ pad(idx, 2) }@cau.ac.kr`,
            relationType: idx <= 6 ? 1 : 0
          })
          .then(res)
          .catch(rej)
        }))
      }
      return Promise.all(takes)
    })
    // 조교 1 ~ 3 수업1 등록
    .then(()=>{
      let manages = []
      for (let idx = 1; idx < 4; idx++){
        manages.push(new Promise((res, rej)=>{
          models.ClassRelation.create({
            classId: 1,
            user: `assist${ pad(idx, 2) }@cau.ac.kr`,
            relationType: 2
          })
          .then(res)
          .catch(rej)
        }))
      }
    })
    // 수업 코드 생성
    .then(()=>{
      models.InvitationCode.create({
        code: "CLASS01",
        classId: 1,
        expiredDate: Date.parse("9999-12-31")
      })
    })
    // 공지 사항 등록
    .then(()=>{
      return models.Notice.create({
        classId: 1,
        title: "공지사항 1",
        body: "공지사항 내용입니다.",
        writtenDate: Date.parse("2020-05-09")
      })
    })
    .then(()=>{
      return models.Notice.create({
        classId: 1,
        title: "공지사항 2",
        body: "공지사항 내용입니다.",
        writtenDate: Date.parse("2020-05-10")
      })
    })
    .then(()=>{
      return models.Notice.create({
        classId: 1,
        title: "공지사항 3",
        body: "공지사항 내용입니다.",
        writtenDate: Date.parse("2020-05-11")
      })
    })
    // 조 만들기
    .then(()=>{
      return models.Team.create({
        classId: 1,
        teamName: "1조",
        githubUrl: "https://github.com/owlsogul/capstone_helper"
      })
      .then(()=>{
        return models.Team.create({
          classId: 1,
          teamName: "2조"
        })
      })
      .then(()=>{
        return models.Team.create({
          classId: 1,
          teamName: "3조"
        })
      })
      .then(()=>{
        return models.Team.create({
          classId: 1,
          teamName: "4조"
        })
      })
    })
    // 조 매칭 하기
    .then(()=>{
      let matching = [
        models.Join.create({ user: "student01@cau.ac.kr", classId: 1, teamId: 1, isLeader: true, joinStatus: 1 }),
        models.Join.create({ user: "student02@cau.ac.kr", classId: 1, teamId: 1, joinStatus: 1 }),
        models.Join.create({ user: "student03@cau.ac.kr", classId: 1, teamId: 1, joinStatus: 0 }),
        models.Join.create({ user: "student04@cau.ac.kr", classId: 1, teamId: 2, isLeader: true, joinStatus: 1 }),
        models.Join.create({ user: "student05@cau.ac.kr", classId: 1, teamId: 2, joinStatus: 1 }),
        models.Join.create({ user: "student06@cau.ac.kr", classId: 1, teamId: 3, isLeader: true, joinStatus: 1 }),
        models.Join.create({ user: "student07@cau.ac.kr", classId: 1, teamId: 3, joinStatus: 1 }),
        models.Join.create({ user: "student08@cau.ac.kr", classId: 1, teamId: 4, isLeader: true, joinStatus: 1 }),
        models.Join.create({ user: "student09@cau.ac.kr", classId: 1, teamId: 4, joinStatus: 1 }),
      ]
      return Promise.all(matching)
    })
    // 테스트 메시지 만들기
    .then(()=>{
      let msgs = [
        models.Message.create({ classId: 1, sender: "student01@cau.ac.kr", body: "조교님 저희 조 주제가 오토바이 자율 주행에 관한 건데 힌트좀 주실 수 있으실까요?" }),
        models.Message.create({ classId: 1, sender: "student02@cau.ac.kr", body: "잘 부탁드립니다." }),
        models.Message.create({ classId: 1, sender: "student03@cau.ac.kr", body: "저 지금 찾아뵈도 될까요?" }),
      ]
      return Promise.all(msgs)
    })
    // feedback
    .then(()=>{
      let form = [
        models.FeedbackForm.create(
          { 
            classId: 1, 
            name: "Test Form", 
            body: JSON.stringify(
              {
                "_1": {
                  "type": "number",
                  "title": "내용의 흐름도",
                  "shared": false
                },
                "_3": {
                  "type": "number",
                  "title": "내용의 간략화",
                  "shared": false
                },
                "_2": {
                  "type": "string",
                  "title": "총평",
                  "shared": true
                } 
              }
            ) 
          }
        ),
        models.FeedbackPost.create({
          formId: 1,
          classId: 1,
          title: "3주차 피드백",
          expiredDate: new Date("2020-06-08")
        }),
        models.FeedbackPost.create({
          formId: 1,
          classId: 1,
          title: "4주차 피드백",
          expiredDate: new Date("2020-06-10")
        }),
        
      ]
      return Promise.all(form)
    })
    .then(()=>{
      let msg = [
        // 3주차
        // 1
        models.FeedbackReply.create({
          postId: 1,
          teamId: 1,
          targetTeamId: 2,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"3주차 1->2 피드백" })
        }),
        models.FeedbackReply.create({
          postId: 1,
          teamId: 1,
          targetTeamId: 3,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"3주차 1->3 피드백" })
        }),
        models.FeedbackReply.create({
          postId: 1,
          teamId: 1,
          targetTeamId: 4,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"3주차 1->4 피드백" })
        }),
        //2
        models.FeedbackReply.create({
          postId: 1,
          teamId: 2,
          targetTeamId: 1,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"3주차 2->1 피드백" })
        }),
        models.FeedbackReply.create({
          postId: 1,
          teamId: 2,
          targetTeamId: 3,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"3주차 2->3 피드백" })
        }),
        models.FeedbackReply.create({
          postId: 1,
          teamId: 2,
          targetTeamId: 4,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"3주차 2->4 피드백" })
        }),
        // 3
        models.FeedbackReply.create({
          postId: 1,
          teamId: 3,
          targetTeamId: 2,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"3주차 3->2 피드백" })
        }),
        models.FeedbackReply.create({
          postId: 1,
          teamId: 3,
          targetTeamId: 1,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"3주차 3->1 피드백" })
        }),
        models.FeedbackReply.create({
          postId: 1,
          teamId: 3,
          targetTeamId: 4,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"3주차 3->4 피드백" })
        }),
        // 4
        models.FeedbackReply.create({
          postId: 1,
          teamId: 4,
          targetTeamId: 2,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"3주차 4->2 피드백" })
        }),
        models.FeedbackReply.create({
          postId: 1,
          teamId: 4,
          targetTeamId: 1,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"3주차 4->1 피드백" })
        }),
        models.FeedbackReply.create({
          postId: 1,
          teamId: 4,
          targetTeamId: 3,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"3주차 4->3 피드백" })
        }),

        // 4주차
        // 1
        models.FeedbackReply.create({
          postId: 2,
          teamId: 1,
          targetTeamId: 2,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"4주차 1->2 피드백" })
        }),
        models.FeedbackReply.create({
          postId: 2,
          teamId: 1,
          targetTeamId: 3,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"4주차 1->3 피드백" })
        }),
        models.FeedbackReply.create({
          postId: 2,
          teamId: 1,
          targetTeamId: 4,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"4주차 1->4 피드백" })
        }),
        //2
        models.FeedbackReply.create({
          postId: 2,
          teamId: 2,
          targetTeamId: 1,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"4주차 2->2 피드백" })
        }),
        models.FeedbackReply.create({
          postId: 2,
          teamId: 2,
          targetTeamId: 3,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"4주차 2->3 피드백" })
        }),
        models.FeedbackReply.create({
          postId: 2,
          teamId: 2,
          targetTeamId: 4,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"4주차 2->4 피드백" })
        }),
        // 3
        models.FeedbackReply.create({
          postId: 2,
          teamId: 3,
          targetTeamId: 2,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"4주차 3->2 피드백" })
        }),
        models.FeedbackReply.create({
          postId: 2,
          teamId: 3,
          targetTeamId: 1,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"4주차 3->1 피드백" })
        }),
        models.FeedbackReply.create({
          postId: 2,
          teamId: 3,
          targetTeamId: 4,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"4주차 3->4 피드백" })
        }),
        // 4
        models.FeedbackReply.create({
          postId: 2,
          teamId: 4,
          targetTeamId: 2,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"4주차 4->2 피드백" })
        }),
        models.FeedbackReply.create({
          postId: 2,
          teamId: 4,
          targetTeamId: 1,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"4주차 4->1 피드백" })
        }),
        models.FeedbackReply.create({
          postId: 2,
          teamId: 4,
          targetTeamId: 3,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"4주차 4->3 피드백" })
        }),
      ]
      return Promise.all(msg)
    })
    .then(()=>{
      console.log("테스트 데이터 생성 완료!")
    })
  
}