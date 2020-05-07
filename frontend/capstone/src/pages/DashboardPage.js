import React, { Component } from 'react';
import Dashboard from "../components/Dashboard.component"

const loadClass = ()=>{
  return fetch("/api/class/list")
}

class ClassElement extends Component {
  constructor(props){
    super(props)
  }

  render(){
    return(
      <div className="card" style={{ width: "18rem"}}>
        <img src="..." class="card-img-top" alt="..."/>
        <div class="card-body">
          <h5 class="card-title">{this.props.className}</h5>
          <p class="card-text">{this.props.className} {this.props.classType}</p>
          <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
        
        
      </div>
    )
  }

}

class ClassList extends Component{
  constructor(props){
    super(props)
    this.state = { classes: [] }
  }

  componentDidUpdate(prevProps){
    if (prevProps.classes != this.props.classes){
      this.setState({ classes: this.props.classes })
    }
  }

  render(){
    return(
      <div>
        {
          this.state.classes.map(e=>{
            return (
              <ClassElement
                classId={e.classId}
                className={e.className}
                classType={e.classType}
              />
            )
          })
        }
      </div>
    )
  }
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
        console.log(res)
        let newClasses = []
        newClasses = newClasses.concat(res.take.map(e=>{ return { 
          classId: e.classId, 
          className: e.Class.className, 
          classType: e.takeStatus == 1 ? "take" : "wait" } }));
        newClasses = newClasses.concat(res.manage.map(e=>{ return { 
            classId: e.classId, 
            className: e.Class.className, 
            classType: "manage" } }));
        newClasses = newClasses.concat(res.own.map(e=>{ return { 
          classId: e.classId, 
          className: e.Class.className, 
          classType: "own" } }));
        this.setState({ classes: newClasses })
      })
  }

  render() {
    return (
      <Dashboard initState={[false, true, false]} history={this.props.history}>
        <ClassList classes={this.state.classes} />
      </Dashboard>
    );
  }

}