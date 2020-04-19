import React, {Component} from "react";


export default class SignUp extends Component {
    render() {
        return (
            <form>
                <h3>회원가입</h3>

                <div className="form-group">
                    <label>이름</label>
                    <input type="text" className="form-control" placeholder="이름을 입력하세요." />
                </div>

                <div className="form-group">
                    <label>이메일</label>
                    <input type="email" className="form-control" placeholder="이메일을 입력하세요." />
                </div>

                <div className="form-group">
                    <label>비밀번호</label>
                    <input type="password" className="form-control" placeholder="비밀번호를 입력하세요." />
                </div>

                <div className="form-group">
                    <label>비밀번호 확인</label>
                    <input type="password" className="form-control" placeholder="비밀번호를 다시 입력하세요." />
                </div>


                <button type="submit" className="btn btn-primary btn-block">회원가입</button>
            </form>
        );
    }
}