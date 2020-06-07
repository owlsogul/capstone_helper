import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

const style = {
  teamListBody: {
    display: "flex",
    flexFlow: "row wrap",
  }
}

export class TeamNameMembers extends Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    teamName: "조 없음", // 우리 팀 이름
    teamMembers: "팀원 없음", // 우리 팀 조원들
  }

  render() {
    return (
      <div>
        <div className='classinfo-box'>
          <div><b>{this.props.teamName}</b></div>
        </div>
        <div className='classinfo-box'>
          {/* {this.props.teamMembers.foreach(e=>(
            <div>{e}</div>
          ))} */}
          {/* TODO: 여기 안돌아감 
            .join(", ")
          */}
          <li> {this.props.teamMembers}</li>
        </div>
      </div>
    )
  }
}

export class Teams extends Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate(prevProps) {
  }

  render() {
    let btnCreateClass = (<></>)
    if (this.props.isCreatingTiming) {
      btnCreateClass = (
        <CreateTeam />
      )
    }

    return (
      <div style={style.teamListBody} >
        {
          this.props.teams.map(e => {
            return (
              <TeamElement
                teamName={e.teamName}
                teamMembers={e.Joins.map(element => {
                  return `${element.User.name}(${element.user})`
                })}
                teamStatus={e.Joins.map(element => {
                  if (element.User.userId == this.props.myID) {
                    console.log("같다!!")
                    console.log(element.joinStatus)
                    return element.joinStatus
                  } else { return -1 }
                })}
              />
            )
          })
        }
        {btnCreateClass}
      </div>
    )
  }
}

// 가입 신청
class EnterTeamButton extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="btn btn-secondary">
        <Link to="/" style={{ color: "#ffffff" }}>가입 신청</Link>
      </div>
    )
  }
}

// 가입 취소
class CancelTeamButton extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="btn btn-secondary">
        <Link to="/" style={{ color: "#ffffff" }}>가입 취소</Link>
      </div>
    )
  }
}

// 가입 대기중
class WaitTeamButton extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="btn btn-secondary">
        <Link to="/" style={{ color: "#fffff" }}>가입 대기중</Link>
      </div>
    )
  }
}

// 팀 하나하나 카드들
class TeamElement extends Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick() {
    this.props.handleEnter(this.props.classId, this.props.classType)
  }

  render() {
    var myButton = null
    console.log("여여여ㅕ여기기ㅣ기기")
    console.log(this.props.teamStatus)
    for (var i = 0; i < this.props.teamStatus.length; i++) {
      if (this.props.teamStatus[i] == 0) {
        myButton = <WaitTeamButton></WaitTeamButton>
        break
      } else if (this.props.teamStatus[i] == 1) {
        myButton = <CancelTeamButton></CancelTeamButton>
        break
      } else {
        myButton = <EnterTeamButton></EnterTeamButton>
      }
    }

    return (
      <div className="card" style={{ width: "18rem", margin: 10 }}>
        <div className="card-body">
          <h5 className="card-title">{this.props.teamName}</h5>
          <p className="card-text">{this.props.teamMembers.join(", ")} </p>
          {myButton}
        </div>
      </div>
    )
  }
}

// 팀 생성 기간이라면 팀 만들기 카드도 보여진다
class CreateTeam extends Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick() {
    this.props.handleEnter(this.props.classId, this.props.classType)
  }

  render() {
    return (
      <div className="card" style={{ width: "18rem", margin: 10 }}>
        <div className="card-body">
          {/* <h5 className="card-title">{this.props.teamName}</h5> */}
          {/* <p className="card-text">{this.props.teamMembers.join(", ")} </p> */}
          <a href="#" className="btn btn-primary" onClick={this.onClick}>새로운 팀 만들기</a>
        </div>
      </div>
    )
  }
}