/**
 * @swagger
 * tags:
 *   name: Class
 *   description: Class 관련 API들
 */

const models = require("../../models")
const Sequelize = require("sequelize")
const Op = Sequelize.Op;

/**
 * 
 * @param {integer} type 0, 1 은 수강생, 2는 조교, 3은 교수
 */
const chkPermissionWithType = (userId, classId, type)=>{
  return models.ClassRelation.findOne({ 
    where: { 
      user: userId, 
      classId: classId, 
      relationType:{ [Op.gte]: type } 
    } 
  })
}

/**
 * @swagger
 *  paths: {
 *    /api/class/list:{
 *      get: {
 *        tags: [ Class ],
 *        summary: "수업 목룍을 호출하는 API",
 *        description: "",
 *        consumes: [ "application/json" ],
 *        produces: [ "application/json" ],
 *        parameters : [{
 *          in: "body",
 *          name: "body",
 *          description: "개설할 수업에 대한 정보",
 *          schema: { $ref: "#/components/req/RecListClass" }
 *            }],
 *          responses: {
 *            200: { $ref: "#/components/res/ResListClass" },
 *            400: { $ref: "#/components/res/ResNoAuthorization" },
 *            500: { $ref: "#/components/res/ResInternal" },
 *          }
 *        }
 *     }
 *  }
 */
exports.listClass = (req, res, next)=>{
  
  let userId = req.ServiceUser.userId
  console.log(userId)

  const findUser = () => {
    return models.User.findOne({ where: { userId: userId } })
  }

  const findRelations = (user)=>{
    if (!user) throw new Error("NoUser")
    if (user.level == 0) throw new Error("NoConfirmed")
    return models.ClassRelation.findAll({ include: [ { model: models.Class} ], where: {user: userId}})
  }

  const respond = (values) =>{
    let take = []
    let manage = []
    let own = []

    for (var i = 0; i < values.length; i++){
      var type = values[i].relationType
      if (type == 0 || type == 1) {
        values[i].takeStatus = type
        take.push(values[i])
      }
      else if (type == 2){
        manage.push(values[i])
      }
      else if (type == 3){
        own.push(values[i])
      }
    }

    res.json({ take: take, manage: manage, own: own})
  }
  
  findUser()
    .then(findRelations)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "NoConfirmed") req.Error.noAuthorization(res)
      else if (err.message =="NoUser") req.Error.tokenExpired(res)
      else req.Error.internal(res)
    })

}


/**
@swagger
paths: {
  /api/class/info/classId: {
    get: {
      tags: [ Class ],
      summary: "class의 정보를 확인하는 API",
      description: "/api/class/info/(해당 classId)",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "",
        schema: {
          type: "param",
          required: [ "classId" ],
          properties: {
            classId: { type: "integer", description: "classId" },
          }
        }
      }],
      responses: {
        200: {
          description: "결과.",
          schema: {
            type: "object",
            properties: {
              className: { type: "string", description: ""},
              isMatching: { type: "boolean", description: "true or false"},
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
exports.getClassInfo = (req, res, next)=>{
  let userId = req.ServiceUser.userId
  let classId = req.params.classId

  if (!classId){
    req.Error.wrongParameter(res, "classId")
    return;
  }

  // TODO: 권한
  models.Class.findOne({where: { classId: classId }})
    .then(targetClass=>{
      res.json(targetClass)
    })

}



/**
@swagger
paths: {
  /api/class/get_permission: {
    post: {
      tags: [ Class ],
      summary: "해당 클래스에서 유저의 권한을 확인하는 API",
      description: "relationType 이 0이면 미승인, 1이면 승인, 2이면 조교, 3이면 교수 ",
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
          description: "권한 결과.",
          schema: {
            type: "object",
            properties: {
              relationType: { type: "integer", description: "0, 1, 2, 3"},
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
exports.getUserPermission = (req, res)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId

  if (!classId){
    req.Error.wrongParameter(res, "classId")
    return;
  }

  models.ClassRelation.findOne({ where: { user: userId, classId: classId } })
  .then(relation=>{
    if (!relation) throw new Error("NoJoin")
    res.json(relation)
  })
  .catch(err=>{
    console.log(err)
    if (err.message == "NoJoin") req.Error.wrongParameter(res, "classId")
    else req.Error.internal(res)
  })

}



/**
 * @swagger
 *  paths: {
 *    /api/class/create:{
 *      post: {
 *        tags: [ Class ],
 *        summary: "수업을 개설할 때 호출하는 API",
 *        description: "",
 *        consumes: [ "application/json" ],
 *        produces: [ "application/json" ],
 *        parameters : [{
 *          in: "body",
 *          name: "body",
 *          description: "개설할 수업에 대한 정보",
 *          schema: { $ref: "#/components/req/ReqCreateClass" }
 *            }],
 *          responses: {
 *            200: { $ref: "#/components/res/ResCreateClass" },
 *            400: { $ref: "#/components/res/ResNoAuthorization" },
 *            500: { $ref: "#/components/res/ResInternal" },
 *          }
 *        }
 *     }
 *  }
 */
exports.createClass = (req, res, next) => {

  let userId = req.ServiceUser.userId
  let className = req.body.className
  let classTime = req.body.classTime

  const findUser = () => {
    return models.User.findOne({ where: { userId: userId } })
  }

  const checkLevel = (user) => {
    if (!user || user.level < 101) {
      throw new Error("Low Level")
    }
    return user
  }

  const createClass = (user) => {
    return models.Class.create({
      professor: user.userId,
      className: className,
      classTime: classTime
    })
  }

  const createRelation = (newClass)=>{
    return models.ClassRelation.create({
      classId: newClass.classId,
      user: userId,
      relationType: 3
    })
  }

  const sendRes = (newClass) => {
    res.json(newClass)
  }

  findUser()
    .then(checkLevel)
    .then(createClass)
    .then(createRelation)
    .then(sendRes)
    .catch((err) => {
      console.log(err)
      if (err.message == "Low Level") req.Error.noAuthorization(res)
      else req.Error.internal(res)
    })
}

/**
 * @swagger
 *  paths: {
 *    /api/class/invite_assist: {
 *      post: {
 *        tags: [ Class ],
 *        summary: "수업 개설 후 조교를 초대하는 API",
 *        description: "자신이 개설한 수업인지 확인 후, 입력한 조교들을 초대한다.",
 *        consumes: [ "application/json" ],
 *        produces: [ "application/json" ],
 *        parameters : [{
 *          in: "body",
 *          name: "body",
 *          description: "수업 id 와 조교들을 입력한다.",
 *          schema: { $ref: "#/components/req/ReqInviteAssist" }
*         }],
 *        responses: {
 *          200: { $ref: "#/components/res/ResInviteAssist" },
 *          400: { $ref: "#/components/res/ResWrongParameter" },
 *          403: { $ref: "#/components/res/ResNoAuthorization" },
 *          500: { $ref: "#/components/res/ResInternal" },
 *        }
 *      }
 *    }
 *  }
 */
exports.inviteAssist = (req, res, next) => {

  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let assistants = req.body.assistants
  
  var targetClass = null
  var addedAssistant = null

  const findOwnedClass = () => {
    return models.Class.findOne({ where: { professor: userId, classId: classId } })
  }

  const filterRegisteredAssistants = (_targetClass)=>{
    if (!_targetClass) throw new Error("Wrong Class")
    targetClass = _targetClass
    console.log("find class" + targetClass)
    return models.User.findAll({
      attributes: [ "userId" ],
      where: { userId: assistants, level: [1, 50] }
    })
  }

  const createManageRelation = (dbAssistant) =>{
    //if (!dbAssistant || dbAssistant.length == 0) throw new Error("Nobody Registered")
    const records = dbAssistant.map(e=>{ return {classId: targetClass.classId, user: e.userId, relationType: 2} })
    console.log("new assistants are " + JSON.stringify(records))
    addedAssistant = dbAssistant
    return models.ClassRelation.bulkCreate(records)
  }

  const updateAssistantLevel = ()=>{
    return models.User.update(
      { level: 50 },
      { where: { userId: addedAssistant.map(e=>e.userId) }}
    );
  }

  const sendRes = () => {
    res.json(addedAssistant)
  }

  findOwnedClass()
    .then(filterRegisteredAssistants)
    .then(createManageRelation)
    .then(updateAssistantLevel)
    .then(sendRes)
    .catch((err) => {
      console.log(err)
      if (err.message == "Wrong Class") req.Error.noAuthorization(res)
      else if (err.message == "Nobody Registered") req.Error.wrongParameter(res)
      else req.Error.internal(res)
    })

}


/**
 * @swagger
 *  paths: {
 *    /api/class/create_assist_invite_code: {
 *      post: {
 *        tags: [ Class ],
 *        summary: "조교를 위한 초대링크를 생성하는 API",
 *        description: "초대링크 생성",
 *        consumes: [ "application/json" ],
 *        produces: [ "application/json" ],
 *        parameters : [{
 *          in: "body",
 *          name: "body",
 *          description: "수업 id 와 만료 날짜를 입력한다.",
 *          schema: { $ref: "#/components/req/ReqCreateAssistInviteCode" }
*         }],
 *        responses: {
 *          200: { $ref: "#/components/res/ResCreateInviteCode" },
 *          400: { $ref: "#/components/res/ResWrongParameter" },
 *          403: { $ref: "#/components/res/ResNoAuthorization" },
 *          500: { $ref: "#/components/res/ResInternal" },
 *        }
 *      }
 *    }
 *  }
 */
exports.createAssistInviteCode = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let expiredDate = Date.parse(req.body.expiredDate) // needed to UTC date string

  console.log(userId)
  console.log("assist invite code " + JSON.stringify(req.body))
  if (!expiredDate || Date.now() > expiredDate){
    req.Error.wrongParameter(res, "wrong date")
    return;
  }

  const makeRandomString = (from, length) => {
    var chars = from ? from : "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = length ? length : 20;
    var randomstring = '';
    for (var i = 0; i < string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
  }

  const findOwnedClass = () => {
    return models.Class.findOne({ where: { professor: userId, classId: classId } })
  }

  const createInviteCode = (targetClass)=>{
    if (!targetClass) throw new Error("Wrong Class")
    return models.InvitationCode.create({
      code: makeRandomString(false, false),
      classId: targetClass.classId,
      expiredDate: expiredDate,
      isAssist: true,
    })
  }

  const respond = (invitationCode) => {
    res.json(invitationCode)
  }

  findOwnedClass()
    .then(createInviteCode)
    .then(respond)
    .catch((err)=>{
      console.log(err)
      if (err.message == "Wrong Class") req.Error.wrongParameter(res);
      else req.Error.internal(res)
    })
}

/**
 * @swagger
 *  paths: {
 *    /api/class/create_student_invite_code: {
 *      post: {
 *        tags: [ Class ],
 *        summary: "학생을 위한 초대링크를 생성하는 API",
 *        description: "초대링크 생성",
 *        consumes: [ "application/json" ],
 *        produces: [ "application/json" ],
 *        parameters : [{
 *          in: "body",
 *          name: "body",
 *          description: "수업 id 와 만료 날짜, 자동 가입 여부를 입력한다.",
 *          schema: { $ref: "#/components/req/ReqCreateStudentInviteCode" }
*         }],
 *        responses: {
 *          200: { $ref: "#/components/res/ResCreateInviteCode" },
 *          400: { $ref: "#/components/res/ResWrongParameter" },
 *          403: { $ref: "#/components/res/ResNoAuthorization" },
 *          500: { $ref: "#/components/res/ResInternal" },
 *        }
 *      }
 *    }
 *  }
 */
exports.createStudentInviteCode = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let expiredDate = Date.parse(req.body.expiredDate) // needed to UTC date string
  let isAutoJoin = req.body.isAutoJoin ? req.body.isAutoJoin : false

  console.log(userId)
  console.log("student invite code " + JSON.stringify(req.body))
  if (!expiredDate || Date.now() > expiredDate){
    req.Error.wrongParameter(res, "wrong date")
    return;
  }

  const makeRandomString = (from, length) => {
    var chars = from ? from : "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = length ? length : 20;
    var randomstring = '';
    for (var i = 0; i < string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
  }

  const checkPermission = ()=>{
    return models.ClassRelation.findOne({
      where: {
        classId: classId,
        user: userId,
        relationType: {
          [Op.gte]: 2
        }
      }
    })
  }

  const createInviteCode = (relation)=>{
    if (!relation) throw new Error("NoPermission")
    return models.InvitationCode.create({
      code: makeRandomString(false, false),
      classId: classId,
      expiredDate: expiredDate,
      isAutoJoin: isAutoJoin
    })
  }

  const respond = (invitationCode) => {
    res.json(invitationCode)
  }

  checkPermission()
    .then(createInviteCode)
    .then(respond)
    .catch((err)=>{
      if (err.message == "NoPermission") req.Error.noAuthorization(res)
      else req.Error.internal(res)
      console.log(err)
    })

}


/**
 * @swagger
 *  paths: {
 *    /api/class/invite/parameter: {
 *      get: {
 *        tags: [ Class ],
 *        summary: "초대링크에 들어가기 위한 API, 페이지",
 *        description: "초대 링크 진입",
 *        consumes: [ "application/json" ],
 *        produces: [ "application/json" ],
 *        parameters : [{
 *          in: "parameter",
 *          name: "parameter",
 *          description: "수업 코드",
 *          schema: { $ref: "#/components/req/ReqClassInvite" }
*         }],
 *        responses: {
 *          200: { $ref: "#/components/res/ResCreateInviteCode" },
 *          400: { $ref: "#/components/res/ResWrongParameter" },
 *          403: { $ref: "#/components/res/ResNoAuthorization" },
 *          500: { $ref: "#/components/res/ResInternal" },
 *        }
 *      }
 *    }
 *  }
 */
exports.enterInvitationCode = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let code = req.params.invitationCode

  let invitation = null

  const checkEmailConfirm = ()=>{
    return new Promise((res, rej)=>{
      models.User
        .findOne({ 
          where: { 
            userId: userId, 
            level: { [Op.gt]: 0, [Op.lt]: 100 } 
          } 
        })
        .then(user=>{
          if (!user) rej("NotConfirm")
          res()
        })
    })
  }

  const findInvitationCode = ()=>{
    return models.InvitationCode.findOne({ where: { code: code } })
  }

  const validateDate = (invitationCode)=>{
    if (!invitationCode) throw new Error("WrongCode")
    if (new Date() > Date.parse(invitationCode.expiredDate)) {
      invitationCode.destroy()
      throw new Error("WrongDate")
    }
    invitation = invitationCode
    return invitationCode
  }

  const createRelation = (invitationCode)=>{
    if (invitationCode.isAssist){ // 조교
      // TODO: transaction
      return models.User.update({ level: 50 }, { where: { userId: userId } })
              .then(()=>{
                return models.ClassRelation.create({
                  classId: invitationCode.classId,
                  user: userId,
                  relationType: 2
                })
              })
    }
    else { // 학생
      let takeStatus = invitationCode.isAutoJoin ? 1 : 0
      return models.ClassRelation.create({
        classId: invitationCode.classId,
        user: userId,
        relationType: takeStatus
      })
    }
  }

  const respond = (result)=>{
    res.json(result)
  }

  checkEmailConfirm()
    .then(findInvitationCode)
    .then(validateDate)
    .then(createRelation)
    .then(respond)
    .catch(err=>{
      if (err.message == "NotConfirm") req.Error.noAuthorization(res)
      else if (err.message == "WrongCode") req.Error.wrongParameter(res, "WrongCode")
      else if (err.message == "WrongDate") req.Error.wrongParameter(res, "WrongDate")
      console.log(err)
    })
  

}

/**
 * @swagger
 *  paths: {
 *    /api/class/member: {
 *      post: {
 *        tags: [ Class ],
 *        summary: "수업의 멤버 리스트 확인하는 api",
 *        description: "초대 링크 진입",
 *        consumes: [ "application/json" ],
 *        produces: [ "application/json" ],
 *        parameters : [{
 *          in: "body",
 *          name: "body",
 *          description: "수업 코드",
 *          schema: { $ref: "#/components/req/ReqListMember" }
*         }],
 *        responses: {
 *          200: { $ref: "#/components/res/ResListMember" },
 *          400: { $ref: "#/components/res/ResWrongParameter" },
 *          403: { $ref: "#/components/res/ResNoAuthorization" },
 *          500: { $ref: "#/components/res/ResInternal" },
 *        }
 *      }
 *    }
 *  }
 */
exports.listMember = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId

  console.log(req.body)
  if (!classId){
    req.Error.wrongParameter(res,"classId")
    return
  }

  const findRelations = ()=>{
    return models.ClassRelation.findAll({ include:[ models.User], where: { classId: classId } })
  }

  const respond = (result) =>{

    let take = []
    let manages = []
    let targetClass = {}

    for (var i = 0; i < result.length; i++){
      var e = result[i]
      var type = e.relationType
      if (type == 0 || type == 1){
        take.push(e)
      }
      else if (type == 2){
        manages.push(e)
      }
      else if (type == 3){
        targetClass.classId = e.classId
        targetClass.professor = e.user
        targetClass.professorName = e.User.name
      }
    }

    return res.json({
      takes: take, manages: manages, "targetClass": targetClass
    })
  }

  findRelations()
    .then(respond)
    .catch(err=>{
      console.log(err)
      req.Error.internal(res)
    })
}

/**
 * @swagger
 *  paths: {
 *    /api/class/set_matching: {
 *      post: {
 *        tags: [ Class ],
 *        summary: "팀 매칭 여부를 결정하는 api",
 *        description: "팀 매칭을 하는 기간인지 아닌지 결정하는 api입니다.",
 *        consumes: [ "application/json" ],
 *        produces: [ "application/json" ],
 *        parameters : [{
 *          in: "body",
 *          name: "body",
 *          description: "수업 코드",
 *          schema: { $ref: "#/components/req/ReqSetMatching" }
*         }],
 *        responses: {
 *          200: { $ref: "#/components/res/ResListMember" },
 *          400: { $ref: "#/components/res/ResWrongParameter" },
 *          403: { $ref: "#/components/res/ResNoAuthorization" },
 *          500: { $ref: "#/components/res/ResInternal" },
 *        }
 *      }
 *    }
 *  }
 */
exports.setMatching = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let matchingInfo = req.body.matchingInfo

  if (!classId){
    req.Error.wrongParameter(res,"classId")
    return;
  }

  const chkPermission = ()=>{
    return models.ClassRelation.findOne({ where: { user: userId, classId: classId, [Op.gte]:{ relationType: 2 } } })
  }

  const settingMatching = (result)=>{
    if (!result) {
      throw new Error("NoAuth")
    }
    else {
      return models.Class.update({ isMatching: matchingInfo }, { where: { classId: classId } })
    }
  }

  const sortTeam = ()=>{
    return new Promise((res1, rej1)=>{
      if (!matchingInfo){ // matching 끝일 경우
        models.Team.findAll({ where: { classId: classId }})
          .then(teams=>{
            Promise.all([teams.map((team, idx)=>{
              return models.Team.update({ teamName: `${idx+1}팀` },{ where: { teamId: team.teamId } })
            })]).then(data=>{
              console.log(data)
              res1(data)
            })
            .catch(rej1)
          })
      }
      else {
        res1()
      }
    })
  }

  const respond = ()=>{
    res.json({ msg: "success" })
  }

  chkPermission()
    .then(settingMatching)
    .then(sortTeam)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "NoAuth") req.Error.noAuthorization(res)
      else req.Error.internal(res)
    })
}



exports.listNotice = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId

  if (!classId){
    req.Error.wrongParameter(res,"classId")
    return;
  }

  // TODO: 권한 조회
  const getNotices = ()=>{
    return models.Notice.findAll({ where: { classId: classId } })
  }

  const respond = (resp)=>{
    res.json(resp)
  }

  getNotices()
    .then(respond)
    .catch(err=>{
      console.log(err)
      req.Error.internal(res)
    })


}

/**
 * @swagger
 *  paths: {
 *    /api/class/post_notice: {
 *      post: {
 *        tags: [ Class ],
 *        summary: "공지를 작성하는 API",
 *        description: "공지 작성 API입니다.",
 *        consumes: [ "application/json" ],
 *        produces: [ "application/json" ],
 *        parameters : [{
 *          in: "body",
 *          name: "body",
 *          description: "공지사항 내용",
 *          schema: { $ref: "#/components/req/ReqPostNotice" }
 *         }],
 *        responses: {
            200: {
              description: "생성된 공지사항을 리턴해준다.",
              schema: {
                type: "object",
                properties: {
                    classId: { type: "integer", description: "수업 아이디" },
                    title: { type: "string", description: "공지사항 제목" },
                    body: { type: "string", description: "공지사항 내용" },
                }
              }
            },
 *          400: { $ref: "#/components/res/ResWrongParameter" },
 *          403: { $ref: "#/components/res/ResNoAuthorization" },
 *          500: { $ref: "#/components/res/ResInternal" },
 *        }
 *      }
 *    }
 *  }
 */
exports.postNotice = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let title = req.body.title
  let body = req.body.body

  if (!classId || !title || !body){
    req.Error.wrongParameter(res,"something")
    return;
  }

  const createNotice = (chkPerm)=>{
    if(!chkPerm) throw new Error("NoPermission")
    return models.Notice.create({
      classId: classId,
      title: title,
      body: body
    })
  }

  const respond= (notice)=>{
    console.log(notice)
    res.json(notice)
  }

  chkPermissionWithType(userId, classId, 2)
    .then(createNotice)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "NoPermission") req.Error.noAuthorization(res)
      else req.Error.internal(res)
    })
}

exports.memberOperation = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let targetUserId = req.body.userId
  let operType = req.body.operType

  if (!classId || !targetUserId){
    req.Error.wrongParameter(res)
  }

  models.ClassRelation.findOne({ where: {
    classId: classId,
    user: userId,
    relationType: {
      [Op.gte]: 2
    }
  }})
  .then(relation=>{
    if (!relation) {
      req.Error.noAuthorization(res)
      return
    }
    else {
      if (operType == "D"){
        models.ClassRelation.destroy({ where: { user: targetUserId, classId: classId }})
          .then(()=>{
            res.json({ msg: "success"})
          })
          .catch(err=>{
            console.log(err)
            req.Error.wrongParameter(res, "userId or classId")
          })
      }
      else if (operType == "A") {
        models.ClassRelation.update({ relationType: 1}, { where: { user: targetUserId, classId: classId }})
          .then(()=>{
            res.json({ msg: "success"})
          })
          .catch(err=>{
            console.log(err)
            req.Error.wrongParameter(res, "userId or classId")
          })
      }
      else {
        req.Error.wrongParameter(res, "operType")
      }
    }
  })
  .catch(err=>{
    console.log(err)
    req.Error.internal(res)
  })

  

}


/**
 * @swagger
 *  paths: {
 *    /api/class/get_invite_codes: {
 *      post: {
 *        tags: [ Class ],
 *        summary: "초대링크를 가져오는 api",
 *        description: "초대링크를 가져오는 API 입니다..",
 *        consumes: [ "application/json" ],
 *        produces: [ "application/json" ],
 *        parameters : [{
 *          in: "body",
 *          name: "body",
 *          description: "수업 코드",
 *          schema: { $ref: "#/components/req/ReqClassBasic" }
*         }],
 *        responses: {
 *          200: { $ref: "#/components/res/ResGetInviteCode" },
 *          400: { $ref: "#/components/res/ResWrongParameter" },
 *          403: { $ref: "#/components/res/ResNoAuthorization" },
 *          500: { $ref: "#/components/res/ResInternal" },
 *        }
 *      }
 *    }
 *  }
 */
exports.getInviteCodes = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  if (!classId){
    req.Error.wrongParameter(res, "classId")
    return;
  }
  
  const getInvites = (permResult)=>{
    if (!permResult) throw new Error("NoPermission")
    return models.InvitationCode.findAll({where: {classId: classId} })
  }

  const respond = (result)=>{
    console.log(result)
    res.json(result)
  }

  chkPermissionWithType(userId, classId, 2)
    .then(getInvites)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "NoPermission") req.Error.noAuthorization(res)
      else req.Error.internal(res)
    })
}