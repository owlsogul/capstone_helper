import React, { Component } from 'react';
import Dashboard from "../components/Dashboard.component"
import Bar from "../components/Bar.component"

const style = {
  classListBody: {
    display: "flex",
    flexFlow: "row wrap",
  }
}

const loadClass = ()=>{
  return fetch("/api/class/list")
}

const createClassType = (classType)=>{
  if (classType == "take") return "수강 중"
  else if (classType == "wait") return "수강 대기중"
  else if (classType == "manage") return "수업 관리중"
  else if (classType == "own") return "강의 중"
  else return "알수 없음"
}

class ClassElement extends Component {
  constructor(props){
    super(props)
  }

  render(){
    return(
      <div className="card" style={{ width: "18rem", margin: 10 }}>
        <div class="card-body">
          <h5 class="card-title">{this.props.className}</h5>
          <p class="card-text">{this.props.className} </p>
          <p className="card-text">
            {createClassType(this.props.classType)}
          </p>
          <a href="#" class="btn btn-primary">교실 들어가기</a>
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
      <div style={style.classListBody} >
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
        if (res.take){
          newClasses = newClasses.concat(res.take.map(e=>{ return { 
            classId: e.classId, 
            className: e.Class.className, 
            classType: e.takeStatus == 1 ? "take" : "wait" } }));
        }
        if (res.manage){
          newClasses = newClasses.concat(res.manage.map(e=>{ return { 
            classId: e.classId, 
            className: e.Class.className, 
            classType: "manage" } }));
        }
        if (res.own){
          newClasses = newClasses.concat(res.own.map(e=>{ return { 
            classId: e.classId, 
            className: e.className, 
            classType: "own" } }));
        }
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