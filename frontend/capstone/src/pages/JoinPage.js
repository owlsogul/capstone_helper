import React, { Component } from 'react';

export default class JoinPage extends Component {
  doConfirm = () => {
    console.log("확인 버튼 눌림")
  }

  componentDidMount(){
    let inviteCode = this.props.match.params.code
    fetch("/api/class/invite/" + inviteCode)
      .then(res=>res.json())
      .then(res=>{
        console.log(res)
        alert("수업이 등록되었습니다.")
        window.location = "/dashboard"
      })
  }

  render() {
    return (
      <div className="auth-wrapper">
      </div>
    );
  }
}