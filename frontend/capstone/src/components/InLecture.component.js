import React, { Component } from 'react';
import { ListGroup } from "react-bootstrap"

const style = {
  leftHalf: {
    width: "50%",
    left: "0px",
    padding: "30px",
    backgroundColor: "#ffffff",
    height: "100%",
    borderRight: "1px solid black",
    position: "absolute",
  },
  rightHalf: {
    width: "50%",
    right: "0px",
    backgroundColor: "#dddddd",
    height: "100%",
    borderRight: "1px solid black",
    position: "absolute",
  },
}

class ErrorPage extends Component {
  render(){
    return(
      <div>
        {this.props.msg}
      </div>
    )
  }
}

class UserVideo extends Component {

  constructor(props){
    super(props)
    this.video = {}
    this.handleRef = this.handleRef.bind(this)
  }

  componentDidUpdate(){
    this.video.srcObject = this.props.stream    
  }

  handleRef(video){
    if (video){
      video.srcObject = this.props.stream
      this.video = video
    }
    
  }

  render(){
    return (
      <div style={{ width: 300, height: 300, margin: 10 }}>
        <video ref={this.handleRef} autoPlay style={{ width: "100%", height: "100%"}}/>
      </div>
    )
  }
}

class LecturePage extends Component {

  constructor(props){
    super(props)
    this.state = {
      videos: {}
    
    }
    this.attachPeerVideos = this.attachPeerVideos.bind(this)
    this.renderMapping = this.renderMapping.bind(this)
  }

  componentDidUpdate(prevProps) {
    let newVideoState = {}
    if (prevProps.myVideoStream != this.props.myVideoStream || prevProps.mySocketId != this.props.mySocketId){
      if (this.props.myVideoStream && this.props.mySocketId) {
        newVideoState[this.props.mySocketId] = this.props.myVideoStream
      }
      this.attachPeerVideos(newVideoState)
      this.setState({videos: newVideoState})
    }

    if (prevProps.peers != this.props.peers){
      console.log(this.props.peers)
      if (this.props.myVideoStream && this.props.mySocketId) {
        newVideoState[this.props.mySocketId] = this.props.myVideoStream
      }
      this.attachPeerVideos(newVideoState)
      this.setState({videos: newVideoState})
    }
    
  }

  attachPeerVideos(newVideoState) {
    Object.entries(this.props.peers).forEach(entry => {
      const [peerId, peer] = entry
      if (peer.stream) {
        console.log('setting peer video stream', peerId, peer.stream)
        //peer.video.setAttribute('data-peer-id', peerId)
        //peer.video.srcObject = peer.stream
        newVideoState[peerId] = peer.stream
      }
    })
  }

  renderMapping(entry){
    return (
      <UserVideo id={entry[0]} stream={entry[1]}/>
    )
  }

  render(){
    return(
      <div style={{ display: "flex", flexWrap:"wrap"}}>
        {
          Object.entries(this.state.videos).map(this.renderMapping)
        }
      </div>
    )
  }
}

export { ErrorPage, LecturePage }