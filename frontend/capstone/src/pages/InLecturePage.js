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
      classId: "",
      peers: {},
      myVideoStream: false,
      mySocketId: false,
      error: false
    }
    this.getMedia = this.getMedia.bind(this)
    this.onMedia = this.onMedia.bind(this)
    this.createWebRTCSocket = this.createWebRTCSocket.bind(this)
    this.connectWebRTCSocket = this.connectWebRTCSocket.bind(this)
    this.handleComplete = this.handleComplete.bind(this)
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

    this.setState({ myVideoStream: stream })
    this.forceUpdate() // we have stream
  }

  createWebRTCSocket(){
    return new Promise((res, rej)=>{
      //this.socket = io("http://localhost:30081")
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


    })
  }

  connectWebRTCSocket(){
    
    this.socket.on('peer', msg => {
      const peerId = msg.peerId
      this.debug('new peer poof!', peerId)
      if (peerId === this.socket.id) {
        return this.debug('Peer is me :D', peerId)
      }
      this.createPeer(peerId, true, this.state.myVideoStream)
    })
    this.socket.on('signal', data => {
      const peerId = data.from
      const peer = this.state.peers[peerId]
      if (!peer) {
        this.createPeer(peerId, false, this.state.myVideoStream)
      }
      this.debug('Setting signal', peerId, data)
      this.signalPeer(this.state.peers[peerId], data.signal)
    })
    this.socket.on('unpeer', msg => {
      this.debug('Unpeer', msg)
      this.destroyPeer(msg.peerId)
    })
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
    this.debug('creating new peer', peerId, initiator)

    const peer = new Peer({initiator: initiator, trickle: false, stream})

    peer.on('signal', (signal) => {
      const msgId = (new Date().getTime())
      const msg = { msgId, signal, to: peerId }
      this.debug('peer signal sent', msg)
      this.socket.emit('signal', msg)
    })
  
    peer.on('stream', (stream) => {
      this.debug('Got peer stream!!!', peerId, stream)
      peer.stream = stream
      this.setPeerState(peerId, peer)
    })

    peer.on('connect', () => {
      this.debug('Connected to peer', peerId)
      //peer.connected = true
      this.setPeerState(peerId, peer)
      peer.send(this.serialize({
        msg: 'hey man!'
      }))
    })

    peer.on('data', data => {
      this.debug('Data from peer', peerId, this.unserialize(data))
    })

    peer.on('error', (e) => {
      this.debug('Peer error %s:', peerId, e);
    })

    this.setPeerState(peerId, peer)

    return peer
  }

  destroyPeer(peerId) {
    const peers = {...this.state.peers}
    delete peers[peerId]
    this.setState({
      peers
    })
  }

  serialize(data) {
    return JSON.stringify(data)
  }

  unserialize(data) {
    try {
      return JSON.parse(data.toString())
    } catch(e) {
      return undefined
    }
  }

  setPeerState(peerId, peer) {
    const peers = {...this.state.peers}
    peers[peerId] = peer
    this.setState({
      peers
    })
  }

  debug(str, ...data){
    console.log(str, data)
  }

  signalPeer(peer, data) {
    try {
      peer.signal(data)
    } catch(e) {
      this.debug('sigal error', e)
    }
  }

  render() {
    let page = (<></>)
    if (this.state.error) {
      page = <ErrorPage msg={this.state.error}/>
    }
    else {
      page = <LecturePage mySocketId={this.state.mySocketId } myVideoStream={this.state.myVideoStream} peers={this.state.peers}/>
    }
    return (
      <ClassTemplate match={this.props.match}>
        {page}
      </ClassTemplate>
    );
  }
}