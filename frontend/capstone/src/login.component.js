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
        // 여기서 로그인 관련 통신하면 될것 같습니다.
        // fetch로 통신하고. 제가 fetch 더 공부해서 적용해볼게요.
        // 넵
        // 그리고 깃헙은 어디서 오류가 난걸까요?
        // 그 제일 처음에 커밋하고 origin push였던가 암튼 제일 처음에 레포 만들고 하는 작업부터 안대서 초기화하라해서 해봣는데도 안대네요 ㅠㅠ
        // 제가 레포를 만들어 놔서 그 레포 클론 받아서 쓰시면 되거든요
        // 혹시 깃헙 처음이신가요??? 아 저 클론은 받았어요! 집파일로요. 근데 깃헙 맨날 클론만 받아봣어요.
        // 아 그런가요 그러면 gui 툴로 하시는게 편하실 거에요. 그게 어떤건가요? ui 꾸미는 건가요?
        // https://desktop.github.com/
        // 이게 깃을 눈으로 보기 쉽게? 해서 팀플도 하기 쉽숩니다 저도 이거 써서... 혹시 쓰시는 프로그램이라든지 잇나요? 아뇨 쓰는 거 vscode밖에 없어요 깃이랑 노드js랑 깔려있는건 이거밖에없는거같아요.
        // 일단 깃헙 계속 쓰셔야하니까 저 링크 들어가서 다운로드 받고 설치해보실래요
        // 네!
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
                    <label>이메일 따라쟁이</label>
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