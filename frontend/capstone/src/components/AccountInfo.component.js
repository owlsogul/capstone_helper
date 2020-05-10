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

  constructor(props){
    super(props)
    this.onClickLogout = this.onClickLogout.bind(this)
  }

  onClickLogout(){
    fetch("/api/user/signout", {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(res=>res.json())
      .then(res=>{
        window.location = "/"    
      })
  }

  render() {
    return (
      <div className="container" style={ style.container }>
        <div>{this.props.userId}</div>
        <div onClick={this.onClickLogout}>로그아웃</div>
        <div>회원탈퇴</div>
      </div>
    )
  }

}