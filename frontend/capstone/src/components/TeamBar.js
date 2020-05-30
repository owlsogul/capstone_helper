import React, { Component } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Badge } from "react-bootstrap"
import network from "../network"

export default class TeamBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamName: "",
      urlTeamInfo: "",
      urlDoFeedback: "",
      urlFeedback: ""
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
        urlTeamInfo: `/${classId}/teams/${teamId}/info`,
        urlDoFeedback: `/${classId}/teams/${teamId}/info`,
        urlFeedback: `/${classId}/teams/${teamId}/info`,
      })
    })
    .catch(err=>{
      if (err.status == 400){
        window.location = "/dashboard"
      }
    })
  }

  render(){
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>{this.state.teamName}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href={this.state.urlTeamInfo}>조 정보</Nav.Link>
            <Nav.Link href={this.state.urlDoFeedback}>평가</Nav.Link>
            <Nav.Link href={this.state.urlFeedback}>피드백 확인</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}