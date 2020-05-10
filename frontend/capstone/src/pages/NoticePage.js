import React, { Component } from 'react';
import ComplexList from '../components/notice.component';
// import './App.css';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

// 공지를 받아오는 함수
function notice(sendObj) {
  return fetch('/api/class/notice', {
    method: 'GET',
    credentials: 'include'
  })
}

export default class NoticePage extends Component {
  constructor(props) {
    super(props);
    this.state = { classId: "", notice: [] }
  }

  getNotice() {
    notice({classId: this.state.classId})
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
    return (
      <div className="full-page">
        <div className="auth-wrapper">
          <ComplexList list={this.state.notice} />
        </div>
      </div>
    );
  }

  componentWillMount() {
    this.getNotice()
  }
}