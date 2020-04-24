/**
 * @swagger
 * tags:
 *   name: Class
 *   description: Class 관련 API들
 */

const models = require("../../models")

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
 *          400: { $ref: "#/components/res/ResNoAuthorization" },
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
      console.log(err)
    })

}