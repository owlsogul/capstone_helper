import React, { Component } from 'react';
import ClassTemplate from "../components/ClassTemplate"
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { TeamNameMembers, Teams } from '../components/team.component';
import network from "../network"

export default class AdminTeamPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "어드민 팀 페이지 입니다. ",
      classId: this.props.match.params.classId,
    }
  }

  componentWillMount() {
  }

  render() {
    return (
      <ClassTemplate match={this.props.match}>
        <h1>어드민 팀 페이지 입니다.</h1>
      </ClassTemplate>
    );
  }
}
