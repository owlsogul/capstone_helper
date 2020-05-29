import React, { Component } from 'react';
import ClassTemplate from "../components/ClassTemplate";
import { StudentLinkList, AssistLinkList } from "../components/link.component";
import InviteStudentForm from "../components/openclass.component";
import network from "../network"
// import './App.css';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

// 링크 데이터를 받아오는 함수
function getLinks(sendObj) {
  return network.network('/api/class/get_invite_codes', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ classId: sendObj.classId }),
  })
}

export default class ManageLinkPage extends Component {
  constructor(props) {
    super(props);
    this.state = { classId: this.props.match.params.classId,
                   generatedStudentLinks: [],
                   generatedAssistLinks: [] }
  }

  setData() {
    getLinks({ classId: this.state.classId })
      .then((json) => {
        json.filter(obj => {
          if (obj["isAssist"] == true){
            this.setState({
              generatedAssistLinks: this.state.generatedAssistLinks.concat(obj)
            })
          } else {
            this.setState({
              generatedStudentLinks: this.state.generatedStudentLinks.concat(obj)
            })
          }
        })
      })
      .then(()=>{
        console.log(this.state.generatedAssistLinks)
        console.log(this.state.generatedStudentLinks)
      })
      .catch(err=>{
          console.log(err)
      })
  }

  render() {
    return (
      <ClassTemplate match={this.props.match}>
        <h1>생성된 코드들</h1>
        <h3>학생용</h3>
        <StudentLinkList list={this.state.generatedStudentLinks} />
        <h3>조교용</h3>
        <AssistLinkList list={this.state.generatedAssistLinks} />
        <h3>코드 생성하기</h3>
        <LinksForm classId={this.state.classId} />
      </ClassTemplate>
    );
  }

  componentWillMount() {
    this.setData()
  }
}


export class LinksForm extends Component {
  constructor(props) {
      super(props);
      this.state = { assistantExpireTime: "", codeForAssist: "", codeForStudent:"", studentExpireTime: "", isAutoJoin: false, classId: -1 }
  }

  componentDidUpdate(prevProps, prevState) { 
  }

  handleAssistantExpireTimeChange = (e) => {
      this.setState({ assistantExpireTime: e.target.value })
  }

  handleStudentExpireTimeChange = (e) => {
      this.setState({ studentExpireTime: e.target.value })
  }

  handleIsAutoJoinChangeToFalse = (e) => {
      this.setState({ isAutoJoin: false })
  }

  handleIsAutoJoinChangeToTrue = (e) => {
      this.setState({ isAutoJoin: true })
  }
  

  // 조교를 위한 초대링크 생성 API
  createAssistInviteCode() {
      fetch('/api/class/create_assist_invite_code', {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ classId: this.props.classId, expiredDate: this.state.assistantExpireTime }),
      })
          .then(res => {
              if (res.status != 200) throw res.status
              return res.json()
          })
          .then(json => {
              this.setState({ codeForAssist: json["code"] })
          })
          .catch((err) => {
              console.log("에러 발생")
              if (err == 400) {
                  alert("권한이 부족합니다")
              } else if (err == 500) {
                  alert("서버 내부 오류가 발생하였습니다.")
              } else if (err == 403) {
                  alert("권한이 없습니다.")
              } else {
                  console.log(err.status)
                  alert("알지 못할 오류가 발생하였습니다.")
              }
          })
  }

  // 학생을 위한 초대링크 생성 API
  createAssistStudentCode() {
      fetch('/api/class/create_student_invite_code', {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ classId: this.props.classId, expiredDate: this.state.studentExpireTime, isAutoJoin: this.state.isAutoJoin }),
      })
          .then(res => {
              if (res.status != 200) throw res.status
              return res.json()
          })
          .then(json => {
              this.setState({ codeForStudent: json["code"] })
          })
          .catch((err) => {
              console.log("에러 발생")
              if (err.status == 400) {
                  alert("잘못된 파라메터가 있습니다!")
              } else if (err.status == 500) {
                  alert("서버 내부 오류가 발생하였습니다.")
              } else if (err.status == 403) {
                  alert("권한이 없습니다.")
              } else {
                  console.log(err.status)
                  alert("알지 못할 오류가 발생하였습니다.")
              }
          })
  }

  render() {
      return (
          <form>
              <h3>조교 초대링크 만들기</h3>
              <div className="input-group mb-3">
                  <input
                      type="text"
                      className="form-control"
                      placeholder="만료 날짜를 입력하세요"
                      aria-label="만료 날짜를 입력하세요"
                      aria-describedby="button-addon2"
                      value={this.state.assistantExpireTime}
                      onChange={this.handleAssistantExpireTimeChange}
                  />
                  <div className="input-group-append">
                      <button onClick={(e) => {
                          this.createAssistInviteCode()
                      }}
                          className="btn btn-outline-secondary"
                          type="button"
                          id="button-addon2"
                      >
                          링크 생성
                      </button>
                  </div>
              </div>

              <div className="form-group">
                  <input type="classTime" className="form-control" placeholder="생성된 링크" value={this.state.codeForAssist} onChange={this.handleClassTimeChange} />
              </div>


              <h3>학생 초대링크 만들기</h3>

              <div className="form-group">

                  <div className="input-group mb-3">
                      <div className="input-group-prepend">
                          <div className="input-group-text">
                              <input type="radio" name="isEntrable" aria-label="Checkbox for following text input" onChange={this.handleIsAutoJoinChangeToTrue} />
                          </div>
                      </div>
                      <span className="form-control">바로 입장</span>
                  </div>
                  <div className="input-group mb-3">
                      <div className="input-group-prepend">
                          <div className="input-group-text">
                              <input type="radio" name="isEntrable" aria-label="Checkbox for following text input" onChange={this.handleIsAutoJoinChangeToFalse} />
                          </div>
                      </div>
                      <span className="form-control">입장 허가 필요</span>
                  </div>

                  <div className="input-group mb-3">
                      <input
                          type="text"
                          className="form-control"
                          placeholder="만료 날짜를 입력하세요"
                          aria-label="만료 날짜를 입력하세요"
                          aria-describedby="button-addon2"
                          value={this.state.studentExpireTime}
                          onChange={this.handleStudentExpireTimeChange}
                      />
                      <div className="input-group-append">
                          <button onClick={(e) => {
                              this.createAssistStudentCode()
                          }}
                              className="btn btn-outline-secondary"
                              type="button"
                              id="button-addon2"
                          >
                              링크 생성
                          </button>
                      </div>
                  </div>

                  <div className="form-group">
                      <input type="classTime" className="form-control" placeholder="생성된 링크" value={this.state.codeForStudent} onChange={this.handleClassTimeChange} />
                  </div>

              </div>

              <button className="btn btn-primary btn-block" onClick={(e) => {
                  e.preventDefault()
                  window.location = `/dashboard`
              }}>메인으로 이동</button>
          </form>
      )
  }
}