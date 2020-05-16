import React, { Component } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

const style = {

  container: {
    width: "100%",
    backgroundColor: "#ffffff",
    height: "100%",
    padding: 10,
    borderRight: "1px solid black",
    display: "flex-box",
    flexDirection: "row"
  },

}

/**
 * props:
 */
export default class AccountInfo extends Component {

  constructor(props) {
    super(props)
    this.onClickLogout = this.onClickLogout.bind(this)
  }

  onClickLogout() {
    fetch("/api/user/signout", {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(res => {
        window.location = "/"
      })
  }

  onClickExit() {
    if (window.confirm("정말로 탈퇴하시겠습니까?")){
      fetch("/api/user/exit", {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      })
        .then(res => res.json())
        .then(res => {
          window.location = "/"
        })
    }
  }

  render() {
    return (
      <div className="container" style={style.container}>
        <button className="btn btn-primary btn-block" onClick={this.onClickLogout}>로그아웃</button>
        <button className="btn btn-primary btn-block" onClick={this.onClickExit}>회원탈퇴</button>
      </div>
    )
  }

}