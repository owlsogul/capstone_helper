import React, { Component } from 'react';

import ClassTemplate from "../components/ClassTemplate"
import People from "../components/People.component"
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {Table} from "react-bootstrap"

const filterStudent = (e, filter, id)=>{ 
  return  (filter == "ALL") || // ALL 필터면 다 통과
          (filter == "WAIT" && e.relationType == 0) || // 대기자 필터면 대기자만 통과
          (filter == "TAKE" && e.relationType == 1) // 수강자 필터면 수강자 통과
          (filter == "NAME" && e.user.includes(id)) // 이름 필터
}

const getStudentList = (classId)=>{
  return fetch('/api/class/member', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ classId: classId }),
  })
    .then(res => {
      if (res.status != 200) throw res.status
      return res.json()
    })
}

export default class StudentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 원본 배열들. 건들지 말 것!
      oTakes: [],
      oClass: {},

      // display될 배열들
      dTakes: [],
      dClass: {},

      // filter 값 설정. ALL, WAIT, TAKE
      filter: "ALL"
    }
    this.handleStudentOper = this.handleStudentOper.bind(this)
    this.refreshTakes = this.refreshTakes.bind(this)
  }

  refreshTakes(){
    getStudentList(this.props.match.params.classId)
      .then((json) => {
        console.log(json)
        this.setState({
          oTakes: json["takes"],
          oClass: json["targetClass"],
          dTakes: json["takes"].filter(e=>filterStudent(e, this.state.filter))
        })
      })
      .catch((err) => {
        console.log("에러 발생")
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

  componentDidMount() {
    this.refreshTakes()
  }

  handleStudentOper(userId, oper){
    fetch("/api/class/member_oper", {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ classId: this.props.match.params.classId, userId: userId, operType: oper  }),
    })
      .then(res => {
        if (res.status != 200) throw res.status
        return res.json()
      })
      .then(res=>{
        console.log(res)
        alert("성공했습니다.")
        this.refreshTakes()
      })
  }

  render() {
    return (
      <ClassTemplate match={this.props.match}>
          <h1>student list 페이지</h1>
          <Table striped>
            <thead>
              <tr>
                <th>학생 아이디</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.dTakes.map((takes, idx)=>(
                  <People
                    key={idx}
                    userId={takes.user}
                    takeStatus={takes.relationType}
                    handleOper={this.handleStudentOper}
                  />
                ))
              }
            </tbody>
          </Table>
      </ClassTemplate>
    );
  }
}