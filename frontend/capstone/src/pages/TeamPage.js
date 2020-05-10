import React, { Component } from 'react';

import ClassTemplate from "../components/ClassTemplate"
import People from "../components/People.component"
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {Table} from "react-bootstrap"

export default class TeamPage extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
  }


  render() {
    return (
      <ClassTemplate match={this.props.match}>
          <h1>팀 페이지</h1>
      </ClassTemplate>
    );
  }
}