import React, { Component } from 'react';

import ClassTemplate from "../components/ClassTemplate"
import Peer from 'simple-peer'
import io from "socket.io-client"
import network from "../network"

import { ErrorPage, LecturePage } from "../components/InLecture.component"

const requestSocketLectureJoin = (classId, socketId)=>{
  console.log("requestSocketLectureJoin")
  return network.network("/api/lecture/join_lecture", { body: { classId: classId, socketId: socketId } })
}

export default class InLecturePage extends Component {

  constructor(props){
    super(props)
    this.state = {
      classId: false,
      peers: {},
      mySocketId: false,
      error: false,
      userMap: {}, // socketId 와 userId의 매핑 정보
      userDataMap: {}, // userId와 userData의 매핑 정보
      lectureId: false,
      presentationUserId: false, // 발표자 socketId
      presentationStartedAt: false,
      userFeedbackData: { result: false, msg: "로딩 중..." },
    }
    this.myVideoStream = false
    this.getMedia = this.getMedia.bind(this)
    this.onMedia = this.onMedia.bind(this)
    this.createWebRTCSocket = this.createWebRTCSocket.bind(this)
    this.connectWebRTCSocket = this.connectWebRTCSocket.bind(this)
    this.handleComplete = this.handleComplete.bind(this)
    this.requestUserMap = this.requestUserMap.bind(this)
    this.handleUserMap = this.handleUserMap.bind(this)
  }

  /** 현 기기의 화면/소리를 가져오는 method */
  getMedia() {
    let getWebcam = (navigator.getUserMedia || navigator.webKitGetUserMedia || navigator.moxGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    const options = { video: true, audio: true }
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return navigator.mediaDevices.getUserMedia(options)
    }
    return new Promise((res, rej)=>{
      getWebcam(options, res,  rej)
    })
  }

  /**
   * getMedia의 callback 함수
   * @param {*} stream 
   */
  onMedia(stream) {
    this.myVideoStream = stream
    this.forceUpdate() // we have stream
    console.log("[VideoTracking]", "onMedia", false, this.myVideoStream)
  }

  /**
   * socket 연결 하는 부분
   */
  createWebRTCSocket(){
    return new Promise((res, rej)=>{
      //this.socket = io("http://localhost:30081/socket.io")
      this.socket = io.connect("https://caphelper.owlsogul.com/socket.io")
      this.setState({ error: "연결 대기중입니다."})
      this.socket.on("connect", ()=>{
        console.log("client nsp->%s", this.socket.nsp);  
        console.log(this.socket.id)
        res()
      })
      this.socket.on('connect_failed', function(err) {
        console.log(err);
      })
      this.socket.on('error', function(err) {
        console.log(err);
      })
      this.socket.on('reconnect_failed', function(err) {
        console.log(err);
      })

      // user on connect
      this.socket.on('peer', msg => {
        const peerId = msg.peerId
        console.log('[PeerTracking] onPeer', peerId == this.socket.id, peerId)
        if (peerId === this.socket.id) {
          return console.log('[PeerTracking] is Me', peerId == this.socket.id, peerId)
        }
        this.createPeer(peerId, true, this.myVideoStream)
        this.socket.emit("member", { lectureId: this.state.lectureId })
      })
  
      // 멤버 관련 부분
      this.socket.on("member", msg=>{
        let result = msg.result
        console.log("MEMBER EVENT", result)
        if (result){
          this.setState({ userMap: result})
        }      
      })
  
      // 발표 관련 부분
      this.socket.on("presentation", msg=>{
          console.log("[PresentationTracker] onPresentation", msg)
          let type = msg.type
          let userId = msg.userId
          let startedAt = msg.startedAt
          this.setState({ presentationUserId: userId, presentationStartedAt: startedAt })
          console.log("발표자:", userId)
      })

    })
  }

  connectWebRTCSocket(data){
    this.setState({ lectureId: data.lectureId })
    this.socket.emit("member", { lectureId: data.lectureId })
    this.socket.emit("presentation", { lectureId:  data.lectureId })
    // user on signal
    this.socket.on('signal', data => {
      const peerId = data.from
      const peer = this.state.peers[peerId]
      if (!peer) {
        this.createPeer(peerId, false, this.myVideoStream)
      }
      console.log('[PeerTracking] setting siganl', peerId == this.socket.id, peerId, data)
      this.signalPeer(this.state.peers[peerId], data.signal)
    })

    // user on disconnected
    this.socket.on('unpeer', msg => {
      let peerId = msg.peerId
      console.log('[PeerTracking] onUnpeer', peerId == this.socket.id, peerId)
      this.destroyPeer(msg.peerId)
      this.socket.emit("member", { lectureId: data.lectureId })
    })

    // lecture is ended
    this.socket.on("end", msg=>{
      this.socket.close()
      Object.entries(this.state.peers).forEach(entry=>{
        const [ id, peer ] = entry
        peer.destroy()
      })
      this.setState({ error: "수업이 끝났습니다.", peers: {}, mySocketId: false })
    })

  }

  handleComplete(){
    console.log(this.socket.id)
    this.setState({error: false})
    this.setState({mySocketId: this.socket.id})
  }

  requestUserMap(){
    return network.network("/api/lecture/get_user_map", { body: { classId: this.state.classId, lectureId: this.state.lectureId} })
  }

  handleUserMap(res){
    console.log("USER DATA MAP", res)
    this.setState({ userDataMap: res })
  }

  componentDidMount(){

    // classId parsing
    let classId = this.props.match.params.classId
    this.setState({ classId: classId })

    this.getMedia()
      .then(this.onMedia)
      .then(this.createWebRTCSocket)
      .then(()=>{ return requestSocketLectureJoin(classId, this.socket.id) })
      .then(this.connectWebRTCSocket)
      .then(this.handleComplete)
      .then(this.requestUserMap)
      .then(this.handleUserMap)
      .catch(err=>{
        let errMsg = "알 수 없는 오류"
        if (err.status){
          if (err.status == 400) errMsg = "서버 연결이 안되어 있습니다. 새로고침을 해도 반복되는 경우 관리자에게 문의해주세요."
          else if (err.status == 409) errMsg = "현재 진행중인 수업이 없습니다.\n교수님께 수업을 다시 만들어달라고 해주세요."
          else if (err.status == 401) errMsg = "아직 허가가 나지 않았습니다.\n관리자분께 허가 요청을 해주세요."
          console.log("err code", err.status)
          err.json().then(console.log)
        }
        else {
          console.log(err)
        }
        this.setState({ error: errMsg})
      })

  }
  
  createPeer(peerId, initiator, stream) {
    console.log('[PeerTracking] createPeer', peerId == this.socket.id, peerId, initiator, stream)

    const peer = new Peer({
      initiator: initiator, 
      trickle: true, 
      stream: stream,
    })

    peer.on('signal', (signal) => {
      const msgId = (new Date().getTime())
      const msg = { msgId, signal, to: peerId }
      console.log('[PeerTracking] onSignal', peerId == this.socket.id, peerId, msg)
      if (peerId != this.socket.id) this.socket.emit('signal', msg)
    })
  
    peer.on('stream', (stream) => {
      console.log('[PeerTracking] onStream', peerId == this.socket.id, peerId, stream)
      if (peerId == this.socket.id) {
        peer.stream = this.myVideoStream
        console.log("[VideoTracking]", "onStream is me", peerId, "is Mine")
      }
      else {
        peer.stream = stream
        console.log("[VideoTracking]", "onStream", peerId, stream)
      }
      this.setPeerState(peerId, peer)
    })

    peer.on('connect', () => {
      console.log('[PeerTracking] onConnect', peerId == this.socket.id, peerId)
      //peer.connected = true
      this.setPeerState(peerId, peer)
    })

    peer.on('error', (e) => {
      console.log('[PeerTracking] onError', peerId == this.socket.id, peerId, e)
      // 에러 발생시 삭제 하고 다시 만들기
      this.createPeer(peerId, true, this.myVideoStream)
    })

    this.setPeerState(peerId, peer)

    return peer
  }

  destroyPeer(peerId) {
    const peers = {...this.state.peers}
    if (peers[peerId]) peers[peerId].destroy()
    delete peers[peerId]
    this.setState({
      peers
    })
  }

  setPeerState(peerId, peer) {
    const peers = {...this.state.peers}
    peers[peerId] = peer
    this.setState({
      peers
    })
  }

  signalPeer(peer, data) {
    try {
      peer.signal(data)
    } catch(e) {
      if (e.message == "cannot signal after peer is destroyed"){
        console.log('[PeerTracking] destroy signal error', peer, data, e)
        
      }
      else {
        console.log('[PeerTracking] signal error', peer, data, e)
      }
    }
  }

  handlePresentation(){
    let isPresentation = this.state.presentationUserId
    if(!isPresentation){
      network.network("/api/presentation/start_presentation", {body: {classId: this.state.classId}})
        .then(res=>{
          console.log(res)
        })
        .catch(err=>{
          if (err.status == 409){
            alert("already start")
          }
          else {
            alert("error")
          }
        })
    }
    else {
      network.network("/api/presentation/end_presentation", {body: {classId: this.state.classId}})
        .then(res=>{
          console.log(res)
        })
        .catch(err=>{
          if (err.status == 409){
            alert("already start")
          }
          else {
            alert("error")
          }
        })
    }
  }

  handleCheckFeedback(){

    this.setState({ userFeedbackData: { result: false, msg: "로딩 중..." } })
    // target userId, classId => team
    // team => feedback replies
    // show it
    network.network("/api/feedback/admin_list_reply", { body: { userId: this.state.presentationUserId, classId: this.state.classId } })
      .then(feedbackList=>{
        var body = feedbackList.map(weeklyFeedback=>{
          var replies = weeklyFeedback.FeedbackReplies
          var form = weeklyFeedback.FeedbackForm

          // 응답 수집 및 가공
          var formBody = JSON.parse(form.body)
          var retValue = {
            postId: weeklyFeedback.postId,
            title: weeklyFeedback.title,
            body: {}
          }
          Object.entries(formBody).forEach(([pId, pData])=>{
            if (pData.type == "number"){
              retValue.body[pId] = {
                title: pData.title,
                answer: replies.reduce((prev, reply)=>{
                  return prev + Number.parseInt(JSON.parse(reply.body)[pId])/replies.length
                }, 0)
              }
            }
            else {
              retValue.body[pId] = {
                title: pData.title,
                answer: replies.reduce((prev, reply)=>{
                  return prev + JSON.parse(reply.body)[pId] + "\n"
                }, "")
              }
            }
          })

          // 리턴
          console.log("[FeedbackTracking]", retValue)
          return retValue
        })        
        this.setState({ userFeedbackData: { result: true, body: body} })
      })
      .catch(res=>{
        this.setState({ userFeedbackData: { result: false, msg: "권한이 없습니다." } })
      })

  }

  render() {
    let page = (<></>)
    if (this.state.error) {
      page = <ErrorPage msg={this.state.error}/>
    }
    else {
      page = 
      <LecturePage 
        mySocketId={this.state.mySocketId } 
        myVideoStream={this.myVideoStream} 
        peers={this.state.peers} 
        userMap={this.state.userMap} 
        userDataMap={this.state.userDataMap}
        presentationUserId={this.state.presentationUserId}
        presentationStartedAt={this.state.presentationStartedAt}

        // event callback
        onClickPresentation={this.handlePresentation.bind(this)}
        onClickCheckFeedback={this.handleCheckFeedback.bind(this)}
        
        // 주차별로 합산들어갑니다잉
        userFeedbackData={this.state.userFeedbackData}

      />
    }
    return (
      <ClassTemplate match={this.props.match}>
        {page}
      </ClassTemplate>
    );
  }
}