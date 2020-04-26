import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

// 로그인 되었는지 확인하는 함수
function userInfo(sendObj) {
  return fetch('/api/user/user_info', {
    method: 'GET',
    credentials: 'include'
  })
}

function classList() {
  return fetch('/api/class/list', {
    method: 'GET',
    credentials: 'include'
  })
}

export default class RedirectingComponent extends Component {
  state = {
    isLogin: false,
    isWaiting: false
  }

  componentWillMount() {
    // render() 전에 call 됨. 
    userInfo().then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (json["err"] == null || json["err"] == undefined) {
          // 성공
          classList()
            .then((response) => response.json())
            .then((json) => {
              console.log(json)
              json["take"].forEach(each => {
                if (each["takeStatus"] == 0) {
                  // 대기중인 수업
                  this.setState({
                    isLogin: true,
                    isWaiting: true
                  })
                  return;
                }
              })
            })
            .then(
              // 승인 대기 수업일때 넘어가는 화면으로 가기
              this.setState({
                isLogin: true,
                isWaiting: true
              })
            )
        }
        // 아니면 메인으로 가기
        else {
          console.log(json["err"]);
          // 실패 (로그인 상태 아님)
          this.setState({
            isLogin: false,
            isWaiting: false
          })
        }
      })
  }

  render() {
    const { isLogin, isWaiting } = this.state;
    if (isLogin && isWaiting) {
      // 기다리는중
      return <Redirect to='/wait' />;
    }
    else if (isLogin && !isWaiting) {
      // 로그인
      return <Redirect to='/sign-in' />;
    }
    else {
      // 메인
      return <Redirect to='/main' />
    }
  }
}