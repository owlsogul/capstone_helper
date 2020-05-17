import React, { Component } from 'react';
import ClassTemplate from "../components/ClassTemplate";
import TeamBar from './TeamBar';

/**
 * required props:
 *  - history
 *  - classId
 */
export default class TeamTemplate extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ClassTemplate match={this.props.match} history={this.props.history}>
        <div>
          <TeamBar match={this.props.match}/>
        </div>
        <div style={{ padding: 10 }}>
          {this.props.children}
        </div>
      </ClassTemplate>
    );
  }
}