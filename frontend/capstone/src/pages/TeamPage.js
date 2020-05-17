import React, { Component } from 'react';

import ClassTemplate from "../components/ClassTemplate"
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { TeamNameMembers, Teams } from '../components/team.component';

const getTeamList = (classId) => {
  return fetch('/api/team/list', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(classId),
  })
    .then(res => {
      if (res.status != 200) throw res.status
      return res.json()
    })
}

// 가입 신청, 가입 취소, 가입 대기중
const createClassType = (classType)=>{
  if (classType == "take") return "가입 산청"
  else if (classType == "wait") return "가입 취소"
  else if (classType == "manage") return "가입 대기중"
  else return "알수 없음"
}

export default class TeamPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamName: "조 없음",
      teamMembers: "팀원 없음",
      classId: this.props.match.params.classId,
      teams:[],
      isCreatingTiming: false,
    }
  }

  setData() {
    getTeamList({ classId: this.state.classId })
      .then((res)=> {
        console.log(res["teams"])
        this.setState({teams: res["teams"]})
      })
  }

  componentWillMount() {
    this.setData()
  }

  render() {
    return (
      <ClassTemplate match={this.props.match}>
        <TeamNameMembers teamName={this.state.teamName} teamMembers={this.state.teamMembers} />
        <button className="btn btn-primary btn-block">초대하기</button>
        <button className="btn btn-primary btn-block">조 페이지 이동</button>
        <Teams teams={this.state.teams} isCreatingTiming={this.state.isCreatingTiming}/>
      </ClassTemplate>
    );
  }
}
