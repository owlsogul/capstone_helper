import React, { Component } from 'react';
import Dashboard from "../components/Dashboard.component"

const loadClass = ()=>{
  return fetch("/api/class/list")
}


export default class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = { classes: [] }
  }

  componentDidMount(){
    console.log("mount")
    loadClass().then(res=>res.json())
      .then(res=>{
        let newClasses = []
        newClasses = newClasses.concat(res.take.map(e=>{ return { classId: e.classId, className: "" } }))
        console.log(newClasses)
      })
  }

  render() {
    return (
      <Dashboard initState={[false, true, false]} history={this.props.history}>
        
      </Dashboard>
    );
  }

}