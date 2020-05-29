import React, { Component } from 'react';

export default class wait extends Component {
  doConfirm = () => {
    console.log("확인 버튼 눌림")
  }

  render() {
    return (
      <div className="auth-wrapper">
        <div className="auth-inner">
          <div>
            <h4>수업 참여 승인을 대기 중입니다. </h4>
            <h4>승인이 완료되면 이메일로 전달해드립니다.</h4>
            <button className="btn btn-primary btn-block" onClick={this.doConfirm}>확인</button>
          </div>
        </div>
      </div>
    );
  }
}