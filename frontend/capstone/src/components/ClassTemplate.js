import React, { Component } from 'react';
import Dashboard from "../components/Dashboard.component";
import Bar from '../components/Bar.component';

/**
 * required props:
 *  - history
 *  - classId
 */
export default class ClassTemplate extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Dashboard initState={[false, true, false]} history={this.props.history}>
        <div>
          <Bar match={this.props.match}/>
        </div>
        <div>
          {this.props.children}
        </div>
      </Dashboard>
    );
  }
}