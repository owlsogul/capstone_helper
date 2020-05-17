import React, { Component } from 'react';
import Dashboard from "../components/Dashboard.component";
import Bar from './Bar.component';

/**
 * required props:
 *  - history
 *  - match
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
        <div style={{ padding: 10 }}>
          {this.props.children}
        </div>
      </Dashboard>
    );
  }
}