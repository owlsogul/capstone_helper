/**
 * @swagger
 * tags:
 *   name: Team
 *   description: Team 관련 API들
 */

const models = require("../../models")
const Sequelize = require("Sequelize")
const Op = Sequelize.Op;

/**
 * @swagger
 *  paths: {
 *    /api/team/list:{
 *      get: {
 *        tags: [ Team ],
 *        summary: "팀 목룍을 호출하는 API",
 *        description: "",
 *        consumes: [ "application/json" ],
 *        produces: [ "application/json" ],
 *        parameters : [{
 *          in: "body",
 *          name: "body",
 *          description: "팀 목록",
 *          schema: { $ref: "#/components/req/ReqListClass" }
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
exports.listTeam = (req, res, next)=>{
  
  let userId = req.ServiceUser.userId
  let classId = req.body.classId

  const findTeam = ()=>{
    return models.Team.findAll({
      include: [{
        model: models.Join
      }],
      where: { classId: classId }
    })
  }

  const respond = (teams)=>{
    res.json({ teams: teams })
  }

  findTeam()
    .then(respond)
    .catch(err=>{
      console.log(err)
      req.Error.internal(res)
    })

}

/**
@swagger
paths: {
  /api/team/create:{
    post: {
      tags: [ Team ],
      summary: "팀을 만드는 API",
      description: "",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "팀",
        schema: {
          type: "object",
          required: [ "classId" ],
          properties: {
            classId: { type: "integer", description: "수업 아이디"},
          }
        }
      }],
      responses: {
        200: {
          description: "개설된 팀 join에 관한 정보",
          schema: {
            type: "object",
            required: [ "classId", "teamId" ],
            properties: {
              classId: { type: "integer", description: "해당 수업의 코드"},
              teamId: { type: "integer", description: "만들어진 팀의 코드"},
            }
          }
        },
        400: { $ref: "#/components/res/ResNoAuthorization" },
        500: { $ref: "#/components/res/ResInternal" },
      }
    }
  }
}
 */
exports.createTeam = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  
  if (!classId){
    req.Error.wrongParameter(res, "classId")
    return;
  }

  const getClass = ()=>{
    return models.ClassRelation.findOne({
      include: [ models.Class ],
      where: {
        user: userId,
        classId: classId,
        relationType: {
          [Op.gte]: 1
        }
      }
    })
  }

  const chkPerm = (targetClass)=>{
    if (!targetClass) throw new Error("NoClass")
    if (!targetClass.Class.isMatching) throw new Error("NoPeriod")

  }

  const createTeam = ()=>{
    return models.Team.create({
      classId: classId,
      teamName: "TEMP_TEAM"
    })
  }

  const createRelation = (team)=>{
    return models.Join.create({
      classId: classId,
      teamId: team.teamId,
      user: userId, 
      joinStatus: 1,
      isLeader: true
    })
  }

  const respond = (join)=>{
    res.json(join)
  }

  getClass()
    .then(chkPerm)
    .then(createTeam)
    .then(createRelation)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "NoClass") req.Error.wrongParameter(res, "Wron Class")
      else if (err.message == "NoPeriod") req.Error.noAuthorization(req)
      else req.Error.internal(res)
    })

}