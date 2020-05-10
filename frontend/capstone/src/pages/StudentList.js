import React, { Component } from 'react';
import Students from "../components/Students.component"
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default class StudentList extends Component {
  constructor(props) {
    super(props);
    this.state = { classId: 1, studentList: [] }
  }

  getStudentList(sendObj) {
    console.log(sendObj)
    fetch('/api/class/member', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(sendObj),
    })
      .then(res => {
        if (res.status != 200) throw res.status
        return res.json()
      })
      .then((json) => {
        console.log(json)
        this.setState({
          takes: json["takes"],
          manages: json["manages"],
          targetClass: json["targetClass"]
        })
      })
      .catch((err) => {
        console.log("에러 발생")
        console.log(err)
        if (err.status == 400) {
          alert("권한 문제가 발생하였습니다!")
        } else if (err.status == 500) {
          alert("서버 내부 오류가 발생하였습니다.")
        } else if (err.status == 403) {
          alert("로그인이 필요합니다.")
        } else {
          console.log(err.status)
          alert("알지 못할 오류가 발생하였습니다.")
        }
      })
  }

  render() {
    return (
      <div className="full-page">
        <div className="auth-wrapper">
          <h1>student list 페이지</h1>
          <Students takes={this.state.takes} manages={this.state.manages} targetClass={this.state.targetClass} />
          <a class="btn btn-primary btn-lg" href="#" role="button">미승인</a>
          <a class="btn btn-primary btn-lg" href="#" role="button">승인</a>
          <a class="btn btn-primary btn-lg" href="#" role="button">전체 승인</a>
        </div>
      </div>
    );
  }

  componentWillMount() {
    this.getStudentList({ classId: 1 })
  }
}