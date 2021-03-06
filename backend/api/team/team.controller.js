/**
 * @swagger
 * tags:
 *   name: Team
 *   description: Team 관련 API들
 */

const models = require("../../models")
const Sequelize = require("sequelize")
const Op = Sequelize.Op;

/**
 * @swagger
 *  paths: {
 *    /api/team/list:{
 *      post: {
 *        tags: [ Team ],
 *        summary: "해당 수업의 팀 목룍을 호출하는 API",
 *        description: "",
 *        consumes: [ "application/json" ],
 *        produces: [ "application/json" ],
 *        parameters : [{
 *          in: "body",
 *          name: "body",
 *          description: "팀 목록",
 *          schema: {
 *            type: "object",
 *            properties: {
 *              classId: { type: "integer", description: "조회할 수업의 코드" }
 *            }
 *          }
 *        }],
 *        responses: {
 *            200: {
                description: "개설된 팀 join에 관한 정보",
                schema: {
                  type: "object",
                  required: [ "teams" ],
                  properties: {
                    teams: { 
                      type: "array", 
                      description: "팀 목록",
                      items: {
                        type: "object",
                        properties: {
                          teamId: { type: "integer", description: "팀 아이디" },
                          classId: { type: "integer", description: "수업 아이디" },
                          Joins: {
                            type: "array",
                            description: "팀에 가입한 사람",
                            items: {
                              type: "object",
                              properties: {
                                user: { type: "string", description: "user id"},
                                joinStatus: { type: "integer", description: "0이면 대기중, 1이면 등록 완료" }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
 *            },
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
        model: models.Join,
        include: models.User
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
  /api/team/get_team:{
    post: {
      tags: [ Team ],
      summary: "팀 정보를 가져오는 API",
      description: "팀이 이미 있거나 팀 매칭 기간이 아니면 400 오류가 난다.",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "팀",
        schema: {
          type: "object",
          required: [ "classId", "teamId" ],
          properties: {
            classId: { type: "integer", description: "수업 아이디"},
            teamId: { type: "integer", description: "수업 아이디"},
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
              Joins: {
                type: "array",
                description: "팀에 가입한 사람",
                items: {
                  type: "object",
                  properties: {
                    user: { type: "string", description: "user id"},
                    joinStatus: { type: "integer", description: "0이면 대기중, 1이면 등록 완료" }
                  }
                }
              }
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
exports.getTeam = (req, res, next)=>{
  
  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let teamId = req.body.teamId

  const findTeam = ()=>{
    return models.Team.findOne({
      include: [{
        model: models.Join,
        include: [ models.User ]
       }],
      where: { classId: classId, teamId: teamId }
    })
  }

  const respond = (team)=>{
    if (!team) throw new Error("WrongTeam")
    res.json(team)
  }

  findTeam()
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "WrongTeam") req.Error.wrongParameter(res, "team")
      else req.Error.internal(res)
    })

}

/**
@swagger
paths: {
  /api/team/create:{
    post: {
      tags: [ Team ],
      summary: "팀을 만드는 API",
      description: "팀이 이미 있거나 팀 매칭 기간이 아니면 400 오류가 난다.",
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
    return models.Join.findAll({
      where: {
        user: userId,
        classId: classId
      }
    })
  }

  const createTeam = (joins)=>{
    if (joins.length != 0) throw new Error("AlreadyTeam")
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
      else if (err.message == "AlreadyTeam") req.Error.noAuthorization(req)
      else if (err.message == "NoPeriod") req.Error.noAuthorization(req)
      else req.Error.internal(res)
    })

}


/**
@swagger
paths: {
  /api/team/get_myteam:{
    post: {
      tags: [ Team ],
      summary: "내 팀 정보를 가져오는  API",
      description: "",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "내 팀 정보를 가져온다.",
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
          description: "없으면 빈 값으로 온다.",
          schema: {
            type: "object",
            properties: {
              classId: { type: "integer", description: "해당 수업의 코드"},
              teamId: { type: "integer", description: "만들어진 팀의 코드"},
              Joins: {
                type: "array",
                description: "팀에 가입한 사람",
                items: {
                  type: "object",
                  properties: {
                    user: { type: "string", description: "user id"},
                    joinStatus: { type: "integer", description: "0이면 대기중, 1이면 등록 완료" }
                  }
                }
              }
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
exports.getMyTeam = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  
  if (!classId){
    req.Error.wrongParameter(res, "classId")
    return;
  }

  const getTeam = ()=>{
    return models.Join.findOne({
      include: [{
        model: models.Team,
        include: [ models.Join ]
       }],
      where: {
        user: userId,
        classId: classId,
      }
    })
  }

  const respond = (join)=>{
    res.json(join ? join.Team : {})
  }

  getTeam()
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "NoClass") req.Error.wrongParameter(res, "Wron Class")
      else if (err.message == "NoPeriod") req.Error.noAuthorization(req)
      else req.Error.internal(res)
    })
}

/**
@swagger
paths: {
  /api/team/leave_team:{
    post: {
      tags: [ Team ],
      summary: "팀에서 나가는 API",
      description: "",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "해당 팀에서 나간다",
        schema: {
          type: "object",
          required: [ "classId", "teamId" ],
          properties: {
            classId: { type: "integer", description: "수업 아이디"},
            teamId: { type: "integer", description: "팀 아이디"},
          }
        }
      }],
      responses: {
        200: {
          description: "없으면 빈 값으로 온다.",
          schema: {
            type: "object",
            properties: {
              msg: { type: "string", description: "success"},
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
exports.leaveTeam = (req, res)=>{
  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let teamId = req.body.teamId

  if (!classId || !teamId){
    req.Error.wrongParameter(res, "classId or teamId")
    return
  }

  // TODO: 기간 check

  // join 찾기
  const findJoin = ()=>{
    return models.findAll({ where: { classId: classId, teamId: teamId } })
  }

  // 없으면 안되고, 있을경우
  // 리더면 다른 사람에게
  const checkLeader = (joins)=>{

    let notMe = [] // 다른 사람있는지 check
    let isLeader = false // leader인지 check
    let findMe = false // 가입했는지 check

    joins.forEach((join)=>{
      if (join.user != userId) notMe.push(join) // 내가 아닐경우 notMe에
      else { // 나일 경우 리더인지 확인
        findMe = true
        isLeader = join.isLeader
      }
    })
    if (!findMe) throw new Error("NoJoin")
    return { isLeader, notMe }
  }

  const deleteJoin = ()=>{
    return models.Join.destroy({ where: { user: userId, classId: classId, teamId: teamId } })
  }

  const deleteTeam = ()=>{
    return models.Team.destroy({ where: { teamId: teamId } })
  }
  
  const routePromise = (data)=>{
    let notMe = data.notMe
    let isLeader = data.isLeader
    if (notMe.length == 0) { // 나 제외 팀이 없을 경우
      return deleteJoin().then(deleteTeam) // 조인 삭제 후 팀 삭제
    }
    else { // 나 제외 팀원이 있을 경우
      if (isLeader){ // 내가 리더면 리더 변경
        return models.Join
                .update(
                  { isLeader: true, joinStatus: 1 }, 
                  { where: { user: notMe[0].user, teamId: teamId, classId: classId } })
                .then(deleteJoin)
      }
      else { // 아니면 그냥 나감
        return deleteJoin()
      }
    }
  }

  const respond = ()=>{
    res.json({ msg: "success" })
  }

  findJoin()
    .then(checkLeader)
    .then(routePromise)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "NoJoin") req.Error.wrongParameter(res, "no join")
      else req.Error.internal(res)
    })

}

/**
@swagger
paths: {
  /api/team/get_invite:{
    post: {
      tags: [ Team ],
      summary: "초대를 확인하는 API",
      description: "teamId가 있으면 팀이 초대한 사람을 조회하고, 없으면 자신에게 온 초대를 조회한다.",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "body",
        schema: {
          type: "object",
          required: [],
          properties: {
            teamId: { type: "integer", description: "팀 아이디"},
          }
        }
      }],
      responses: {
        200: {
          description: "생성된 초대 모델이 리턴됨",
          schema: {
            type: "object",
            properties: {
              teamId: { type: "integer", description: "해당 팀의 코드"},
              targetMember: { type: "string", description: "초대된 유저"},              
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
exports.getInvite = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let teamId = req.body.teamId

  if (teamId){ //team Id 가 있으면 팀이 초대한 사람 조회

    const findInvite = ()=>{
      return models.TeamInvite.findAll({
        where: { teamId: teamId }
      })
    }

    const respond = (invites)=>{
      res.json(invites)
    }

    findInvite()
      .then(respond)
      .catch(err=>{
        console.log(err)
        req.Error.internal(res)
      })

  }
  else { // teamId 가 없으면 자기를 초대한 팀 확인

    const findInvite = ()=>{
      return models.TeamInvite.findAll({
        where: { targetMember: userId }
      })
    }

    const respond = (invites)=>{
      res.json(invites)
    }

    findInvite()
      .then(respond)
      .catch(err=>{
        console.log(err)
        req.Error.internal(res)
      })

  }
}


/**
@swagger
paths: {
  /api/team/invite:{
    post: {
      tags: [ Team ],
      summary: "내 팀에 초대하는 API",
      description: "해당 유저가 수업을 듣지 않는 유저라면 403, 초대하는 유저가 팀장이 아니라면 401이 호출된다.",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "내 팀에 사람을 초대한다.",
        schema: {
          type: "object",
          required: [ "classId", "teamId", "member" ],
          properties: {
            classId: { type: "integer", description: "수업 아이디"},
            teamId: { type: "integer", description: "팀 아이디"},
            member: { type: "string", description: "초대할 사람"}
          }
        }
      }],
      responses: {
        200: {
          description: "생성된 초대 모델이 리턴됨",
          schema: {
            type: "object",
            properties: {
              teamId: { type: "integer", description: "해당 팀의 코드"},
              targetMember: { type: "string", description: "초대된 유저"},              
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
exports.inviteMember = (req, res, next)=>{

  // TODO: 초대할 멤버 팀 가입 확인하기
  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let teamId = req.body.teamId
  let targetUser = req.body.member

  if (!classId || !teamId || !targetUser){
    req.Error.wrongParameter(res, "")
    return
  }

  const findMemberTake = ()=>{
    return models.Take.findOne({
      where: {
        classId: classId,
        user: targetUser,
        takeStatus: 1
      }
    })
  }

  const findJoin = ()=>{
    return models.Join.findOne({
      where: {
        classId: classId,
        teamId: teamId,
        user: userId
      }
     })
  }

  const checkCondition = ()=>{
    return Promise.all([ findMemberTake(), findJoin() ])
  }

  const inviteTeam = (cond)=>{
    if (!cond[0]) throw new Error("NoUser")
    if (!cond[1].isLeader) throw new Error("NoPermission")
    return models.TeamInvite.create({
      teamId: join.teamId,
      targetMember: targetUser
    })
  }

  const respond = (invite)=>{
    console.log(invite)
    res.json(invite)
  }

  checkCondition()
    .then(inviteTeam)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "NoPermission") req.Error.noAuthorization(res)
      else if (err.message == "NoUser") req.Error.wrongParameter(res, "member")
      else req.Error.internal(res)
    })
  

}

/**
@swagger
paths: {
  /api/team/accept_invite:{
    post: {
      tags: [ Team ],
      summary: "초대를 수락하는 API",
      description: "에러 message에 invite, team, already 가 올수 있다.",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "body",
        schema: {
          type: "object",
          required: [ "inviteId" ],
          properties: {
            inviteId: { type: "integer", description: "수락할 팀 아이디"},
          }
        }
      }],
      responses: {
        200: {
          description: "가입한 팀 모델이 리턴됨",
          schema: {
            type: "object",
            properties: {
              teamId: { type: "integer", description: "해당 팀의 코드"},
              targetMember: { type: "string", description: "초대된 유저"},              
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
exports.acceptInvite = (req, res, next)=>{
  
  let userId = req.ServiceUser.userId
  let inviteId = req.body.inviteId

  let targetTeam = null

  if (!inviteId) {
    req.Error.wrongParameter(res, "inviteId")
    return
  }

  const findInvite = ()=>{
    return models.TeamInvite.findOne({
      where: {
        inviteId: inviteId
      }
    })
  }

  const findTeam = (invite)=>{
    if (!invite) throw new Error("WrongInvite")
    return models.Team.findOne({
      where: { teamId: invite.teamId}
    })
  }

  const checkAlreadyJoin = (team)=>{
    if (!team) throw new Error("WrongTeam")
    targetTeam = team
    return models.Join.findOne({
      user: userId,
      classId: team.classId,
    })
  }

  const createJoin = (join)=>{
    if (join) throw new Error("AlreadyJoin")
    return models.Join.create({
      classId: targetTeam.classId,
      teamId: targetTeam.teamId,
      user: userId,
      joinStatus: 1
    })
  }

  const deleteInvite =()=>{
    return models.TeamInvite.destroy({
      where: { inviteId: inviteId }
    })
  }

  const respond = ()=>{
    res.json(targetTeam)
  }

  findInvite()
    .then(findTeam)
    .then(checkAlreadyJoin)
    .then(createJoin)
    .then(deleteInvite)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "WrongInvite") req.Error.wrongParameter(res, "invite")
      else if (err.message == "WrongTeam") req.Error.wrongParameter(res, "team")
      else if (err.message == "AlreadyJoin") req.Error.wrongParameter(res, "already")
      else req.Error.internal(res)
    })

}

/**
@swagger
paths: {
  /api/team/deny_invite:{
    post: {
      tags: [ Team ],
      summary: "초대를 거절하는 API",
      description: "에러 message에 invite, team, already 가 올수 있다.",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "body",
        schema: {
          type: "object",
          required: [ "inviteId" ],
          properties: {
            inviteId: { type: "integer", description: "수락할 팀 아이디"},
          }
        }
      }],
      responses: {
        200: {
          description: "해당 초대가 return 됨",
          schema: {
            type: "object",
            properties: {
              teamId: { type: "integer", description: "해당 팀의 코드"},
              targetMember: { type: "string", description: "초대된 유저"},              
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
exports.denyInvite = (req, res, next)=>{
  
  let userId = req.ServiceUser.userId
  let inviteId = req.body.inviteId

  let targetInvite = null

  if (!inviteId) {
    req.Error.wrongParameter(res, "inviteId")
    return
  }

  const findInvite = ()=>{
    return models.TeamInvite.findOne({
      where: {
        inviteId: inviteId
      }
    })
  }

  const deleteInvite =(invite)=>{
    if (!invite) throw new Error("WrongInvite")
    targetInvite = invite
    return models.TeamInvite.destroy({
      where: { inviteId: inviteId }
    })
  }
  
  const respond = ()=>{
    res.json(targetInvite)
  }

  findInvite()
    .then(deleteInvite)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "WrongInvite") req.Error.wrongParameter(res, "invite")
      else req.Error.internal(res)
    })

}


/**
@swagger
paths: {
  /api/team/get_request_join:{
    post: {
      tags: [ Team ],
      summary: "가입 신청을 확인하는 API",
      description: "teamId가 있으면 가입 신청한 사람을 조회하고, 없으면 자신이 신청한 팀을 조회한다.",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "body",
        schema: {
          type: "object",
          required: [],
          properties: {
            teamId: { type: "integer", description: "팀 아이디"},
          }
        }
      }],
      responses: {
        200: {
          description: "생성된 신청 모델이 리턴됨",
          schema: {
            type: "object",
            properties: {
              targetTeam: { type: "integer", description: "해당 팀의 코드"},
              user: { type: "string", description: "가입 신청한 유저"},              
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
exports.getRequests = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let teamId = req.body.teamId

  if (teamId){ //team Id 가 있으면 가입을 신청한 사람 조회

    const findRequest = ()=>{
      return models.TeamRequestJoin.findAll({
        where: { targetTeam: teamId }
      })
    }

    const respond = (requests)=>{
      res.json(requests)
    }

    findRequest()
      .then(respond)
      .catch(err=>{
        console.log(err)
        req.Error.internal(res)
      })

  }
  else { // teamId 가 없으면 내가 신청한 팀 확인

    const findRequest = ()=>{
      return models.TeamInvite.findAll({
        where: { user: userId }
      })
    }

    const respond = (requests)=>{
      res.json(requests)
    }

    findRequest()
      .then(respond)
      .catch(err=>{
        console.log(err)
        req.Error.internal(res)
      })

  }
}


/**
@swagger
paths: {
  /api/team/join:{
    post: {
      tags: [ Team ],
      summary: "팀에 가입 신청하는 API",
      description: "",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "팀에 가입 신청을 한다.",
        schema: {
          type: "object",
          required: [ "classId", "teamId"],
          properties: {
            classId: { type: "integer", description: "수업 아이디"},
            teamId: { type: "integer", description: "팀 아이디"},
          }
        }
      }],
      responses: {
        200: {
          description: "생성된 가입 신청 모델이 리턴됨",
          schema: {
            type: "object",
            properties: {
              targetTeam: { type: "integer", description: "신청한 팀의 코드"},
              user: { type: "string", description: "신청한 유저"},              
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
exports.joinTeam = (req, res, next)=>{

  let userId = req.ServiceUser.userId
  let classId = req.body.classId
  let teamId = req.body.teamId

  if (!classId || !teamId){
    req.Error.wrongParameter(res, "")
    return
  }

  // 내가 수업을 듣고 있니?
  const findTake = ()=>{
    return models.Take.findOne({
      where: {
        classId: classId,
        user: userId,
        takeStatus: 1
      }
    })
  }

  // 이 팀이 클래스에 포함되어 있니?
  const findTeam = ()=>{
    return models.Team.findOne({
      where: {
        teamId: teamId,
        classId: classId
      }
    })
  }

  // 내가 팀에 이미 들어가있니?
  const findJoin = ()=>{
    return models.Join.findOne({
      where: {
        classId: classId,
        user: userId
      }
     })
  }

  const checkCondition = ()=>{
    return Promise.all([ findTake(), findTeam(), findJoin() ])
  }

  const joinTeam = (cond)=>{
    if (!cond[0]) throw new Error("NoTake")
    if (!cond[1]) throw new Error("NoTeam")
    if (!cond[2]) throw new Error("AlreadyJoin")
    return models.TeamRequestJoin.create({
      targetTeam: join.teamId,
      user: targetUser
    })
  }

  const respond = (invite)=>{
    console.log(invite)
    res.json(invite)
  }

  checkCondition()
    .then(joinTeam)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "NoTake") req.Error.wrongParameter(res, "NoTake")
      else if (err.message == "NoTeam") req.Error.wrongParameter(res, "NoTeam")
      else if (err.message == "AlreadyJoin") req.Error.wrongParameter(res, "AlreadyJoin")
      else req.Error.internal(res)
    })
}

/**
@swagger
paths: {
  /api/team/accept_join:{
    post: {
      tags: [ Team ],
      summary: "가입 신청을 수락하는 API",
      description: "",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "body",
        schema: {
          type: "object",
          required: [ "requestId" ],
          properties: {
            requestId: { type: "integer", description: "신청 수락할 아이디"},
          }
        }
      }],
      responses: {
        200: {
          description: "팀이 리턴됨",
          schema: {
            type: "object",
            properties: {
              teamId: { type: "integer", description: "해당 팀의 코드"},
              targetMember: { type: "string", description: "초대된 유저"},              
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
exports.acceptJoin = (req, res, next)=>{
  
  let userId = req.ServiceUser.userId
  let requestId = req.body.requestId

  let targetTeam = null
  let targetRequest = null

  if (!requestId) {
    req.Error.wrongParameter(res, "requestId")
    return
  }

  // 해당 리퀘스트가 있는가?
  const findRequestJoin = ()=>{
    return models.TeamRequestJoin.findOne({
      where: {
        requestId: requestId
      }
    })
  }

  // 해당 팀의 팀장인지 확인
  const findTeamLeader = (request)=>{
    if (!request) throw new Error("WrongRequest")
    targetRequest = request
    return models.Join.findOne({
      where: { 
        teamId: request.targetTeam, 
        user: userId ,
        isLeader: true
      }
    })
  }

  const findTeam = (join)=>{
    if (!join) throw new Error("NoPermission")
    return models.Team.findOne({
      where: { teamId: join.teamId }
    })
  }

  // 해당 사람이 이미 가입했는지 확인
  const checkAlreadyJoin = (team)=>{
    if (!team) throw new Error("NoTeam")
    targetTeam = team
    return models.Join.findOne({
      user: targetRequest.user,
      classId: team.classId,
    })
  }

  const createJoin = (join)=>{
    if (join) throw new Error("AlreadyJoin")
    return models.Join.create({
      classId: targetTeam.classId,
      teamId: targetTeam.teamId,
      user: targetRequest.user,
      joinStatus: 1
    })
  }

  const deleteRequest =()=>{
    return models.TeamInvite.destroy({
      where: { inviteId: inviteId }
    })
  }

  const respond = ()=>{
    res.json(targetTeam)
  }

  findRequestJoin()
    .then(findTeamLeader)
    .then(findTeam)
    .then(checkAlreadyJoin)
    .then(createJoin)
    .then(deleteRequest)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "WrongRequest") req.Error.wrongParameter(res, "request")
      else if (err.message == "NoPermission") req.Error.noAuthorization(res)
      else if (err.message == "AlreadyJoin") req.Error.wrongParameter(res, "already")
      else req.Error.internal(res)
    })

}
/**
@swagger
paths: {
  /api/team/deny_join:{
    post: {
      tags: [ Team ],
      summary: "가입 신청을 거절하는 API",
      description: "",
      consumes: [ "application/json" ],
      produces: [ "application/json" ],
      parameters : [{
        in: "body",
        name: "body",
        description: "body",
        schema: {
          type: "object",
          required: [ "requestId" ],
          properties: {
            requestId: { type: "integer", description: "신청 거절할 아이디"},
          }
        }
      }],
      responses: {
        200: {
          description: "팀이 리턴됨",
          schema: {
            type: "object",
            properties: {
              teamId: { type: "integer", description: "해당 팀의 코드"},
              targetMember: { type: "string", description: "초대된 유저"},              
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
exports.denyJoin = (req, res, next)=>{
  
  let userId = req.ServiceUser.userId
  let requestId = req.body.requestId

  let targetTeam = null
  let targetRequest = null

  if (!requestId) {
    req.Error.wrongParameter(res, "requestId")
    return
  }

  // 해당 리퀘스트가 있는가?
  const findRequestJoin = ()=>{
    return models.TeamRequestJoin.findOne({
      where: {
        requestId: requestId
      }
    })
  }

  // 해당 팀의 팀장인지 확인
  const findTeamLeader = (request)=>{
    if (!request) throw new Error("WrongRequest")
    targetRequest = request
    return models.Join.findOne({
      where: { 
        teamId: request.targetTeam, 
        user: userId ,
        isLeader: true
      }
    })
  }

  const deleteRequest =(join)=>{
    if (!join) throw new Error("NoPermission")
    return models.TeamInvite.destroy({
      where: { inviteId: inviteId }
    })
  }

  const respond = ()=>{
    res.json(targetTeam)
  }

  findRequestJoin()
    .then(findTeamLeader)
    .then(deleteRequest)
    .then(respond)
    .catch(err=>{
      console.log(err)
      if (err.message == "WrongRequest") req.Error.wrongParameter(res, "request")
      else if (err.message == "NoPermission") req.Error.noAuthorization(res)
      else req.Error.internal(res)
    })

}