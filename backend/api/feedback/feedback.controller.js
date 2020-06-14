/**
@swagger
tags:
  name: Feedback
  description: Feedback 관련 API들
 */

const models = require("../../models")
const Sequelize = require("sequelize")
const Op = Sequelize.Op;


const checkManager = (userId, classId, level)=>{
  if (!level) level = 2
  return models.ClassRelation.findOne({
    where: {
      user: userId,
      classId: classId,
      relationType: {
        [Op.gte]: level
      }
    }
  })
  .then(relation=> { 
    if (!relation) throw new Error("NoPermission") 
    return relation
  })
}

/**
@swagger
paths: {
  /api/feedback/list_form: {
    post: {
      tags: [ Feedback ],
      summary: "feedback form을 조회하는 API",
      description: "피드백 조회한다.",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "",
        schema: {
          type: "object",
          required: [ "classId"],
          properties: {
            classId: { type: "integer", description: "classId" }
          }
        }
      }],
      responses: {
        200: {
          description: "폼을 찾았을 경우.",
          schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  formId: { type: "integer", description: ""},
                }
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
exports.listForm = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId

  if (!classId){
    req.Error.wrongParameter(res, "classId teamid name body")
    return;
  }
  
  // form 찾음
  const findForm = ()=>{
    return models.FeedbackForm.findAll({
      where: { classId: classId }
    })
  }

  const respond = (form)=>{
    res.json(form)
  }
  
  checkManager(userId, classId, 1)
    .then(findForm)
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
  /api/feedback/edit_form: {
    post: {
      tags: [ Feedback ],
      summary: "feedback form을 수정/생성하는 API",
      description: "피드백 form을 수정하거나 생성한다. 잘못된 body를 보내면 400이 간다. JSON.parse로 체크하고 보낼 것.",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "예시: 
                        { 
                          classId: 1, 
                          name: 'Test Form', 
                          body: JSON.stringify(
                            {
                              '_1': {
                                'type': 'number',
                                'title': '내용의 흐름도',
                                'shared': false
                              },
                              '_3': {
                                'type': 'number',
                                'title': '내용의 간략화',
                                'shared': false
                              },
                              '_2': {
                                'type': 'string',
                                'title': '총평',
                                'shared': true
                              } 
                            }
                          ) 
                        }",
        schema: {
          type: "object",
          required: [ "classId", "name", "body" ],
          properties: {
            classId: { type: "integer", description: "classId" },
            formId: { type: "integer", description: "없으면 생성이다." },
            name: { type: "string", description: "form name" },
            body: { type: "string", description: "form body" }
          }
        }
      }],
      responses: {
        200: {
          description: "피드백을 수정/생성함.",
          schema: {
            type: "object",
            properties: {
              formId: { type: "integer", description: "success"},
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
exports.editForm = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let name = req.body.name
  let body = req.body.body
  let formId = req.body.formId

  if (!classId || !name || !body){
    req.Error.wrongParameter(res, "classId name body")
    return;
  }

  const checkBody = ()=>{
    try {
      JSON.parse(body)
    } catch(err) {
      throw new Error("WrongBody")
    }
  }

  const findForm = ()=>{
    return models.FeedbackForm.findOne({ where: { formId: formId } })
  }

  const upsertForm = (form)=>{
    if (form) {
      form.name = name
      form.body = body
      return models.FeedbackForm.update({ name: name, body: body}, { where: { formId: formId }}).then(()=>form)
    }
    return models.FeedbackForm.create(
      {
        classId: classId,
        name: name,
        body: body
      }
    )
  }

  const respond = (data)=>{
    res.json(data)
  }
  
  checkManager(userId, classId)
  .then(checkBody)
  .then(findForm)
  .then(upsertForm)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "NoPermission") req.Error.noAuthorization(res)
      else if (err.message == "WrongBody") req.Error.wrongParameter(res, "body")
      else req.Error.internal(res)
    })
}

/**
@swagger
paths: {
  /api/feedback/delete_form: {
    post: {
      tags: [ Feedback ],
      summary: "피드백 form을 삭제하는 API",
      description: "피드백을 삭제한다. ",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "",
        schema: {
          type: "object",
          required: [ "classId", "formId" ],
          properties: {
            classId: { type: "integer", description: "classId" },
            formId: { type: "integer", description: "없으면 생성이다." }
          }
        }
      }],
      responses: {
        200: {
          description: "피드백을 삭제함.",
          schema: {
            type: "object",
            properties: {
              message: { type: "string", description: "success"},
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
exports.deleteForm = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let formId = req.body.formId

  if (!classId || !formId){
    req.Error.wrongParameter(res, "classId formId")
    return;
  }

  const deleteForm = ()=>{
    return models.FeedbackForm.destroy({ where: { formId: formId } })
  }

  const respond = (data)=>{
    res.json({ message: "success"})
  }
  
  checkManager(userId, classId)
  .then(deleteForm)
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
  /api/feedback/publish_form: {
    post: {
      tags: [ Feedback ],
      summary: "피드백을 배포하는 API",
      description: "피드백을 배포한다. ",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "",
        schema: {
          type: "object",
          required: [ "classId", "formId", "expiredDate", "title" ],
          properties: {
            classId: { type: "integer", description: "classId" },
            formId: { type: "integer", description: "form Id" },
            title: { type: "string", description: "title" },
            expiredDate: { type: "string", description: "만료 날짜" }
          }
        }
      }],
      responses: {
        200: {
          description: "피드백을 배포함.",
          schema: {
            type: "object",
            properties: {
              postId: { type: "integer", description: "배포 id"},
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
exports.publishForm = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let formId = req.body.formId
  let title = req.body.title
  let expiredDate = Date.parse(req.body.expiredDate)
  let returnData = false

  if (!classId || !formId || !title){
    req.Error.wrongParameter(res, "classId expiredDate formId title")
    return;
  }

  if (!expiredDate || Date.now() > expiredDate){
    req.Error.wrongParameter(res, "wrong date")
    return;
  }

  const createPost = ()=>{
    return models.FeedbackPost.create({
      formId: formId,
      classId: classId,
      title: title,
      expiredDate: expiredDate
    })
  }

  const createEmptyReplies = (post)=>{
    returnData = post
    return new Promise((res, rej)=>{
      models.Team.findAll({ where: { classId: classId }})
        .then(teams=>{
          let replies = teams.reduce((prev, from)=>{
            return prev.concat(
              teams.filter(e=>e.teamId != from.teamId)
                .map(to=>models.FeedbackReply.create(
                  { 
                    postId: post.postId, 
                    teamId: from.teamId, 
                    targetTeamId: to.teamId, 
                    body: JSON.stringify({}) 
                  }
                )
              )
            )
          }, [])
          return Promise.all(replies)
        })
        .then(res)
        .catch(rej)
    })
  }

  const respond = ()=>{
    res.json(returnData)
  }
  
  checkManager(userId, classId)
    .then(createPost)
    .then(createEmptyReplies)
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
  /api/feedback/list_post: {
    post: {
      tags: [ Feedback ],
      summary: "feedback post 조회하는 API",
      description: "피드백 post 조회한다.",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "",
        schema: {
          type: "object",
          required: [ "classId"],
          properties: {
            classId: { type: "integer", description: "classId" }
          }
        }
      }],
      responses: {
        200: {
          description: "feedback post을 찾았을 경우.",
          schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  postId: { type: "integer", description: ""},
                  expiredDate: { type: "string", description: "만료일"},
                  FeedbackForm: { 
                    type: "object", 
                    description: "", 
                    required: [ "formId", "body"],
                    properties: { 
                      formId: { type: "integer", description: ""},
                      body: { type: "string", description: "" }
                    } 
                  }
                }
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
exports.listPost = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId

  if (!classId){
    req.Error.wrongParameter(res, "classId")
    return;
  }
  
  // form 찾음
  const findPost = ()=>{
    return models.FeedbackPost.findAll({
      include: [ models.FeedbackForm ],
      where: { classId: classId }
    })
  }

  const respond = (form)=>{
    res.json(form)
  }
  
  checkManager(userId, classId, 1)
    .then(findPost)
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
  /api/feedback/delete_post: {
    post: {
      tags: [ Feedback ],
      summary: "피드백 post을 삭제하는 API",
      description: "피드백 post을 삭제한다. ",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "",
        schema: {
          type: "object",
          required: [ "classId", "formId" ],
          properties: {
            classId: { type: "integer", description: "classId" },
            postId: { type: "integer", description: "" }
          }
        }
      }],
      responses: {
        200: {
          description: "피드백을 post을 삭제함.",
          schema: {
            type: "object",
            properties: {
              message: { type: "string", description: "success"},
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
exports.deletePost = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let postId = req.body.postId

  if (!classId || !postId){
    req.Error.wrongParameter(res, "classId postId")
    return;
  }

  const deletePost = ()=>{
    return models.FeedbackPost.destroy({ where: { classId: classId, postId: postId } })
  }

  const respond = (data)=>{
    res.json({ message: "success"})
  }
  
  checkManager(userId, classId)
  .then(deletePost)
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
  /api/feedback/save_reply: {
    post: {
      tags: [ Feedback ],
      summary: "피드백 reply를 저장하는 API",
      description: "피드백 reply을 저장한다. ",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "",
        schema: {
          type: "object",
          required: [ "postId", "teamId", "targetTeamId", "body" ],
          properties: {
            postId: { type: "integer", description: "postId" },
            teamId: { type: "integer", description: "내 팀" },
            targetTeamId: { type: "integer", description: "피드백 할 팀" },
            body: { type: "string", description: "내용" },
          }
        }
      }],
      responses: {
        200: {
          description: "피드백을 reply함.",
          schema: {
            type: "object",
            required: [ "replyId", "postId", "teamId", "targetTeamId", "body" ],
            properties: {
              replyId: { type: "integer", description: "replyId" },
              postId: { type: "integer", description: "postId" },
              teamId: { type: "integer", description: "내 팀" },
              targetTeamId: { type: "integer", description: "피드백 할 팀" },
              body: { type: "string", description: "내용" },
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
exports.replyPost = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let postId = req.body.postId
  let teamId = req.body.teamId
  let targetTeamId = req.body.targetTeamId
  let body = req.body.body
  let receivedDate = new Date()

  if (!teamId || !postId || !targetTeamId || !teamId || !body){
    req.Error.wrongParameter(res, "classId postId targetTeamId body")
    return;
  }

  if (teamId == targetTeamId) {
    req.Error.wrongParameter(res, "same team Id")
    return
  }

  // body check
  const checkBody = ()=>{
    try{
      return JSON.stringify(body)
    }
    catch(err) {
      throw new Error("WrongBody")
    }
  }

  // Join Check (퍼미션 체크는 여기서 되었다고 가정)
  const checkJoin = ()=>{
    return models.Join
            .findOne({ where: { joinStatus: 1, user: userId, teamId: teamId } })
            .then(join=>{
              if (!join) throw new Error("NoJoin")
              return join
            })
  }

  // targetTeamId check
  const checkTargetTeam = ()=>{
    return models.Team
            .findOne({ where: { teamId: targetTeamId }})
            .then(team=>{
              if (!team) throw new Error("NoTargetTeam")
              return team
            })

  }

  // 해당 포스트가 expiredDate가 넘었는지 확인
  const checkExpriedDate = ()=>{
    return models.FeedbackPost
      .findOne({
        where: {
          postId: postId,
          expiredDate: { [Op.gte]: receivedDate }
        }
      })
      .then(post=>{
        if (!post) throw new Error("NoPost")
        return post
      })
  }

  // save
  const saveReply = ()=>{
    return models.FeedbackReply.create({
      postId: postId,
      teamId: teamId,
      targetTeamId: targetTeamId,
      body: body
    })
  }

  // response
  const respond = (reply)=>{
    res.json(reply)
  }

  checkBody()
    .then(checkJoin)
    .then(checkTargetTeam)
    .then(checkExpriedDate)
    .then(saveReply)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "WrongBody") req.Error.wrongParameter(res, "wrong body")
      else if (err.message == "NoJoin") req.Error.noAuthorization(res)
      else if (err.message == "NoTargetTeam") req.Error.wrongParameter(res, "no target team")
      else if (err.message == "NoPost") req.Error.wrongParameter(res, "no post")
      else req.Error.internal(res)
    })
}


/**
@swagger
paths: {
  /api/feedback/list_reply: {
    post: {
      tags: [ Feedback ],
      summary: "우리 조의 feedback reply 조회하는 API",
      description: "피드백 reply 조회한다. type에 send 를 넣을 경우 우리가 보낸 reply, receive 넣을 경우 우리가 받은 reply를 받는다.",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "",
        schema: {
          type: "object",
          required: [ "classId", "teamId"],
          properties: {
            classId: { type: "integer", description: "classId" },
            type: { type: "string", description: "send or receive"},
            teamId: { type: "integer", description: "teamId" },
          }
        }
      }],
      responses: {
        200: {
          description: "feedback reply 찾았을 경우.",
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                replyId: { type: "integer", description: ""},
                body: { type: "string", description: ""},
                FeedbackPost: {
                  type: "object",
                  properties: {
                    postId: { type: "integer", description: "postId"}, 
                    title: { type: "string", description: "title of post"}
                  }
                }                  
              }
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
exports.listReply = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let teamId = req.body.teamId
  let type = req.body.type
  if (!type) type = "send"

  if (!classId || !teamId){
    req.Error.wrongParameter(res, "classId teamId")
    return;
  }
  
  // Join Check (퍼미션 체크는 여기서 되었다고 가정)
  const checkJoin = ()=>{
    return models.Join
            .findOne({ where: { joinStatus: 1, user: userId, teamId: teamId } })
            .then(join=>{
              if (!join) throw new Error("NoJoin")
              return join
            })
  }

  // list reply
  const findReply = ()=>{
    if (type == "receive") // 우리가 받은거
    return models.FeedbackPost
      .findAll({ 
        include: [
          { model: models.FeedbackForm },
          { model: models.FeedbackReply, where: {targetTeamId: teamId}, attributes:[ "replyId", "body" ] }
        ],
        where: { classId: classId }
      })
    else // 우리가 보낸거
    return models.FeedbackPost
      .findAll({ 
        include: [
          { model: models.FeedbackForm },
          { model: models.FeedbackReply, where: { teamId: teamId} }
        ],
        where: { classId: classId }
      })
  }


  const respond = (data)=>{
    res.json(data)
  }
  
  checkJoin()
    .then(findReply)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "NoJoin") req.Error.noAuthorization(res)
      else req.Error.internal(res)
    })
}
