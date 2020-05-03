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

exports.createTeam = (req, res, next)=>{

}