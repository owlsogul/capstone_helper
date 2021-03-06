import React, { Component } from 'react';
import { ListGroup } from "react-bootstrap"
import Moment from 'react-moment';
import { 
  Button, 
  Nav, 
  Badge,
  Alert
} from "react-bootstrap"

const style = {

  videoWrapper: {
    position: "relative",
    margin: 5,
    flex: "0 0 auto",
  },

  video: {
    width: 150,
    height: 100
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
    display: "flex", flexDirection: "column", justifyContent: "center", alignContent: "center",
    overflow: "auto",
    padding: 5
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

class MainVideo extends Component {
  constructor(props){
    super(props)
    this.video = {}
    this.state = {

    }

    this.handleRef = this.handleRef.bind(this)
    this.renderVideo = this.renderVideo.bind(this)
  }

  componentDidUpdate(prevProps){
    
    if (prevProps.stream != this.props.stream){
      if (this.props.stream){
        this.video.srcObject = this.props.stream.video
      }
    }
  }

  handleRef(video){
    if (video){
      video.srcObject = this.props.stream.video
      this.video = video
    }
  }

  renderVideo(){
    if (this.props.stream){
      return <video ref={this.handleRef} autoPlay style={{ flex: "1 1 auto", alignItems: "stretch"}}/>
      //return <video ref={this.handleRef} autoPlay style={{ wid}}/>
    }
    else {
      return <div>No video</div>
    }
  }

  render(){
    return(
      <div style={{ flex: "1 1 auto", alignItems: "center"}}>
        {this.renderVideo()}
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

  componentDidUpdate(prevProps){
    if (prevProps.stream != this.props.stream){
      this.video.srcObject = this.props.stream
      console.log("[VideoTracking]", "componentDidUpdate", this.props.id, this.props.stream)
      if (!this.props.stream.active){
        console.log("[VideoTracking]", "onInactive", this.props.id, this.props.stream, this.props.stream.getTracks())
      }
    }
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
      videos: {},
      now: new Date(),
      showFeedback: false,
    }
    this.attachPeerVideos = this.attachPeerVideos.bind(this)
    this.renderMapping = this.renderMapping.bind(this)
    this.timer = false
  }

  componentDidMount(){
    if (this.timer){
      clearInterval(this.timer)
    }
    this.timer = setInterval(()=>{
      this.setState({now: new Date()})
    }, 1000)
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

  renderMain(){
    if (!this.props.userMap || !this.props.userDataMap) {
      return <div> 데이터를 불러오는 중입니다. </div>
    }
    
    // 발표자 없으면 교수님 찾기
    let presentationUserId = this.props.presentationUserId
    let professorUserId = false
    console.log("userMap", this.props.userMap)
    Object.entries(this.props.userDataMap).forEach(([key, value])=>{
      if (value.level == 101) professorUserId = key
    })
    if (!professorUserId) { // 아마 발생하지 않을 일.
      return <div> 교수님이 수업에 없습니다. </div>
    }

    // socket id 찾기
    let presentationSocketId = false
    let professorSocketId = false
    Object.entries(this.props.userMap).forEach(([key, value])=>{
      if (value == presentationUserId) presentationSocketId = key
      if (value == professorUserId) professorSocketId = key
    })
    if (!presentationSocketId && !professorSocketId) {
      return <div> 발표자와 교수님이 안계십니다. </div>
    }

    let mainSocketId = presentationSocketId ? presentationSocketId : professorSocketId
    let videoStream = this.state.videos[mainSocketId]
    return (
      <MainVideo stream={videoStream} />
    )
  }

  renderController(){
    var presentationTimer = <></>
    if (this.props.presentationStartedAt){
      let userData = this.props.userDataMap[this.props.presentationUserId]
      let name = userData ? userData.name : "loading..."
      let startDate = Date.parse(this.props.presentationStartedAt)
      let gap = this.state.now.getTime() - startDate
      presentationTimer = (<div style={{ marginRight: 10}}>
                              <div style={{ textAlign: "left" }}>발표자 {name}</div>
                              <div style={{ textAlign: "left" }}>
                                <Moment format="MM.DD hh:mm:ss">{this.props.presentationStartedAt}</Moment>
                                <Badge>{Math.floor(gap/1000)}초 경과</Badge>
                              </div>
                          </div>)
    }

    var btnCheckFeedback = <></>
    if (this.props.presentationStartedAt){
      btnCheckFeedback = (
        <Button variant="primary" size="lg" onClick={()=>{ this.setState({ showFeedback: true}); this.props.onClickCheckFeedback();  }} style={{ marginLeft: 10}}>
          피드백 확인
        </Button>
      )
    }

    return (
      <div style={{ position:"absolute", left: 0, bottom: 0, width: "100%", maxWidth: "100%", height: "auto", background:"rgba(0,0,0,0.5)", padding: 10, display:"flex", flexDirection: "row" }}>
        {presentationTimer}
        <Button variant="primary" size="lg" onClick={this.props.onClickPresentation} style={{ marginLeft: 10}}>
          { this.props.presentationUserId ? "발표종료" : "발표시작" }
        </Button>
        {btnCheckFeedback}
      </div>
    )
  }

  renderFeedbackAlert(){
    let feedbackAlert = <></>
    if (this.state.showFeedback){
      let msg = this.props.userFeedbackData.msg
      if (this.props.userFeedbackData.result){
        msg = this.props.userFeedbackData.body.map(feedback=>{
          return (
            <div>
              <div>{feedback.title}</div>
              <div>
                {
                  Object.entries(feedback.body).map(([pId, pData])=>{
                    console.log("[FeedbackTracking]", "inner", pData)
                    return (
                      <div>
                        {pData.title} : {pData.answer}
                      </div>
                    )
                  })
                }
              </div>
            </div>
          )
        })
      }
      feedbackAlert = (
        <Alert variant={this.props.userFeedbackData.result ? "success" : "danger"} onClose={() => { this.setState({ showFeedback: false })}} dismissible>
          <Alert.Heading>피드백 확인</Alert.Heading>
          {msg}
        </Alert>
      )
    }
    return feedbackAlert
  }

  render(){
    return(
      <div className="OnlineLectureWrapper" style={{ position: "relative", flex: "0 1 auto", display: "flex",  flexDirection: "column", height: "100%"}}>
        
        {/* user cam part */}
        <div style={{ overflowX: "scroll", WebkitOverflowScrolling: "touch" }}>
          <div style={{ display: "flex", flexFlow: "row nowrap",  alignItems: "flex-start", width: 0 }}>
            {
              Object.entries(this.state.videos).map(this.renderMapping)
            }
          </div>
        </div>

        {/* main cam part */}
        <div style={{ flex: "1 1 auto", display: "flex",  flexDirection: "column", justifyContent: "center", alignContent: "center"}}>
          {this.renderMain()}
        </div>

        {/* controller part */}
        {this.renderController()}

        {/* alert view part */}
        {this.renderFeedbackAlert()}
        
      </div>
    )
  }
}

export { ErrorPage, LecturePage }