import React, { Component } from 'react';
import { ListGroup } from "react-bootstrap"
import Moment from 'react-moment';

const style = {

  videoWrapper: {
    position: "relative",
    margin: 5
  },

  video: {
    width: 300,
    height: 300
  },

  videoContainer: {

  },

  videoMetaData:{
    position: "absolute", right: 5, top: 5,
    zIndex: 100
  },

  name: {
    background: "rgba(0,0,0,0.8)",
    color: "#ffffff"
  },

  videoData: {
    position: "absolute", right: 0, top: 0, left: 0, bottom: 0,
    background: "rgba(0,0,0,0.8)", color: "#ffffff",
    display: "flex", flexDirection: "column", justifyContent: "center", alignContent: "center"
  }
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
    this.state = {
      showData: false
    }
    this.handleRef = this.handleRef.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.renderVideo = this.renderVideo.bind(this)
    this.renderVideoMetaData = this.renderVideoMetaData.bind(this)
    this.renderVideoData = this.renderVideoData.bind(this)
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

  handleMouseEnter(){
    this.setState({ showData: true })
  }

  handleMouseLeave(){
    this.setState({ showData: false })
  }

  renderVideo(){
    if (this.props.stream){
      return <video ref={this.handleRef} autoPlay style={style.video}/>
    }
    else {
      return <div>No video</div>
    }
  }

  renderVideoMetaData() {
    let name = this.props.userData ? this.props.userData.name : ""
    return (
      <div style={style.videoMetaData}>
        <p style={style.name}>{name}</p>
      </div>
    )
  }

  renderVideoData() {
    if (!this.state.showData) return <></>
    let content = <div>정보를 불러오는 중입니다.</div>
    if (this.props.userData){
      let teamData = this.props.userData.team
      let teamInfo = teamData.length > 0 ? <div>{teamData[0].teamName}</div> : <></>
      let presentationData = this.props.userData.presentation
      let presentationInfo = (
        <>
          <div>발표 총 횟수: {presentationData.length}</div>
          {presentationData.reverse().map((p, idx)=>{
            if (idx > 3 || !p.endedAt) return <></>
            return <div><Moment format="YYYY/MM/DD">{p.startedAt}</Moment> - <Moment from={p.startedAt}>{p.endedAt}</Moment></div>
          })}
        </>
      )
      
      content = (
        <>
          <div>{this.props.userData.name}</div>
          <div>{this.props.userId}</div>
          {teamInfo}
          {presentationInfo}
        </>
      )
    }
    return (
      <div style={style.videoData}>
        {content}
      </div>
    )
  }

  render(){
    return (
      <div style={style.videoWrapper} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <div style={style.videoContainer}>
          {this.renderVideo()}
        </div>
        {this.renderVideoMetaData()}
        {this.renderVideoData()}
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
        newVideoState[this.props.mySocketId] = { video: this.props.myVideoStream }
      }
      this.attachPeerVideos(newVideoState)
      this.setState({videos: newVideoState})
    }

    if (prevProps.peers != this.props.peers){
      console.log(this.props.peers)
      if (this.props.myVideoStream && this.props.mySocketId) {
        newVideoState[this.props.mySocketId] = { video: this.props.myVideoStream }
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
        newVideoState[peerId] = { video: peer.stream}
      }
    })
  }

  renderMapping([key, value]){
    let userId = this.props.userMap[key]
    let userData = this.props.userDataMap ? this.props.userDataMap[userId] : {}
    console.log("renderMapping", this.props.userDataMap, userId, userData)
    return (
      <UserVideo key={key} id={key} stream={value.video} userId={userId} userData={userData}/>
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