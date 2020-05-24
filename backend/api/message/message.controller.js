/**
 * @swagger
 * tags:
 *   name: Message
 *   description: Message 관련 API들
 */

const models = require("../../models")
const Sequelize = require("Sequelize")
const Op = Sequelize.Op;

/**
@swagger
paths: {
    /api/message/get_message:{
        post: {
            tags: [ Message ],
            summary: "학생들의 메시지 목룍을 호출하는 API",
            description: "",
            consumes: [ "application/json" ],
            produces: [ "application/json" ],
            parameters : [{
                in: "body",
                name: "body",
                description: "",
                schema: {
                    type: "object"
                }
            }],
            responses: {
                200: {
                    description: "메시지들. 수업 아이디로 묶여서 온다.",
                    schema: {
                        type: "object",
                        properties: {
                            classId: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        body: { type: "string", description: "메시지 내용"},
                                        msgType: { type: "integer", description: "0이면 내가 보낸거, 1이면 관리자가 보낸거."}
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
exports.getMessage = (req, res, next)=>{

    let userId = req.ServiceUser.userId
    
    let messages = [] // 각 콜마다 반환되는 메시지 목록
    let replaies = [] // 각 콜마다 반환되는 답변 목록
    let returnObj = {}

    const getMessage = ()=>{
        return models.Message.findAll({ where: { sender: userId }})
    }

    const getReply = ()=>{
        return models.Reply.findAll({ where: { receiver: userId } })
    }

    const mergeMessage = (data)=>{
        return Promise.all([ getMessage(), getReply() ])
                .then(data=>{

                    messages = data[0]
                    replaies = data[1]

                    messages.forEach(e=>{
                        if (!(e.classId in returnObj)){
                            returnObj[e.classId] = []
                        }
                        returnObj[e.classId].push(e)
                    })

                    replaies.forEach(e=>{
                        if (!(e.classId in returnObj)){
                            returnObj[e.classId] = []
                        }
                        returnObj[e.classId].push(e)
                    })
                    return returnObj
                })
    }

    const respond = ()=>{
        res.json(returnObj)
    }

    mergeMessage()
        .then(respond)
        .catch(err=>{
            req.Error.internal(res)
        })

}

/**
@swagger
paths: {
    /api/message/get_class_message:{
        post: {
            tags: [ Message ],
            summary: "수업 관리자들의 메시지 목룍을 호출하는 API",
            description: "",
            consumes: [ "application/json" ],
            produces: [ "application/json" ],
            parameters : [{
                in: "body",
                name: "body",
                description: "classId 가 필요하다",
                schema: {
                    type: "object",
                    required: ["classId"],
                    properties: {
                        classId: { type:"integer" }
                    }
                }
            }],
            responses: {
                200: {
                    description: "메시지들. user 아이디로 묶여서 온다.",
                    schema: {
                        type: "object",
                        properties: {
                            userId: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        body: { type: "string", description: "메시지 내용"},
                                        msgType: { type: "integer", description: "0이면 내가 보낸거, 1이면 관리자가 보낸거."}
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
exports.getClassMessage = ()=>{

    let userId = req.ServiceUser.userId
    let classId = req.body.classId

    if (!classId) {
        req.Error.wrongParameter(res, "classId")
        return
    }

    const checkPermission = ()=>{
        return models.ClassRelation.findOne({ where: { 
            classId: classId,
            userId: userId,
            relationType: {
                [Op.gte]: 2
            }
        }})
    }

    const getClassMessage = ()=>{
        return models.Message.findAll({
            where: {
                classId: classId
            }
        })
    }
    
    const getClassReply = ()=>{
        return models.Reply.findAll({
            where: {
                classId: classId
            }
        })
    }

    const mergeMessage = (relation)=>{
        if (!relation) throw new Error("NoPermission")
        sendObj = {}
        return Promise.all([getClassMessage(), getClassReply()])
            .then(data=>{
                let msg = data[0]
                let rep = data[1]

                msg.forEach(e=>{
                    if (!(e.sender in sendObj)){
                        sendObj[e.sender] = []
                    }
                    sendObj[e.sender].push(e)
                })

                rep.forEach(e=>{
                    if (!(e.receiver in sendObj)){
                        sendObj[e.receiver] = []
                    }
                    sendObj[e.receiver].push(e)
                })
                return sendObj
            })
    }

    const respond = (sendObj)=>{
        res.json(sendObj)
    }

    checkPermission()
        .then(mergeMessage)
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
    /api/message/send_message:{
        post: {
            tags: [ Message ],
            summary: "수업 관리자들에게 메시지를 보내는 API",
            description: "",
            consumes: [ "application/json" ],
            produces: [ "application/json" ],
            parameters : [{
                in: "body",
                name: "body",
                description: "classId 가 필요하다",
                schema: {
                    type: "object",
                    required: [ "classId", "body" ],
                    properties: {
                        classId: { type:"integer", description: "수업 코드" },
                        body: { type:"string", description: "내용" },
                    }
                }
            }],
            responses: {
                200: {
                    description: "생성된 메시지가 온다.",
                    schema: {
                        type: "object",
                        properties: {
                            body: { type: "string", description: "메시지 내용"},
                            msgType: { type: "integer", description: "0이면 내가 보낸거, 1이면 관리자가 보낸거."}
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
exports.sendMessage = ()=>{

    let userId = req.ServiceUser.userId
    let classId = req.body.classId
    let body = req.body.body

    if (!classId || !body){
        req.Error.wrongParameter(res, "classId or body")
        return
    }

    const checkPermission = ()=>{
        return models.ClassRelation.findOne({ where: { 
            classId: classId,
            userId: userId,
            relationType: {
                [Op.gte]: 1
            }
        }})
    }

    const send = (relation)=>{
        if (!relation) throw new Error("NoPermission")
        return models.Message.create({
            classId: classId,
            sender: userId,
            body: body
        })
    }

    const respond = (msg)=>{
        res.json(msg)
    }

    checkPermission()
        .then(send)
        .then(respond)
        .catch(err=>{
            if (err.message == "NoPermission") req.Error.noAuthorization(res)
            else req.Error.internal(res)
        })

}

/**
@swagger
paths: {
    /api/message/send_reply:{
        post: {
            tags: [ Message ],
            summary: "수업 관리자들이 메시지를 보내는 API",
            description: "",
            consumes: [ "application/json" ],
            produces: [ "application/json" ],
            parameters : [{
                in: "body",
                name: "body",
                description: "classId, receiver 가 필요하다",
                schema: {
                    type: "object",
                    required: [ "classId", "receiver", "body" ],
                    properties: {
                        classId: { type:"integer", description: "수업 코드" },
                        receiver: { type:"string", description: "받을 사람" },
                        body: { type:"string", description: "내용" },
                    }
                }
            }],
            responses: {
                200: {
                    description: "생성된 메시지가 온다.",
                    schema: {
                        type: "object",
                        properties: {
                            body: { type: "string", description: "메시지 내용"},
                            msgType: { type: "integer", description: "0이면 내가 보낸거, 1이면 관리자가 보낸거."}
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
exports.sendReply = ()=>{

    let userId = req.ServiceUser.userId
    let classId = req.body.classId
    let receiver = req.body.receiver
    let body = req.body.body

    if (!classId || !body || !receiver){
        req.Error.wrongParameter(res, "classId, body or receiver")
        return
    }

    const checkPermission = ()=>{
        return models.ClassRelation.findOne({ where: { 
            classId: classId,
            userId: userId,
            relationType: {
                [Op.gte]: 2
            }
        }})
    }

    const send = (relation)=>{
        if (!relation) throw new Error("NoPermission")
        return models.Reply.create({
            classId: classId,
            sender: userId,
            receiver: receiver,
            body: body
        })
    }

    const respond = (msg)=>{
        res.json(msg)
    }

    checkPermission()
        .then(send)
        .then(respond)
        .catch(err=>{
            console.log(err)
            if (err.message == "NoPermission") req.Error.noAuthorization(res)
            else req.Error.internal(res)
        })

}