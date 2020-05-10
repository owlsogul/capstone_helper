import React, { Component } from 'react';
import ComplexList from '../components/notice.component';
import ClassTemplate from "../components/ClassTemplate"
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

export default class NoticePage extends Component {
  constructor(props) {
    super(props);
    this.state = { classId: this.props.match.params.classId, notice: [] }
    this.getNotice = this.getNotice.bind(this);
  }

  getNotice() {
    notice({ classId: this.state.classId })
      .then((res) => res.json())
      .then((json) => {
        console.log(json)
        this.setState({
          notice: json
        })
      })
  }

  render() {
    console.log("id는" + this.props.match.params.classId)
    console.log(this.props.match)
    return (
      <ClassTemplate match={this.props.match}>
        <ComplexList list={this.state.notice} />
      </ClassTemplate>
    );
  }

  componentWillMount() {
    this.getNotice()
  }
}