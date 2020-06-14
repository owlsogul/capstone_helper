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
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"PPT 시각자료를 잘 활용해서 그런지 이해가 잘되었습니다." })
        }),
        models.FeedbackReply.create({
          postId: 1,
          teamId: 1,
          targetTeamId: 3,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"준비가 많이 미흡한 것 같습니다. 팀원간에 소통이 없이 개발이 된거 같은 느낌을 받았습니다. 데모 준비가 되지 않았던점은 매우 아쉽습니다." })
        }),
        models.FeedbackReply.create({
          postId: 1,
          teamId: 1,
          targetTeamId: 4,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"보여주신게 많이 없는 것 같아요… 다음 시간에는 더 많은 걸 보여주셨으면 좋겠습니다." })
        }),
        //2
        models.FeedbackReply.create({
          postId: 1,
          teamId: 2,
          targetTeamId: 1,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"새로운 기술을 시도하려는 모습이 보기 좋습니다." })
        }),
        models.FeedbackReply.create({
          postId: 1,
          teamId: 2,
          targetTeamId: 3,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"피드백 수렴도 좋고 진행도 잘 되고 있는것 같다." })
        }),
        models.FeedbackReply.create({
          postId: 1,
          teamId: 2,
          targetTeamId: 4,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"발표가 말이 빨라서 빠르게 이해하기 좀 어려운 면이 있었지만 개발은 잘 진행이 되고 있는 것 같았습니다." })
        }),
        // 3
        models.FeedbackReply.create({
          postId: 1,
          teamId: 3,
          targetTeamId: 2,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"이전 중간데모에서 있었던 오류들을 잘 해결하신 것 같습니다." })
        }),
        models.FeedbackReply.create({
          postId: 1,
          teamId: 3,
          targetTeamId: 1,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"아직 핵심 기능들이 구현되지 않아서 남은 주차가 힘들 것 같습니다. 잘 마무리되게 진행하셨으면 좋겠습니다." })
        }),
        models.FeedbackReply.create({
          postId: 1,
          teamId: 3,
          targetTeamId: 4,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"좋은 발표 잘 들었습니다. 데모를 통해서 프론트엔드에서 추가적인 기능이 있었으면 좋겠습니다." })
        }),
        // 4
        models.FeedbackReply.create({
          postId: 1,
          teamId: 4,
          targetTeamId: 2,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"오류가 아쉬웠으나 전체적으로 디자인이 eclass를 연상시키는듯하여 좋았습니다." })
        }),
        models.FeedbackReply.create({
          postId: 1,
          teamId: 4,
          targetTeamId: 1,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"열심히 하신것 같지만 구현 진도가 다소 부진해 보입니다. 구현내용에 대해서 좀 더 솔직하게 발표하시면 좋을 것 같아요." })
        }),
        models.FeedbackReply.create({
          postId: 1,
          teamId: 4,
          targetTeamId: 3,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"인터페이스에 많은 신경을 쓴 것 같습니다." })
        }),

        // 4주차
        // 1
        models.FeedbackReply.create({
          postId: 2,
          teamId: 1,
          targetTeamId: 2,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"전체적인 프로젝트 진행이 잘 되는 것 같다" })
        }),
        models.FeedbackReply.create({
          postId: 2,
          teamId: 1,
          targetTeamId: 3,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"악성 유저들에 대처하려는 노력이 ppt에 잘 담겨 있어서 좋았습니다. 개발이 잘 이루어지고 있는 것 같습니다." })
        }),
        models.FeedbackReply.create({
          postId: 2,
          teamId: 1,
          targetTeamId: 4,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"너무 기능적 진행에 초점을 두셔서 개발 진행은 느린감이 없지않아 있는같다" })
        }),
        //2
        models.FeedbackReply.create({
          postId: 2,
          teamId: 2,
          targetTeamId: 1,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"창 간이동에 오류가 잦았는데 완성도가 아쉬웠습니다." })
        }),
        models.FeedbackReply.create({
          postId: 2,
          teamId: 2,
          targetTeamId: 3,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"UI가 깔끔해서 좋다." })
        }),
        models.FeedbackReply.create({
          postId: 2,
          teamId: 2,
          targetTeamId: 4,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"캡스톤 재밌다." })
        }),
        // 3
        models.FeedbackReply.create({
          postId: 2,
          teamId: 3,
          targetTeamId: 2,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"정말로 재밌는걸?" })
        }),
        models.FeedbackReply.create({
          postId: 2,
          teamId: 3,
          targetTeamId: 1,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"기쁘다" })
        }),
        models.FeedbackReply.create({
          postId: 2,
          teamId: 3,
          targetTeamId: 4,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"종강 화이팅입니다." })
        }),
        // 4
        models.FeedbackReply.create({
          postId: 2,
          teamId: 4,
          targetTeamId: 2,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"굳굳굳" })
        }),
        models.FeedbackReply.create({
          postId: 2,
          teamId: 4,
          targetTeamId: 1,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"파이널 데모까지 파이팅입니다." })
        }),
        models.FeedbackReply.create({
          postId: 2,
          teamId: 4,
          targetTeamId: 3,
          body: JSON.stringify({ "_1": "5", "_3":"5", "_2":"좋습니다." })
        }),
      ]
      return Promise.all(msg)
    })
    .then(()=>{
      console.log("테스트 데이터 생성 완료!")
    })
  
}