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
    this.lectureRooms = [ "1" ]

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
  }

  startLecture(_lectureId){
    let lectureId = String(_lectureId)
    this.lectureRooms.push(lectureId)
  }

  /**
   * 
   * Throw WrongLectureId, WrongSocketId
   * @param {*} _lectureId 
   * @param {*} socketId 
   */
  joinLecture(_lectureId, socketId){

    console.log(socketId)
    let io = this.io
    let nsp = this.nsp
    let socket = io.sockets.connected[socketId.toSocketId()]
    let lectureRooms = this.lectureRooms
    let lectureId = String(_lectureId)

    return new Promise((res, rej)=>{
      if (!lectureRooms.includes(lectureId)) { rej(new Error("WrongLectureId")); return; }
      if (!socket){ rej(new Error("WrongSocketId")); return; }
      
      socket.join(lectureId, (err)=>{

        if (err) {rej(err); return; }

        socket.joinedLecture = lectureId
        console.log(`${socket.joinedLecture}에 ${socket.id.toNspId()}가 들어갔습니다.`)
        nsp.to(lectureId).emit('peer', { peerId: socket.id.toNspId() })
        res(lectureId)

      })
    })
  }

  /**
   * socket 연결 처리하는 method
   * @param {*} socket 
   */
  handleConnection(socket){
    let io = this.io
    let nsp = this.nsp
    console.log('a user connected');

    socket.on('disconnect', reason => {
      if (socket.joinedLecture){
        console.log(`${socket.joinedLecture}에서 ${socket.id}이 나갔습니다.`)
        nsp.to(socket.joinedLecture).emit('unpeer', {
          peerId: socket.id.toNspId(),
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
        const receiver = io.sockets.connected[receiverId.toSocketId()]
        if (receiver) {
        const data = {
            from: socket.id.toNspId(),
            ...msg
        }
        console.log('sending signal to', receiverId)
          nsp.to(receiverId).emit('signal', data);
        } else {
            console.log('no receiver found', receiverId)
        }
    })
  }
}

const _socketServer = new SocketServer()
module.exports = _socketServer