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

export default class RedirectingComponent extends Component {
  state = {
    isLogin: false, 
    isWaiting: false
  }

  componentWillMount(){ 
    // render() 전에 call 됨. 
    userInfo().then((response)=> response.json())
    .then((json)=>{
      console.log("response 받아오기 성공~!~!");
      console.log(json);
      if (json["err"] == null || json["err"] == undefined){
        // 성공
        // 승인 대기 수업일때 넘어가는 화면으로 가기
          this.setState({
            isLogin: true, 
            isWaiting: true
          })
        // 아니면 메인으로 가기
      } else {
        console.log(json["err"]);
        // 실패 (로그인 상태 아님)
        // TODO: 로그인 화면으로 이동
        this.setState({
          isLogin: false, 
          isWaiting: false
        })
      }
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  
  render() {
    const { isLogin, isWaiting } = this.state;
    if (isLogin && isWaiting) {
      // 기다리는중
      return <Redirect to='/wait'/>;
    }
    else if (isLogin && !isWaiting){
      // 로그인
      return <Redirect to='/sign-in'/>;
    }
    else {
      // 메인
      return <Redirect to='/main'/>
    }
  }
}