/**
@swagger
tags:
  name: Lecture
  description: Lecture 관련 API들
 */

const models = require("../../models")
const Sequelize = require("sequelize")
const Op = Sequelize.Op;
const socketServer = require("../../websocket")

/**
@swagger
paths: {
  /api/lecture/start_lecture: {
    post: {
      tags: [ Lecture ],
      summary: "수업을 시작하는 API",
      description: "수업을 시작하는 API. 이미 시작되어있는 경우 409에러가 난다.",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "",
        schema: {
          type: "object",
          required: [ "classId" ],
          properties: {
            classId: { type: "integer", description: "classId" },
            lectureName: { type: "string", description: "수업 내용"}
          }
        }
      }],
      responses: {
        200: {
          description: "수업이 시작되었을 경우.",
          schema: {
            type: "object",
            properties: {
              lectureId: { type: "integer", description: "시작된 수업 id"},
            }
          }
        },
        400: { $ref: "#/components/res/ResWrongParameter" },
        401: { $ref: "#/components/res/ResNoAuthorization" },
        409: { $ref: "#/components/res/ResConflict" },
        500: { $ref: "#/components/res/ResInternal" },
      }
    }
  }
}
*/
exports.startLecture = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let lectureName = req.body.lectureName

  if (!classId){
    req.Error.wrongParameter(res, "classId")
    return;
  }

  const checkPermission = ()=>{
    return models.ClassRelation.findOne({
      where: {
        user: userId,
        classId: classId,
        relationType: {
          [Op.gte]: 2
        }
      }
    })
  }

  const findLatestLecture = (relation)=>{
    if (!relation) throw new Error("NoPermission")
    return models.Lecture.findOne({
      where: {
        classId: classId,
        endedAt: null
      }
    })
  }

  const checkAlreadyStart = (lecture)=>{
    if (lecture) throw new Error("AlreadyStart")
  }

  const createLecture = ()=>{
    return models.Lecture.create({
      classId: classId,
      lectureName: lectureName,
    })
  }

  let retLecture = false
  const startLectureServer = (lecture)=>{
    retLecture = lecture
    return socketServer.startLecture(lecture.lectureId)
  }

  const respond = ()=>{
    res.json(retLecture)
  }
  
  checkPermission()
    .then(findLatestLecture)
    .then(checkAlreadyStart)
    .then(createLecture)
    .then(startLectureServer)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "NoPermission") req.Error.noAuthorization(res)
      else if (err.message == "AlreadyStart") req.Error.conflict(res)
      else req.Error.internal(res)
    })
}

/**
@swagger
paths: {
  /api/lecture/end_lecture:{
    post: {
      tags: [ Lecture ],
      summary: "수업을 끝내는 API",
      description: "수업을 끝내는 API. 없을 경우 에러가 난다.",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "",
        schema: {
          type: "object",
          required: [ "classId" ],
          properties: {
            classId: { type: "integer", description: "classId" },
          }
        }
      }],
      responses: {
        200: {
          description: "수업이 끝났을 경우.",
          schema: {
            type: "object",
            properties: {
              message: { type: "string", description: "success"},
            }
          }
        },
        400: { $ref: "#/components/res/ResWrongParameter" },
        401: { $ref: "#/components/res/ResNoAuthorization" },
        409: { $ref: "#/components/res/ResConflict" },
        500: { $ref: "#/components/res/ResInternal" },
      }
    }
  }
}
 */
exports.endLecture = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let targetLecture = false

  if (!classId){
    req.Error.wrongParameter(res, "classId")
    return;
  }

  const checkPermission = ()=>{
    return models.ClassRelation.findOne({
      where: {
        user: userId,
        classId: classId,
        relationType: {
          [Op.gte]: 2
        }
      }
    })
  }

  const findLatestLecture = (relation)=>{
    if (!relation) throw new Error("NoPermission")
    return models.Lecture.findOne({
      where: {
        classId: classId,
        endedAt: null
      }
    })
  }


  const checkStart = (lecture)=>{
    targetLecture = lecture
    if (lecture) return
    else throw new Error("NoStart")
  }

  const endLecture = ()=>{
    return models.Lecture.update({ endedAt: Date.now() }, { where: { classId: classId, endedAt: null }})
  }

  const endPresentation = ()=>{
    return models.Presentation.update({ endedAt: Date.now() }, { where: { classId: classId, endedAt: null }})
  }

  const stopLectureServer = ()=>{
    return socketServer.stopLecture(targetLecture.lectureId)
  }

  const respond = ()=>{
    res.json({ message: "success" })
  }

  checkPermission()
    .then(findLatestLecture)
    .then(checkStart)
    .then(endLecture)
    .then(endPresentation)
    .then(stopLectureServer)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "NoPermission") req.Error.noAuthorization(res)
      else if (err.message == "NoStart") req.Error.conflict(res)
      else req.Error.internal(res)
    })

}

/**
@swagger
paths: {
  /api/lecture/join_lecture: {
    post: {
      tags: [ Lecture ],
      summary: "수업을 들어가는 API",
      description: "수업을 시작하는 API. 409면 수업이 시작하지 않은것.",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "",
        schema: {
          type: "object",
          required: [ "classId" ],
          properties: {
            classId: { type: "integer", description: "classId" },
            lectureName: { type: "string", description: "수업 내용"}
          }
        }
      }],
      responses: {
        200: {
          description: "수업이 시작되었을 경우.",
          schema: {
            type: "object",
            properties: {
              lectureId: { type: "integer", description: "시작된 수업 id"},
            }
          }
        },
        400: { $ref: "#/components/res/ResWrongParameter" },
        401: { $ref: "#/components/res/ResNoAuthorization" },
        409: { $ref: "#/components/res/ResConflict" },
        500: { $ref: "#/components/res/ResInternal" },
      }
    }
  }
}
*/
exports.joinLecture = (req, res)=>{
  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let socketId = req.body.socketId

  if (!classId || !socketId){
    req.Error.wrongParameter(res, "classId socketId")
    return;
  }

  const checkPermission = ()=>{
    return models.ClassRelation.findOne({
      where: {
        user: userId,
        classId: classId,
        relationType: {
          [Op.gte]: 1
        }
      }
    })
  }

  const findLatestLecture = (relation)=>{
    if (!relation) throw new Error("NoPermission")
    return models.Lecture.findOne({
      where: {
        classId: classId,
        endedAt: null
      }
    })
  }

  const setSocketJoined = (lecture)=>{
    if (!lecture) throw new Error("NoClass")
    return socketServer.joinLecture(lecture.lectureId, socketId, userId)
  }

  const respond = (lectureId)=>{
    res.json({ lectureId: lectureId })
  }

  checkPermission()
    .then(findLatestLecture)
    .then(setSocketJoined)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "NoPermission") req.Error.noAuthorization(res)
      else if (err.message =="WrongLectureId") req.Error.wrongParameter(res, "No Lecture Open")
      else if (err.message =="WrongSocketId") req.Error.wrongParameter(res, "Not Connected Socket")
      else if (err.message == "NoClass") req.Error.conflict(res)
      else req.Error.internal(res)
    })

}

/**
@swagger
paths: {
  /api/lecture/get_current_lecture:{
    post: {
      tags: [ Lecture ],
      summary: "현재 진행중인 수업을 가져오는 API. 현재 진행중인 수업이 없을 경우 409 error",
      description: ".",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "",
        schema: {
          type: "object",
          required: [ "classId" ],
          properties: {
            classId: { type: "integer", description: "classId" },
          }
        }
      }],
      responses: {
        200: {
          description: "",
          schema: {
            type: "object",
            properties: {
              lectureId: { type: "integer", description: ""},
              startedAt: { type: "string", description: "" }
            }
          }
        },
        400: { $ref: "#/components/res/ResWrongParameter" },
        401: { $ref: "#/components/res/ResNoAuthorization" },
        409: { $ref: "#/components/res/ResConflict" },
        500: { $ref: "#/components/res/ResInternal" },
      }
    }
  }
}
 */
exports.getCurrentLecture = (req, res, next)=>{
  
  let userId = req.ServiceUser.userId
  let classId = req.body.classId

  if (!classId){
    req.Error.wrongParameter(res, "classId")
    return;
  }

  const checkPermission = ()=>{
    return models.ClassRelation.findOne({
      where: {
        user: userId,
        classId: classId,
        relationType: {
          [Op.gte]: 1
        }
      }
    })
  }

  const findLatestLecture = (relation)=>{
    if (!relation) throw new Error("NoPermission")
    return models.Lecture.findOne({
      where: {
        classId: classId,
        endedAt: null
      }
    })
  }

  const respond = (lecture)=>{
    if (!lecture) throw new Error("NoStart")
    res.json(lecture)
  }

  checkPermission()
    .then(findLatestLecture)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "NoPermission") req.Error.noAuthorization(res)
      else if (err.message == "NoStart") req.Error.conflict(res)
      else req.Error.internal(res)
    })

}

/**
@swagger
paths: {
  /api/lecture/list_lecture:{
    post: {
      tags: [ Lecture ],
      summary: "수업 목록을 다 가져오는 APIs",
      description: ".",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
          in: "body",
          name: "body",
          description: "",
          schema: {
            type: "object",
            required: [ "classId" ],
            properties: {
              classId: { type: "integer", description: "classId" },
            }
          }
      }],
      responses: {
          200: {
            description: "",
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  lectureId: { type: "integer", description: ""},
                  startedAt: { type: "string", description: "" },
                  endedAt: { type: "string", description: "null 인 경우 수업 진행중인 것이다" },
                }
              }
            }
          },
          400: { $ref: "#/components/res/ResWrongParameter" },
          401: { $ref: "#/components/res/ResNoAuthorization" },
          409: { $ref: "#/components/res/ResConflict" },
          500: { $ref: "#/components/res/ResInternal" },
      }
    }
  }
}
 */
exports.listLecture = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId

  const checkPermission = ()=>{
    return models.ClassRelation.findOne({
      where: {
        user: userId,
        classId: classId,
        relationType: {
          [Op.gte]: 1
        }
      }
    })
  }
  
  const findLectures = (relation)=>{
    if (!relation) throw new Error("NoPermission")
    return models.Lecture.findAll({
      where: { classId: classId },
      order: [ ["startedAt", "DESC"] ]
    })
  }

  const respond = (lectures) =>{
    res.json(lectures)
  }

  checkPermission()
    .then(findLectures)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "NoPermission") req.Error.noAuthorization(res)
      else req.Error.internal(res)
    })
  
}


/**
@swagger
paths: {
  /api/lecture/get_user_map: {
    post: {
      tags: [ Lecture ],
      summary: "온라인 수업에서 유저들에 대한 정보를 제공하는 API",
      description: "현재 lectureId와 socketId로 진짜 들어가있는지 확인하는 과정을 거친다.",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "",
        schema: {
          type: "object",
          required: [ "lectureId", "classId" ],
          properties: {
            classId: { type: "string", description: "classId"},
            lectureId: { type: "string", description: "lectureId"}
          }
        }
      }],
      responses: {
        200: {
          description: "수업이 시작되었을 경우.",
          schema: {
            type: "object",
            properties: {
              lectureId: { type: "integer", description: "시작된 수업 id"},
            }
          }
        },
        400: { $ref: "#/components/res/ResWrongParameter" },
        401: { $ref: "#/components/res/ResNoAuthorization" },
        500: { $ref: "#/components/res/ResInternal" },
      }
    }
  }
}
*/
exports.getUserMap = (req, res)=>{
  
  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let lectureId = req.body.lectureId
  
  //if (!classId || !lectureId){
  if (!classId){
    req.Error.wrongParameter(res)
    return
  }

  const checkPermission = ()=>{
    return models.ClassRelation.findOne({
      where: {
        user: userId,
        classId: classId,
        relationType: {
          [Op.gte]: 1
        }
      }
    })
  }

  const checkLectureOnline = (relation)=>{
    if (!relation) throw new Error("NoPermission")
    return models.Lecture.findOne({
      where:{
        classId: classId,
        lectureId: lectureId,
        endedAt: null
      }
    })
  }

  const getUserData = (lecture)=>{
    if (!lecture) throw new Error("NoLecture")
    return models.ClassRelation.findAll({
      where:{
        classId: classId,
      },
      include: [{
        model: models.User,
        attributes: ["userId", "level", "name"],
        include: [
          {
            model: models.Join,
            include: [ models.Team ],
          },
          {
            model: models.Presentation
          }
        ]
      }]
    })
  }

  const respond = (data)=>{
    let returnObj = {}
    data.forEach(e => {
      var user = {
        level: e.User.level,
        name: e.User.name,
        team: e.User.Joins.length > 0 ? e.User.Joins.map(join=>join.Team) : [],
        presentation: e.User.Presentations
      }
      returnObj[e.user] = user
    });
    res.json(returnObj)
  }

  checkPermission()
    //.then(checkLectureOnline)
    .then(getUserData)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "NoPermission") req.Error.noAuthorization(res)
      else if (err.message == "NoLecture") req.Error.wrongParameter(res,"no class")
      else req.Error.internal(res)
    })


}