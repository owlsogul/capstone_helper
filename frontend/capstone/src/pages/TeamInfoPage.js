import React, { Component } from 'react';
import TeamTemplate from "../components/TeamTemplate"
// import './App.css';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default class TeamInfoPage extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      classId: this.props.match.params.classId,
      teamId: this.props.match.params.teamId
    }
  }

  render() {
    return (
      <TeamTemplate match={this.props.match} history={this.props.history}>
        <div>
          
        </div>
      </TeamTemplate>
    );
  }
  
}


