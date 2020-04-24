const models = require("../../models")

exports.createClass = (req, res, next)=>{

    let userId = req.ServiceUser.userId
    let className = req.body.className

    const findUser = ()=>{
        return models.User.findOne({where: { userId: userId }})
    }

    const checkLevel = (user)=>{
        if (!user || user.level < 101){
            throw new Error("Low Level")
        }
        return user
    }

    const createClass = (user)=>{
        return models.Class.create({
            professor: user.userId,
            className: className
        })
    }

    const sendRes = (newClass)=>{
        res.json(newClass)
    }

    findUser()
        .then(checkLevel)
        .then(createClass)
        .then(sendRes)
        .catch((err)=>{
            console.log(err)
            if (err.message == "Low Level") req.Error.noAuthorization(res)
            else req.Error.internal(res)
        })

}