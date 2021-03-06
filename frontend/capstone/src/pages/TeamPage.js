import React, { Component } from 'react';
import ClassTemplate from "../components/ClassTemplate"
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { TeamNameMembers, Teams } from '../components/team.component';
import network from "../network"

const getTeamList = (classId) => {
  return network.network('/api/team/list', { body: classId })
}

const getMyTeam = (classId) => {
  return network.network('/api/team/get_myteam', { body: classId })
}

const checkIfCreatingTiming = (classId) => {
  return network.network('/api/team/set_matching', { body: { classId: classId, matchingInfo: true }})
}

const getMyID = () => {
  return network.network('/api/user/user_info', { method: "GET" })
}

export default class TeamPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamName: "조 없음",
      teamId: -1,
      teamMembers: "팀원 없음",
      classId: this.props.match.params.classId,
      teams: [],
      isCreatingTiming: false,
    }
  }

  setData() {
    getMyID()
      .then((res)=>{
        console.log(res)
        this.setState({myID: res.userId})
      })

    getTeamList({ classId: this.state.classId })
      .then((res) => {
        console.log(res["teams"])
        this.setState({ teams: res["teams"] })
      })
      .catch(console.log)

    getMyTeam({ classId: this.state.classId })
      .then((res) => {
        console.log("getMyTeam")
        console.log(res)
        if (res != '{ }') {
          this.setState({ teamName: res["teamName"], teamId: res["teamId"] })
          var list = []
          if (res["Joins"] != undefined) {
            res["Joins"].map(e => {
              list = list.concat(e["user"])
            })
            console.log("리스트는")
            console.log(list)
            this.setState({ teamMembers: list })
          }
        }
      })
    
    checkIfCreatingTiming({ classId: this.state.classId} )
      .then((res)=>{
        console.log("checkIfCreating")
        console.log(res)
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
        <button className="btn btn-primary btn-block" onClick={() => { window.location=`/${this.state.classId}/teams/${this.state.teamId}/info`}}>나의 조 페이지 이동</button>
        <Teams teams={this.state.teams} isCreatingTiming={this.state.isCreatingTiming} myID={this.state.myID} />
      </ClassTemplate>
    );
  }
}
