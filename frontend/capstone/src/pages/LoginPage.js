// login 주석 추가
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

function sendLogin(sendObj) {
    return fetch('/api/user/signin', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendObj),
    });
}

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = { userId: "", userPw: "", isLoginFinished: false }
    }

    handlePwChange = (e) => {
        this.setState({ userPw: e.target.value })
    }

    handleIdChange = (e) => {
        this.setState({ userId: e.target.value })
    }

    doLogin() {
        sendLogin({ userId: this.state.userId, userPw: this.state.userPw })
            .then(res => {
                if (res.status == 200) {
                    alert("정상적으로 로그인 됨")
                    this.setState({ isLoginFinished: true })
                } else if (res.status == 400) {
                    alert("잘못된 데이터거나 로그인 데이터가 없습니다.")
                } else if (res.status == 500) {
                    alert("서버 내부적인 오류가 있습니다.")
                }
            })
    }

    render() {
        // 로그인 후 이동 정의
        if (this.state.isLoginFinished) {
            return <Redirect to='/main' />;
        } else {
            return(
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form>
                        <h3>로그인</h3>

                        <div className="form-group">
                            <label>이메일</label>
                            <input type="ID" className="form-control" placeholder="이메일을 입력하세요." value={this.state.userId} onChange={this.handleIdChange} />
                        </div>

                        <div className="form-group">
                            <label>비밀번호</label>
                            <input type="password" className="form-control" placeholder="비밀번호를 입력하세요." value={this.state.userPw} onChange={this.handlePwChange} />
                        </div>

                        <div className="form-group">
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="customcheck1" />
                                <label className="custom-control-label" htmlFor="customCheck1">아이디 저장</label>
                            </div>
                        </div>

                        <button className="btn btn-primary btn-block" onClick={(e) => {
                            console.log(this.state.userId, this.state.userPw)
                            e.preventDefault()
                            this.doLogin()
                        }}>로그인</button>
                        <p className="forgot-password text-right">
                            <a href="#">비밀번호 찾기</a>
                        </p>
                    </form>
                </div>
            </div>
            )
        }
    }
}