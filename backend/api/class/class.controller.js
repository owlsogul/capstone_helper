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
 *        tags: [ class ],
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
      if (true) req.Error.noAuthorization(res)
      else req.Error.internal(res)
    })

}