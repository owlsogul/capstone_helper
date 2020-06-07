/**
@swagger
tags:
  name: Presentation
  description: Presentation 관련 API들
 */

const models = require("../../models")
const Sequelize = require("sequelize")
const Op = Sequelize.Op;
const socketServer = require("../../websocket")

/**
@swagger
paths: {
  /api/presentation/start_presentation: {
    post: {
      tags: [ Presentation ],
      summary: "발표을 시작하는 API",
      description: "발표를 시작하는 API. 다른 사람이 발표 중이거나 수업이 진행중이 아닌 경우 409에러가 난다.",
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
            classId: { type: "integer", description: "classId" }
          }
        }
      }],
      responses: {
        200: {
          description: "발표가 시작되었을 경우.",
          schema: {
            type: "object",
            properties: {
              presentationId: { type: "integer", description: "시작된 발표 id"},
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
exports.startPresentation = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let teamId = false
  let lectureId = -1
  let returnPresentation = false
  if (!classId){
    req.Error.wrongParameter(res, "classId")
    return;
  }

  // 수업 듣는지 확인
  const checkPermission = ()=>{
    return models.ClassRelation.findOne({
      where: {
        user: userId,
        classId: classId,
        relationType: 1
      }
    })
    .then(relation=> { 
      if (!relation) throw new Error("NoPermission") 
      return relation
    })
  }

  // 팀 가입되었는지 확인
  const checkTeam = ()=>{
    return models.Join.findOne({
      classId: classId,
      user: userId
    })
    .then(join=> { 
      if (!join) throw new Error("NoTeam") 
      teamId = join.teamId
      return join
    })
  }
  
  // 수업 중인지 확인
  const checkLecture = ()=>{
    return models.Lecture.findOne({
      where: {
        classId: classId,
        endedAt: null
      }
    })
    .then(lecture=>{ 
      if (!lecture) throw new Error("NoLecture") 
      lectureId = lecture.lectureId
      return lecture
    })
  }

  // 이미 발표중인지 확인
  const checkPresentation = ()=>{
    return models.Presentation.findOne({
      where: {
        classId: classId,
        lectureId: lectureId,
        endedAt: null
      }
    })
    .then(presentation=>{
      if (presentation) throw new Error("AlreadyPresentation")
      return presentation
    })
  }

  const createPresentation = ()=>{
    return models.Presentation.create({
      classId: classId,
      lectureId: lectureId,
      teamId: teamId,
      userId: userId
    })
  }

  const broadCastPresentation = (presentation)=>{
    returnPresentation = presentation
    return socketServer.startPresentation(lectureId, userId, presentation.startedAt)
  }

  const respond = ()=>{
    res.json(returnPresentation)
  }
  
  checkPermission()
    .then(checkTeam)
    .then(checkLecture)
    .then(checkPresentation)
    .then(createPresentation)
    .then(broadCastPresentation)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "NoPermission") req.Error.noAuthorization(res)
      else if (err.message == "NoTeam") req.Error.noAuthorization(res)
      else if (err.message == "AlreadyPresentation") req.Error.conflict(res)
      else if (err.message == "NoLecture") req.Error.conflict(res)
      else if (err.message == "WrongLectureId") req.Error.conflict(res)
      else req.Error.internal(res)
    })
}

/**
@swagger
paths: {
  /api/presentation/end_presentation: {
    post: {
      tags: [ Presentation ],
      summary: "발표를 끝내는 API",
      description: "발표를 끝내는 API. 다른 사람이 발표 중인 경우 409에러가 난다. 수업 관리자의 경우 강제 종료가 가능하다.",
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
            classId: { type: "integer", description: "classId" }
          }
        }
      }],
      responses: {
        200: {
          description: "발표가 끝나게 되었을 경우.",
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
exports.endPresentation = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let teamId = false
  let lectureId = -1

  let level = -1

  if (!classId){
    req.Error.wrongParameter(res, "classId")
    return;
  }

  // 수업 듣는지 확인
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
    .then(relation=> { 
      if (!relation) throw new Error("NoPermission") 
      level = relation.relationType
      return relation
    })
  }

  // 수업 중인지 확인
  const checkLecture = ()=>{
    return models.Lecture.findOne({
      where: {
        classId: classId,
        endedAt: null
      }
    })
    .then(lecture=>{ 
      if (!lecture) throw new Error("NoLecture") 
      lectureId = lecture.lectureId
      return lecture
    })
  }

  // 발표자 체크
  const checkPresentation = ()=>{
    if (level == 1) {
      return models.Presentation.findOne({
        where: {
          classId: classId,
          lectureId: lectureId,
          userId: userId,
          endedAt: null
        }
      })
      .then(presentation=>{
        if (!presentation) throw new Error("NoPresentation")
        return false
      })
    }
    else {
      return true
    }
  }

  const updatePresentation = ()=>{
    return models.Presentation.update({ endedAt: Date.now() },{
      where: {
        classId: classId,
        lectureId: lectureId,
        endedAt: null
      }
    })
  }

  const broadCastPresentation = ()=>{
    return socketServer.endPresentation(lectureId)
  }

  const respond = ()=>{
    res.json({ message: "success" })
  }
  
  checkPermission()
    .then(checkLecture)
    .then(checkPresentation)
    .then(updatePresentation)
    .then(broadCastPresentation)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "NoPermission") req.Error.noAuthorization(res)
      else if (err.message == "NoPresentation") req.Error.conflict(res)
      else if (err.message == "WrongLectureId") req.Error.conflict(res)
      else if (err.message == "NoLecture") req.Error.noAuthorization(res)
      else req.Error.internal(res)
    })
}

/**
@swagger
paths: {
  /api/presentation/get_current_presentation:{
    post: {
      tags: [ Presentation ],
      summary: "현재 진행중인 발표를 가져오는 API. 현재 진행중인 발표가 없을 경우 409 error",
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
              presentationId: { type: "integer", description: ""},
              userId: { type: "string", description: ""},
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
exports.getCurrentPresentation = (req, res, next)=>{
  
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

  const findCurrentPresentation = (lecture)=>{
    if (!lecture) throw new Error("NoStart")
    return models.Presentation.findOne({
      where: {
        classId: classId,
        lectureId: lectureId,
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
  .then(findCurrentPresentation)
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
  /api/presentation/list_presentation:{
    post: {
      tags: [ Presentation ],
      summary: "발표 목록을 다 가져오는 APIs",
      description: ".",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
          in: "body",
          name: "body",
          description: "",
          schema: {
            type: "object",
            required: [ "classId", "lectureId" ],
            properties: {
              classId: { type: "integer", description: "classId" },
              lectureId: { type: "integer", description: "classId" },
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
                  presentationId: { type: "integer", description: ""},
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
exports.listPresentation = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let lectureId = req.body.lectureId

  if (!classId || !lectureId){
    req.Error.wrongParameter(res, "classId lectureId")
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
  
  const findPresentation = (relation)=>{
    if (!relation) throw new Error("NoPermission")
    return models.Presentation.findAll({
      where: { classId: classId, lectureId: lectureId },
      order: [ ["startedAt", "DESC"] ]
    })
  }

  const respond = (presentation) =>{
    res.json(presentation)
  }

  checkPermission()
    .then(findPresentation)
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
  /api/presentation/list_user_presentation:{
    post: {
      tags: [ Presentation ],
      summary: "대상의 발표 목록을 다 가져오는 APIs",
      description: "targetId 가 없을 경우 자신의 발표 목록을 가져온다.",
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
              targetId: { type: "string", description: "userId" },
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
                  presentationId: { type: "integer", description: ""},
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
exports.listUserPresentation = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let targetId = req.body.targetId

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


  
  const findPresentation = (relation)=>{
    if (!relation) throw new Error("NoPermission")
    if (targetId && relation.relationType < 2) throw new Error("NoPermission")
    if (!targetId) targetId = userId
    return models.Presentation.findAll({
      where: { classId: classId, userId: targetId },
      order: [ ["startedAt", "DESC"] ]
    })
  }

  const respond = (presentation) =>{
    res.json(presentation)
  }

  checkPermission()
    .then(findPresentation)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "NoPermission") req.Error.noAuthorization(res)
      else req.Error.internal(res)
    })
  
}