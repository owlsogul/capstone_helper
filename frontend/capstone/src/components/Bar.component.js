import React, { Component } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Badge } from "react-bootstrap"
import Moment from 'react-moment';
import 'moment-timezone';
import network from "../network"

const getClassInfo = (classId) => {
  return fetch("/api/class/info/" + classId)
    .then(res => {
      if (res.status != 200) throw new Error(res)
      return res.json()
    })
}

const getPermisson = (classId) => {
  return network.network("/api/class/get_permission", { body: { classId: classId } })
}

const getLectureInfo = (classId) => {
  return network.network("/api/lecture/get_current_lecture", { body: { classId: classId } })
}

export default class Bar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      className: "",
      permission: -1,
      urlNotice: "#",
      urlStudentInfo: "#",
      urlTeamInfo: "#",
      urlClassInfo: "#",
      urlManageLinks: "#",
    }
  }

  componentDidMount() {
    let classId = this.props.match.params.classId
    console.log(classId)
    getClassInfo(classId)
      .then(res => {
        this.setState({
          className: res.className,
          urlNotice: `/${res.classId}/notice`,
          urlStudentInfo: `/${res.classId}/students`,
          urlTeamInfo: `/${res.classId}/teams`,
          urlAdminTeamInfo: `/${res.classId}/admin_teams`,
          urlClassInfo: `/${res.classId}/classinfo`,
          urlManageLinks: `/${res.classId}/manageLink`,
          urlFixForm: `/${res.classId}/form`,
          lectureStatus: false
        })
      })
      .catch(err => {
        console.log(err)
      })


    getLectureInfo(classId)
      .then(res => {
        console.log(res)
        this.setState({ lectureStatus: res })
      })
      .catch(err => {
        if (err.status) {
          if (err.status == 409) this.setState({ lectureStatus: false })
        }
        else {
          console.log(err)
        }
      })

    getPermisson(classId)
      .then(res => {
        console.log("getPermission")
        console.log(res)
        this.setState({ permission: res["relationType"] })
      })

  }

  render() {
    var myTeamInfo = null
    var fixForm = null
    let lectureBadge = <Badge variant="secondary">OFF</Badge>
    if (this.state.lectureStatus) {
      lectureBadge = <Badge variant="primary" onClick={() => { window.location = `/${this.state.lectureStatus.classId}/lecture` }}>ON <Moment fromNow>{this.state.lectureStatus.startedAt}</Moment></Badge>
    }
    if (this.state.permission == 1) {
      // 학생
      myTeamInfo = <Nav.Link href={this.state.urlTeamInfo}>조 정보</Nav.Link>
    } else if (this.state.permission > 1) {
      // 조교, 교수
      myTeamInfo = <Nav.Link href={this.state.urlAdminTeamInfo}>조 정보</Nav.Link>
      fixForm = <Nav.Link href={this.state.urlFixForm}>폼 수정하기</Nav.Link>
    }

    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>{this.state.className}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Navbar.Text>수업 {lectureBadge}</Navbar.Text>
            <Nav.Link href={this.state.urlNotice}>공지사항</Nav.Link>
            <Nav.Link href={this.state.urlStudentInfo}>학생 정보</Nav.Link>
            {myTeamInfo}
            {fixForm}
            <Nav.Link href={this.state.urlManageLinks}>초대링크 관리</Nav.Link>
            <Nav.Link href={this.state.urlClassInfo}>수업 정보</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}