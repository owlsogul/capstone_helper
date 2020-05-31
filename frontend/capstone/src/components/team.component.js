import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

const style = {
  teamListBody: {
    display: "flex",
    flexFlow: "row wrap",
  }
}

const checkIfCreatingTiming = (classId) => {
  return fetch('/api/team/set_matching', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ classId: classId }),
  })
    .then(res => {
      if (res.status != 200) throw res.status
      return res.json()
    })
}

export class TeamNameMembers extends Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    teamName: "조 없음",
    teamMembers: "팀원 없음",
  }

  render() {
    return (
      <div>
        <div className='classinfo-box'>
          <div><b>{this.props.teamName}</b></div>
        </div>

        <div className='classinfo-box'>
          <div><b>{this.props.teamMembers}</b></div>
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
    if (this.props.isCreatingTiming){ 
      btnCreateClass = (
        <EnterTeamButton/>
      )
    }

    return(
      <div style={style.teamListBody} >
        {
          this.props.teams.map(e=>{
            return (
              <TeamElement
                teamName={e.teamName}
                teamMembers = {e.Joins.map(element => {
                  return `${element.User.name}(${element.user})`
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

// 가입 신청, 가입 취소, 가입 대기중
class EnterTeamButton extends Component {
  constructor(props){
    super(props)
  }

  render(){
    return(
      <div className="card" style={{ width: "18rem", margin: 10 }}>
        <div className="card-body" style={{ display: "flex", alignItems: "center",  justifyContent: "center"}}>
          <div className="btn btn-secondary">
            <Link to="/" style={{ color: "#ffffff"}}>가입 신청</Link>
          </div>
        </div>
      </div>
    )
  }
}

class TeamElement extends Component {
  constructor(props){
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick(){
    this.props.handleEnter(this.props.classId, this.props.classType)
  }

  render(){
    return(
      <div className="card" style={{ width: "18rem", margin: 10 }}>
        <div className="card-body">
          <h5 className="card-title">{this.props.teamName}</h5>
          <p className="card-text">{this.props.teamMembers.join(", ")} </p>
          <a href="#" className="btn btn-primary" onClick={this.onClick}>가입 신청</a>
        </div>
      </div>
    )
  }
}