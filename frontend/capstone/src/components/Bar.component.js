import React, { Component } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Badge } from "react-bootstrap"

const getClassInfo = (classId) => {
  return fetch("/api/class/info/"+classId)
  .then(res=>{
      if (res.status != 200) throw new Error(res)
      return res.json()
  })
}

export default class Bar extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      className: "",
      urlNotice: "#",
      urlStudentInfo: "#",
      urlTeamInfo: "#",
      urlClassInfo: "#",
    }
  }

  componentDidMount(){
    let classId = this.props.match.params.classId
    console.log(classId)
    getClassInfo(classId)
      .then(res=>{
        this.setState({
          className: res.className,
          urlNotice: `/${res.classId}/notice`,
          urlStudentInfo: `/${res.classId}/students`,
          urlTeamInfo: `/${res.classId}/teams`,
          urlClassInfo: `/${res.classId}/classinfo`,

        })
      })
      .catch(err=>{
        console.log(err)
      })
  }

  render(){
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>{this.state.className}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Navbar.Text>수업 <Badge variant="secondary">OFF</Badge></Navbar.Text>
            <Nav.Link href={this.state.urlNotice}>공지사항</Nav.Link>
            <Nav.Link href={this.state.urlStudentInfo}>학생 정보</Nav.Link>
            <Nav.Link href={this.state.urlTeamInfo}>조 정보</Nav.Link>
            <Nav.Link href={this.state.urlClassInfo}>수업 정보</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}