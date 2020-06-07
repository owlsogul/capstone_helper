/**
@swagger
tags:
  name: Feedback
  description: Feedback 관련 API들
 */

const models = require("../../models")
const Sequelize = require("sequelize")
const Op = Sequelize.Op;


const checkManager = (userId, classId)=>{
  return models.ClassRelation.findOne({
    where: {
      user: userId,
      classId: classId,
      relationType: {
        [Op.gte]: 2
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
  
  checkManager(userId, classId)
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
      summary: "피드백을 수정/생성하는 API",
      description: "피드백을 수정하거나 생성한다. 잘못된 body를 보내면 400이 간다. JSON.parse로 체크하고 보낼 것.",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "",
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
      summary: "피드백을 삭제하는 API",
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

  const respond = (data)=>{
    res.json(data)
  }
  
  checkManager(userId, classId)
    .then(createPost)
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
  
  checkManager(userId, classId)
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
