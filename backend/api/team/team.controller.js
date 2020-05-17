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

