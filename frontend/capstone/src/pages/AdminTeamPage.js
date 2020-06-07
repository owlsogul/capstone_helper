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

export default class AdminTeamPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamName: "조 없음",
      teamMembers: "팀원 없음",
      classId: this.props.match.params.classId,
      teams: [],
      isCreatingTiming: false,
    }
  }

  setData() {
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
          this.setState({ teamName: res["teamId"] })
          var list = []
          if (res["Joins"] != undefined) {
            res["Joins"].map(e => {
              list.concat(e["user"])
            })
            this.setState({ teamMembers: list })
          }
        }
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
        <button className="btn btn-primary btn-block" onClick={AdminTeamPage}>조 페이지 이동</button>
        <Teams teams={this.state.teams} isCreatingTiming={this.state.isCreatingTiming} />
      </ClassTemplate>
    );
  }
}
