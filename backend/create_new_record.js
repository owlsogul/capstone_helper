const models = require("./models")

function pad(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

const numStudent = 10
const numProfessor = 5

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

  let studentsPromise = []
  let professorPromise = []

  for (let idx = 0; idx < numStudent; idx++){
    studentsPromise.push(createStudentPromise(idx))
  }

  for (let idx = 0; idx < numProfessor; idx++){
    professorPromise.push(createProfessorPromise(idx))
  }
  
  Promise.all(studentsPromise)
  Promise.all(professorPromise)

}