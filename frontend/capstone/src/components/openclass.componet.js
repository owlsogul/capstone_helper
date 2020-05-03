import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';

// 새로 class를 만드는 함수
function sendCreateClass(sendObj) {
    return fetch('/api/class/create', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sendObj),
    });
}

// TODO: 에러 표시 화면
function AlertDismissibleExample() {
    const [show, setShow] = useState(true);
  
    if (show) {
      return (
        <Alert variant="danger" onClose={() => setShow(false)} dismissible>
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>
            무언가의 에러에 대한 설명
          </p>
        </Alert>
      );
    }
    return <Button onClick={() => setShow(true)}>Show Alert</Button>;
}

class AssistRow extends Component {

    static defaultProps = {
        assistId: "assistName@cau.ac.kr"
    }

    constructor(props){
        super(props)
    }

    render(){
        return (
            <div className="container">
                <strong>{ this.props.assistId }  </strong><button type="button" className="btn btn-danger">Delete</button>
            </div>
        )
    }

}

class AssistList extends Component {
    
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div>
                <AssistRow assistId={"now-hwan@cau.ac.kr"}/>
                <AssistRow assistId={"yeah-jincho@cau.ac.kr"}/>
            </div>
        )
    }

}

/**
 * 강의를 개설하는 폼
 */
class CreateClassForm extends Component {

    constructor(props){
        super(props);
        this.state = { className: "", classNumber: "", classTime: "", targetAssist: "", assistList: [] }
    }

    handleClassNameChange = (e)=>{
        this.setState({ className: e.target.value})
    }

    handleClassNumberChange = (e)=>{
        this.setState({ classNumber: e.target.value })
    }

    handleClassTimeChange = (e)=>{
        this.setState({ classTime: e.target.value })
    }

    handleTargetAssist = (e)=>{
        this.setState({ targetAssist: e.target.value })
    }

    doCreate(e){
        sendCreateClass(e)
            .then((response)=>{
                if (response.status == 200) {
                    console.log("에러 없음")
                    this.props.changeScene("invite")
                }
                else {
                    console.log("에러 발생")
                    if (response.status == 400) {
                        alert("권한 문제가 발생하였습니다!")
                    } else if (response.status == 500) {
                        alert("서버 내부 오류가 발생하였습니다.")
                    } else if (response.status == 403) {
                        alert("로그인이 필요합니다.")
                    } else {
                        console.log(response.status)
                        alert("알지 못할 오류가 발생하였습니다.")
                    }
                }
            })
    }

    render(){
        return (
            <form>
                <h3>수업 개설</h3>

                <div className="form-group">
                    <input type="text" className="form-control" placeholder="수업 이름을 입력하세요" value={this.state.className} onChange={this.handleClassNameChange}/>
                </div>

                <div className="form-group">
                    <input type="text" className="form-control" placeholder="수업 분반을 입력하세요" value={this.state.classNumber} onChange={this.handleClassNumberChange}/>
                </div>

                <div className="form-group">
                    <input type="text" className="form-control" placeholder="수업 시간을 입력하세요" value={this.state.classTime} onChange={this.handleClassTimeChange}/>
                </div>

                <div className="input-group mb-3">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="조교 이메일을 입력하세요" 
                        aria-label="조교 이메일을 입력하세요" 
                        aria-describedby="button-addon2"
                        value={this.state.targetAssist} 
                        onChange={this.handleTargetAssist}
                    />
                    <div className="input-group-append">
                        <button 
                            className="btn btn-outline-secondary" 
                            type="button" 
                            id="button-addon2"
                        >
                            초대하기
                        </button>
                    </div>
                </div>
                

                <div className="container">
                    <AssistList/>
                </div>
                

                <button className="btn btn-primary btn-block" onClick={(e)=>{
                    console.log(this.state.userId, this.state.userPw)
                    e.preventDefault()
                    this.doCreate()
                }}>수업 생성</button>
            </form>
        )
    }
}

/**
 * 초대 링크를 만드는 폼
 */
class InviteStudentForm extends Component {
    constructor(props){
        super(props);
        this.state = { className: "", classNumber: "", classTime: "" }
    }

    handleClassNameChange = (e)=>{
        this.setState({ className: e.target.value})
    }

    handleClassNumberChange = (e)=>{
        this.setState({ classNumber: e.target.value })
    }

    handleClassTimeChange = (e)=>{
        this.setState({ classTime: e.target.value })
    }

    render(){
        return (
            <form>
                <h3>조교 초대링크 만들기</h3>

                <div className="input-group mb-3">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="만료 날짜를 입력하세요" 
                        aria-label="만료 날짜를 입력하세요" 
                        aria-describedby="button-addon2"
                        value={this.state.targetAssist} 
                        onChange={this.handleTargetAssist}
                    />
                    <div className="input-group-append">
                        <button 
                            className="btn btn-outline-secondary" 
                            type="button" 
                            id="button-addon2"
                        >
                            링크 생성
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <input type="classTime" className="form-control" placeholder="생성된 링크" value={this.state.classTime} onChange={this.handleClassTimeChange}/>
                </div>


                <h3>학생 초대링크 만들기</h3>

                <div className="form-group">

                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <div className="input-group-text">
                                <input type="radio" aria-label="Checkbox for following text input"/>
                            </div>
                        </div>
                        <span className="form-control">바로 입장</span>
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <div className="input-group-text">
                                <input type="radio" aria-label="Checkbox for following text input"/>
                            </div>
                        </div>
                        <span className="form-control">입장 허가 필요</span>
                    </div>

                    <div className="input-group mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="만료 날짜를 입력하세요" 
                            aria-label="만료 날짜를 입력하세요" 
                            aria-describedby="button-addon2"
                            value={this.state.targetAssist} 
                            onChange={this.handleTargetAssist}
                        />
                        <div className="input-group-append">
                            <button 
                                className="btn btn-outline-secondary" 
                                type="button" 
                                id="button-addon2"
                            >
                                링크 생성
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <input type="classTime" className="form-control" placeholder="생성된 링크" value={this.state.classTime} onChange={this.handleClassTimeChange}/>
                    </div>

                </div>

                <button className="btn btn-primary btn-block" onClick={(e)=>{
                    console.log(this.state.userId, this.state.userPw)
                    e.preventDefault()
                    this.doLogin()
                }}>메인으로 이동</button>
            </form>
        )
    }
}


export default class OpenClass extends Component {

    constructor(props){
        super(props);
        this.state = { currentScene: /*""*/"class"  }
    }

    changeScene(newScene){
        this.setState({ currentScene: newScene })
    }

    render() {
        let form = this.state.currentScene === "class" ? 
                    (<CreateClassForm changeScene={this.changeScene.bind(this)}/>) : 
                    (<InviteStudentForm changeScene={this.changeScene.bind(this)}/>)

        return (
            <div className="auth-wrapper">
            <div className="auth-inner">
            <div>
                {form}
            </div>
            </div>
            </div>
        );
    }
}
