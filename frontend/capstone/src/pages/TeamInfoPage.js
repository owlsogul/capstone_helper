import React, { Component } from 'react';
import TeamTemplate from "../components/TeamTemplate"
import network from "../network"

export default class TeamInfoPage extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      teamName: "",
      joins: []
    }
  }

  componentDidMount(){
    let classId = this.props.match.params.classId
    let teamId = this.props.match.params.teamId
    if (!classId || !teamId){
      window.location = "/dashboard"
    }
    network.network("/api/team/get_team", {
      body: { classId: classId, teamId: teamId }
    })
    .then(team=>{
      this.setState({
        teamName: team.teamName,
        joins: team.Joins
      })
    })
  }

  render() {
    return (
      <TeamTemplate match={this.props.match} history={this.props.history}>
        <div>
          <h1>{this.state.teamName}</h1>
          <h5>{this.state.joins.reduce((p, c)=>p+c.user+" ", "")}</h5>
        </div>
      </TeamTemplate>
    );
  }
  
}


