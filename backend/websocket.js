"use strict"
const socketio = require("socket.io")
const http = require("http")

String.prototype.toSocketId = function() {
  return this.split("/socket.io#").join("");
}

String.prototype.toNspId = function() {
  return "/socket.io#" + this;
}

/**
 * WEB RTC 디자인
 * 1. lecture 시작을 하면 방이 등록이 된다.
 * 2. 유저들은 소켓 연결을 한 후, /api/lecture/join 에 lectureId와 자신의 socketId를 보낸다.
 * 3. 서버에선 이를 받아 해당 room으로 이동시켜준다.
 * 4. lecture 종료를 하면 방이 사라지고 종료가 된다.
 */
class SocketServer {
  constructor(){
    this.lectureRooms = []
    this.presentationMap = {}

    this.listen = this.listen.bind(this)
    this.handleConnection = this.handleConnection.bind(this)
  }

  /**
   * 서버 여는 method
   * @param {*} expressApp 
   * @param {*} port 
   */
  listen(expressApp, port){
    this.socketserver = http.createServer(expressApp)
    this.io = socketio.listen(this.socketserver)
    this.nsp = this.io.of("/socket.io")
    this.socketserver.listen(port, function(){ console.log("Socket Server on") })
    this.nsp.on("connection", this.handleConnection)
  }

  stopLecture(_lectureId) {
    let lectureId = String(_lectureId)
    let idx = this.lectureRooms.findIndex(e=>e==lectureId)
    if (idx >= 0) this.lectureRooms = this.lectureRooms.splice(idx, 1)
    this.nsp.to(lectureId).emit("end", { lectureId: lectureId })
    // 발표 저장 부분 지우기
    delete this.presentationMap[lectureId]
  }

  startLecture(_lectureId){
    let lectureId = String(_lectureId)
    this.lectureRooms.push(lectureId)
    console.log("current lecture rooms are " + JSON.stringify(this.lectureRooms, null, 2))
    this.presentationMap[lectureId] = { type: 0 }
    console.log(this.presentationMap)
  }

  /**
   * 
   * Throw WrongLectureId, WrongSocketId
   * @param {*} _lectureId 
   * @param {*} socketId 
   */
  joinLecture(_lectureId, socketId, userId){

    let io = this.io
    let nsp = this.nsp
    let socket = nsp.connected[socketId]
    let lectureRooms = this.lectureRooms
    let lectureId = String(_lectureId)

    return new Promise((res, rej)=>{
      if (!lectureRooms.includes(lectureId)) { rej(new Error("WrongLectureId")); return; }
      if (!socket){ rej(new Error("WrongSocketId")); return; }
      console.log("joinLecture", lectureId)
      socket.join(lectureId, (err)=>{
        if (err) console.log(err)
        socket.joinedLecture = lectureId
        socket.userId = userId
        console.log(`${socket.joinedLecture}에 ${socket.id}:${userId}가 들어갔습니다.`)
        nsp.to(lectureId).emit('peer', { peerId: socket.id })

        console.log("presentation map", this.presentationMap)
        if (this.presentationMap[lectureId] && this.presentationMap[lectureId].type == 1){
          var pData = this.presentationMap[lectureId]
          socket.emit({ type: "start", userId: pData.userId, startedAt: pData.startedAt })
          console.log("presentation map", pData)
        }
        res(lectureId)

      })
    })
  }

  /**
   * socket 연결 처리하는 method
   * @param {*} socket 
   */
  handleConnection(socket){
    console.log("on connect event", socket.id)
    let io = this.io
    let nsp = this.nsp
    console.log('a user connected');

    socket.on('disconnect', reason => {
      if (socket.joinedLecture){
        console.log(`${socket.joinedLecture}에서 ${socket.id}이 나갔습니다. ${reason}`)
        nsp.to(socket.joinedLecture).emit('unpeer', {
          peerId: socket.id,
          reason
        })
      }
      else {
        io.emit('unpeer', {
          peerId: socket.id,
          reason
        })
      }
        
    })

    socket.on('signal', msg => {
        const receiverId = msg.to
        const receiver = nsp.connected[receiverId]
        if (receiver) {
        const data = {
            from: socket.id,
            ...msg
        }
        console.log('sending signal to', receiverId)
          nsp.to(receiverId).emit('signal', data);
        } else {
            console.log('no receiver found', receiverId)
        }
    })
    
    socket.on("member", msg=>{
      console.log("on member event", msg)
      let lectureId = String(msg.lectureId)
      if (!lectureId || lectureId != socket.joinedLecture) {
        console.log("not in lecture :", lectureId, socket.joinedLecture)
        socket.emit({ result: false })
        return
      }

      let userMap = {}
      Object.entries(nsp.in(lectureId).connected).forEach(([key, value])=>{
        userMap[key] = value.userId
      })
      socket.emit("member", { result: userMap })
      console.log(socket.userId, "request", userMap)
    })

    socket.on("presentation", msg=>{
      console.log("presentation", msg)
      let lectureId = String(msg.lectureId)
      if (!lectureId || lectureId != socket.joinedLecture) {
        console.log("not in lecture :", lectureId, socket.joinedLecture)
        return
      }
      
      if (!this.presentationMap[lectureId] || this.presentationMap[lectureId].type != 1){
        socket.emit("presentation", { type: "end" })
      }
      else {
        socket.emit("presentation", { type: "start", userId: this.presentationMap[lectureId].userId, startedAt: this.presentationMap[lectureId].startedAt })
      }
        
    })

  }

  /**
   * 발표 관련 처리 부분
   */

  // 발표 시작
  startPresentation(_lectureId, userId, startedAt){
    let io = this.io
    let nsp = this.nsp
    let lectureId = String(_lectureId)
    let lectureRooms = this.lectureRooms
    if (!lectureRooms.includes(lectureId)) { throw new Error("WrongLectureId")}
    nsp.to(lectureId).emit("presentation", { type: "start", userId: userId, startedAt: startedAt })
    this.presentationMap[lectureId] = {
      type: 1,
      startedAt: startedAt,
      userId: userId
    }
    console.log(this.presentationMap)
  }

  endPresentation(_lectureId){
    let io = this.io
    let nsp = this.nsp
    let lectureId = String(_lectureId)
    let lectureRooms = this.lectureRooms
    if (!lectureRooms.includes(lectureId)) { throw new Error("WrongLectureId")}
    nsp.to(lectureId).emit("presentation", { type:"end" })
    this.presentationMap[lectureId] = { type: 0 }
    console.log(this.presentationMap)
  }
  
}

const _socketServer = new SocketServer()
module.exports = _socketServer