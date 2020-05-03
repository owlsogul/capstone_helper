import React, {Component} from 'react';


function sendLogin() {
    return fetch('http://caphelper.owlsogul.com/api/user/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: "id",
          userPw: "password"
        }),
      });
}


export default class Login extends Component {

    constructor(props){
        super(props);
        this.state = { userId: "", userPw: "" }
    }

    handlePwChange = (e)=>{
        this.setState({ userPw: e.target.value})
    }

    handleIdChange = (e)=>{
        this.setState({ userId: e.target.value})
    }

    doLogin(){
     
    }

    render() {
        return (
            <form>
                <h3>로그인</h3>

                <div className="form-group">
                    <label>이메일</label>
                    <input type="ID" className="form-control" placeholder="이메일을 입력하세요." value={this.state.userId} onChange={this.handleIdChange}/>
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

                <button className="btn btn-primary btn-block" onClick={(e)=>{
                    console.log(this.state.userId, this.state.userPw)
                    e.preventDefault()
                    this.doLogin()
                }}>로그인</button>
                <p className="forgot-password text-right">
                    <a href="#">비밀번호 찾기</a>
                </p>
            </form>
        );
    }
}