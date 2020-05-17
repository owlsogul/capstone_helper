import React, { Component } from 'react';
import TeamTemplate from "../components/TeamTemplate"
import network from "../network"

import { InputGroup, FormControl, Button } from "react-bootstrap"

export default class TeamInfoPage extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      teamName: "",
      joins: [],
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
      console.log(team)
      this.setState({
        teamName: team.teamName,
        joins: team.Joins,
        githubUrl: team.githubUrl
      })
    })
  }

  render() {
    return (
      <TeamTemplate match={this.props.match} history={this.props.history}>
        <div>
          <h1>{this.state.teamName}</h1>
          <h5>팀원 : {this.state.joins.reduce((p, c)=>p+`${c.User.name}(${c.user}) `, "")}</h5>

          <InputGroup className="mb-3">
            <FormControl
              placeholder="Recipient's username"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              value={this.state.githubUrl}
            />
            <InputGroup.Append>
              <Button variant="outline-primary">Save</Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
      </TeamTemplate>
    );
  }
  
}


