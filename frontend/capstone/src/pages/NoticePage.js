import React, { Component } from 'react';
import ComplexList from '../components/notice.component';
import ClassTemplate from "../components/ClassTemplate"
import network from '../network'
import { Navbar, Nav, Badge } from "react-bootstrap"
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
// import './App.css';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

// 공지를 받아오는 함수
function notice(sendObj) {
  return fetch('/api/class/list_notice', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ classId: sendObj.classId }),
  })
}

// 권한 확인용
const getPermisson = (classId) => {
  return network.network("/api/class/get_permission", { body: { classId: classId } })
}

export default class NoticePage extends Component {
  constructor(props) {
    super(props);
    this.state = { classId: this.props.match.params.classId, notice: [] }
    this.getNotice = this.getNotice.bind(this);
  }

  getAuth() {
    getPermisson(this.state.classId)
      .then(res => {
        this.setState({ permission: res["relationType"] })
      })
  }

  getNotice() {
    notice({ classId: this.state.classId })
      .then((res) => res.json())
      .then((json) => {
        console.log(json)
        this.setState({
          notice: json.reverse()
        })
      })
  }

  render() {
    var writeNotice = null
    if (this.state.permission > 1) {
      // 조교, 교수
      writeNotice =
        <button className="btn btn-primary btn-block" onClick={(e) => {
          e.preventDefault()
          window.location = `/${this.state.classId}/writeNotice`
        }}>공지사항 작성하기</button>
    }
    console.log("id는" + this.props.match.params.classId)
    console.log(this.props.match)
    return (
      <ClassTemplate match={this.props.match}>
        {writeNotice}
        <ComplexList list={this.state.notice} />
      </ClassTemplate>
    );
  }

  componentWillMount() {
    this.getAuth()
    this.getNotice()
  }
}