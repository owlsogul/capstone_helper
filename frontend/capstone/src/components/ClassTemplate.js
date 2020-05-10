import React, { Component } from 'react';
import Dashboard from "../components/Dashboard.component";
import Bar from '../components/Bar.component';

export default class ClassTemplate extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Dashboard initState={[false, true, false]} history={this.props.history}>
        <Bar></Bar>
          <container>
            <ClassList classes={this.state.classes} />
          </container>
      </Dashboard>
    );
  }
}