import React, { Component } from 'react';

import Peer from 'simple-peer'
import io from "socket.io-client"

const style = {
  me: {
    position: "fixed",
    left: 0,
    right: 0,
    height: "40vh",
    top: 0,
  },
  you: {
    position: "fixed",
    left: 0,
    right: 0,
    height: "40vh",
    top: "50vh",
  }
}

export default class WebRTCTest extends Component {

  constructor(props){
    super(props)
    this.state = {
      peers: {},
      stream: null
    }

    this.onMedia = this.onMedia.bind(this)
    this.createPeer = this.createPeer.bind(this)
    this.getMedia(this.onMedia, err => {
      this.setState({
        mediaErr: 'Could not access webcam'
      })
      this.debug('getMedia error', err)
    })

  }

componentDidUpdate() {
    if (this.stream && this.video && !this.video.srcObject) {
      this.debug('set video stream', this.video, this.stream)
      this.video.srcObject = this.stream
    }
    this.attachPeerVideos()
  }

  attachPeerVideos() {
    Object.entries(this.state.peers).forEach(entry => {
      const [peerId, peer] = entry
      if (peer.video && !peer.video.srcObject && peer.stream) {
        this.debug('setting peer video stream', peerId, peer.stream)
        peer.video.setAttribute('data-peer-id', peerId)
        peer.video.srcObject = peer.stream
      }
    })
  }

  getMedia(callback, err) {
    let getWebcam = (navigator.getUserMedia || navigator.webKitGetUserMedia || navigator.moxGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    const options = { video: true, audio: true }
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return navigator.mediaDevices.getUserMedia(options)
        .then(stream => callback(stream))
        .catch(e => err(e))
    }
    return getWebcam(options, callback,  err)
  }

  onMedia(stream) {
    this.stream = stream
    this.forceUpdate() // we have stream
    //this.socket = io("http://caphelper.owlsogul.com:30081")
    this.socket = io("http://localhost:4000")
    //this.socket = io("https://caphelper.owlsogul.com/socket.io")
    this.socket.on('peer', msg => {
      const peerId = msg.peerId
      this.debug('new peer poof!', peerId)
      if (peerId === this.socket.id) {
        return this.debug('Peer is me :D', peerId)
      }
      this.createPeer(peerId, true, stream)
    })
    this.socket.on('signal', data => {
      const peerId = data.from
      const peer = this.state.peers[peerId]
      if (!peer) {
        this.createPeer(peerId, false, stream)
      }
      this.debug('Setting signal', peerId, data)
      this.signalPeer(this.state.peers[peerId], data.signal)
    })
    this.socket.on('unpeer', msg => {
      this.debug('Unpeer', msg)
      this.destroyPeer(msg.peerId)
    })
  }

  createPeer(peerId, initiator, stream) {
    this.debug('creating new peer', peerId, initiator)

    const peer = new Peer({initiator: initiator, trickle: true, stream})

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

  renderPeers() {
    return Object.entries(this.state.peers).map(entry => {
      const [peerId, peer] = entry
      this.debug('render peer', peerId, peer, entry)
      return <div key={peerId}>
        <video ref={video => peer.video = video} autoPlay style={style.you}></video>
      </div>
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">WebRTC Video Chat</h1>
        </header>
        {this.state.mediaErr && (
          <p className="error">{this.state.mediaErr}</p>
        )}
        <div id="me">
          <video id="myVideo" ref={video => this.video = video} autoPlay controls style={style.me}></video>
        </div>
        <div id="peers">{this.renderPeers()}</div>
      </div>
    );
  }
}