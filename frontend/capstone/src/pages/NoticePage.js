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

const list = [];

export default class NoticePage extends Component {
  constructor(props) {
    super(props);
    this.state = { classId: "" }
  }

  getNotice() {
    notice(this.state)
      .then((res) => res.json())
      .then((json)=>{
        console.log(json)
      })
  }

  render() {
    return (
      // <this.ComplexList />
      <ComplexList list={list}/>
    );
  }

  componentWillMount() {
    this.getNotice()
  }
}