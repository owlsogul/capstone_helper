/**
 * @swagger
 * tags:
 *   name: Class
 *   description: Class 관련 API들
 */

const models = require("../../models")
const Sequelize = require("Sequelize")
const Op = Sequelize.Op;


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

  const findUser = () => {
    return models.User.findOne({ where: { userId: userId } })
  }

  const findTake = (user)=>{
    return models.Take.findAll({ include: [ { model: models.Class} ], where: { user: userId } })
  }

  const findManage = (user)=>{
    return models.Manage.findAll({ include: [ { model: models.Class} ], where: { user: userId } })
  }

  const findOwn = (user)=>{
    return models.Class.findAll({ where: { professor: userId } })
  }

  const findRelations = (user)=>{
    return Promise.all([findTake(user), findManage(user), findOwn(user) ])
  }

  const respond = (values) =>{
    res.json({ take: values[0], manage: values[1], own: values[2]})
  }
  
  findUser()
    .then(findRelations)
    .then(respond)
    .catch(err=>{
      console.log(err)
      req.Error.internal(res)
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

  const sendRes = (newClass) => {
    res.json(newClass)
  }

  findUser()
    .then(checkLevel)
    .then(createClass)
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
    if (!dbAssistant || dbAssistant.length == 0) throw new Error("Nobody Registered")
    const records = dbAssistant.map(e=>{ return {classId: targetClass.classId, user: e.userId} })
    console.log("new assistants are " + records)
    addedAssistant = dbAssistant
    return models.Manage.bulkCreate(records)
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
 *    /api/class/create_assist_student_code: {
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
  let isAutoJoin = req.body.isAutoJoin

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

  const findManagedClass = () => {
    return new Promise((res, rej)=>{
      models.User.findOne( {where: { userId: userId }})
      .then(user=>{
        if (!user) throw new Error("NoUser")
        if (user.level == 50) {
          models.Manage
            .findOne({ where: { user: userId, classId: classId }, include: [ { model: models.Class } ] })
            .then(manage=>{
              if (!manage) rej(new Error("WrongClass"))
              res(manage.Class)
            })
            .catch(rej)
        }
        else if (user.level == 101){
          models.Class
            .findOne({ where: { professor: userId, classId: classId }})
            .then(res)
            .catch(rej)
        }
        else {
          throw new Error("LowLevel")
        }
      })
      .catch(rej)
    })
  }

  const createInviteCode = (targetClass)=>{
    console.log("target class? " + JSON.stringify(targetClass))
    if (!targetClass) throw new Error("WrongClass")
    return models.InvitationCode.create({
      code: makeRandomString(false, false),
      classId: targetClass.classId,
      expiredDate: expiredDate,
    })
  }

  const respond = (invitationCode) => {
    res.json(invitationCode)
  }

  findManagedClass()
    .then(createInviteCode)
    .then(respond)
    .catch((err)=>{
      if (err.message == "NoUser" || err.message == "LowLevel") req.Error.noAuthorization(res)
      else if (err.message == "WrongClass") req.Error.wrongParameter(res,"wrong class")
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
                return models.Manage.create({
                  classId: invitationCode.classId,
                  user: userId
                })
              })
    }
    else { // 학생
      let takeStatus = invitationCode.isAutoJoin ? 1 : 0
      return models.Take.create({
        classId: invitationCode.classId,
        user: userId,
        takeStatus: takeStatus
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

  const findTakes = ()=>{
    return models.Take.findAll({ where: { classId: classId } })
  }

  const findManage = ()=>{
    return models.Manage.findAll({ where: { classId: classId } })
  }

  const findClass = () =>{
    return models.Class.findOne({ where: { classId: classId } })
  }

  const mergeData = ()=>{
    return Promise.all([ findTakes(), findManage(), findClass()])
  }

  const respond = (result) =>{
    return res.json({
      takes: result[0], manages: result[1], "targetClass": result[2]
    })
  }

  mergeData()
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
 *      get: {
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
  let matchingInfo = req.body.matching

  if (!classId){
    req.Error.wrongParameter(res,"classId")
    return;
  }

  const findUser = ()=>{
    return models.User.findOne({ where: { userId: userId }})
  }

  const chkPermission = (user)=>{
    if (!user) {
      throw new Error("NoAuth")
    }
    if (user.level == 50){
      return models.Manage.findOne({ where: { user: userId, classId: classId} })
    }
    else {
      return models.Class.findOne({ where: { professor: userId, classId: classId } })
    }
  }

  const setMatching = (result)=>{
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

  findUser()
    .then(chkPermission)
    .then(setMatching)
    .then(sortTeam)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "NoAuth") req.Error.noAuthorization(res)
      else req.Error.internal(res)
    })




}