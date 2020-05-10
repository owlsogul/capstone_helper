import React, { Component } from 'react';
import { useState } from 'react';

class AssistRow extends Component {

    static defaultProps = {
        assistId: "assistName@cau.ac.kr"
    }

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="container">
                <strong>{this.props.assistId}</strong>
                <button onClick={() => {
                    this.props.deleteCallback()
                }}
                    type="button" className="btn btn-danger">Delete</button>
            </div>
        )
    }
}

/**
 * 강의를 개설하는 폼
 */
class CreateClassForm extends Component {

    constructor(props) {
        super(props);
        this.state = { className: "", classNumber: "", classTime: "", targetAssist: "", assistList: [], classId: "" }
    }

    handleClassNameChange = (e) => {
        this.setState({ className: e.target.value })
    }

    handleClassNumberChange = (e) => {
        this.setState({ classNumber: e.target.value })
    }

    handleClassTimeChange = (e) => {
        this.setState({ classTime: e.target.value })
    }

    handleTargetAssist = (e) => {
        this.setState({ targetAssist: e.target.value })
    }

    handleAssistList = (e) => {
        this.setState({
            assistList: this.state.assistList.concat(this.state.targetAssist),
            targetAssist: ""
        })
    }

    createClass() {
        let tempClassId = ""
        fetch('/api/class/create', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ className: this.state.className, classTime: this.state.classTime }),
        })
            .then(res => {
                if (res.status != 200) throw res.status
                return res.json()
            })
            .then(json => {
                // classId와 className을 저장해준다??
                console.log(json)
                console.log(json["classId"])
                tempClassId = json.classId
                this.setState({ classId: json["classId"] })
            })
            .then(() => {
                if (this.state.assistList.length > 0) {
                    this.inviteAssist()
                    console.log(JSON.stringify({ classId: this.state.classId, assistants: this.state.assistList }))
                }
            })
            .then((json) => {
                console.log("아니?? "+ tempClassId)
                this.props.createClassCallback(tempClassId)
                this.props.changeScene("invite")
            })
            .catch((err) => {
                console.log("에러 발생")
                if (err.status == 400) {
                    alert("권한 문제가 발생하였습니다!")
                } else if (err.status == 500) {
                    alert("서버 내부 오류가 발생하였습니다.")
                } else if (err.status == 403) {
                    alert("로그인이 필요합니다.")
                } else {
                    console.log(err.status)
                    alert("알지 못할 오류가 발생하였습니다.")
                }
            })
    }

    // 수업 개설 후 조교를 초대하는 API
    inviteAssist() {
        fetch('/api/class/invite_assist', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ classId: this.state.classId, assistants: this.state.assistList }),
        })
            .then(res => {
                if (res.status != 200) throw res.status
                return res.json()
            })
            .catch((err) => {
                console.log("에러 발생")
                if (err.status == 400) {
                    alert("잘못된 파라미터가 있습니다.")
                } else if (err.status == 403) {
                    alert("권한이 없습니다.")
                } else if (err.status == 500) {
                    alert("서버 내부 오류가 발생하였습니다.")
                } else {
                    console.log(err.status)
                    alert("알지 못할 오류가 발생하였습니다.")
                }
            })
    }

    render() {
        return (
            <form>
                <h3>수업 개설</h3>

                <div className="form-group">
                    <input type="text" className="form-control" placeholder="수업 이름을 입력하세요" value={this.state.className} onChange={this.handleClassNameChange} />
                </div>

                <div className="form-group">
                    <input type="text" className="form-control" placeholder="수업 분반을 입력하세요" value={this.state.classNumber} onChange={this.handleClassNumberChange} />
                </div>

                <div className="form-group">
                    <input type="text" className="form-control" placeholder="수업 시간을 입력하세요" value={this.state.classTime} onChange={this.handleClassTimeChange} />
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
                        <button className="btn btn-outline-secondary" onClick={(e) => {
                            e.preventDefault()
                            this.handleAssistList()
                        }}
                            type="button"
                            id="button-addon2">초대하기</button>
                    </div>
                </div>

                <div>
                    {this.state.assistList.map(item => (
                        <AssistRow assistId={item} deleteCallback={(e) =>
                            this.setState({
                                assistList: this.state.assistList.filter(i => i != item)
                            })}
                        />
                    ))}
                </div>
                <button className="btn btn-primary btn-block" onClick={(e) => {
                    e.preventDefault()
                    this.createClass()
                }}>수업 생성</button>
            </form>
        )
    }
}

/**
 * 조교와 학생 초대 링크를 만드는 폼
 */
class InviteStudentForm extends Component {
    constructor(props) {
        super(props);
        this.state = { assistantExpireTime: "", code: "", studentExpireTime: "", isAutoJoin: false, classId: -1 }
    }

    componentDidUpdate(prevProps, prevState) { 
        console.log("컴포넌트업데이트"+ this.props.classId)
    }

    handleAssistantExpireTimeChange = (e) => {
        console.log(e.target.value)
        this.setState({ assistantExpireTime: e.target.value })
    }

    handleStudentExpireTimeChange = (e) => {
        this.setState({ studentExpireTime: e.target.value })
    }

    handleIsAutoJoinChange = (e) => {
        this.setState({ isAutoJoin: e.target.value })
    }

    // 조교를 위한 초대링크 생성 API
    createAssistInviteCode() {
        fetch('/api/class/create_assist_invite_code', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ classId: this.state.classId, expiredDate: this.state.assistantExpireTime }),
        })
            .then(res => {
                if (res.status != 200) throw res.status
                return res.json()
            })
            .then(json => {
                console.log(json["code"])
                this.setState({ code: json["code"] })
            })
            .catch((err) => {
                console.log("에러 발생")
                if (err.status == 400) {
                    alert("잘못된 파라메터가 있습니다!")
                } else if (err.status == 500) {
                    alert("서버 내부 오류가 발생하였습니다.")
                } else if (err.status == 403) {
                    alert("권한이 없습니다.")
                } else {
                    console.log(err.status)
                    alert("알지 못할 오류가 발생하였습니다.")
                }
            })
    }

    // 학생을 위한 초대링크 생성 API
    createAssistStudentCode() {
        fetch('/api/class/create_assist_student_code', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ classId: this.state.classId, expiredDate: this.state.studentExpireTime, isAutoJoin: this.state.isAutoJoin }),
        })
            .then(res => {
                if (res.status != 200) throw res.status
                return res.json()
            })
            .then(json => {
                console.log(json["code"])
                this.setState({ code: json["code"] })
            })
            .catch((err) => {
                console.log("에러 발생")
                if (err.status == 400) {
                    alert("잘못된 파라메터가 있습니다!")
                } else if (err.status == 500) {
                    alert("서버 내부 오류가 발생하였습니다.")
                } else if (err.status == 403) {
                    alert("권한이 없습니다.")
                } else {
                    console.log(err.status)
                    alert("알지 못할 오류가 발생하였습니다.")
                }
            })
    }


    render() {
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
                        value={this.state.assistantExpireTime}
                        onChange={this.handleAssistantExpireTimeChange}
                    />
                    <div className="input-group-append">
                        <button onClick={(e) => {
                            this.createAssistInviteCode()
                        }}
                            className="btn btn-outline-secondary"
                            type="button"
                            id="button-addon2"
                        >
                            링크 생성
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <input type="classTime" className="form-control" placeholder="생성된 링크" value={this.state.classTime} onChange={this.handleClassTimeChange} />
                </div>


                <h3>학생 초대링크 만들기</h3>

                <div className="form-group">

                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <div className="input-group-text">
                                <input type="radio" aria-label="Checkbox for following text input" />
                            </div>
                        </div>
                        <span className="form-control">바로 입장</span>
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <div className="input-group-text">
                                <input type="radio" aria-label="Checkbox for following text input" />
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
                            value={this.state.studentExpireTime}
                            onChange={this.handleStudentExpireTimeChange}
                        />
                        <div className="input-group-append">
                            <button onClick={(e) => {
                                this.createAssistStudentCode()
                            }}
                                className="btn btn-outline-secondary"
                                type="button"
                                id="button-addon2"
                            >
                                링크 생성
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <input type="classTime" className="form-control" placeholder="생성된 링크" value={this.state.classTime} onChange={this.handleClassTimeChange} />
                    </div>

                </div>

                <button className="btn btn-primary btn-block" onClick={(e) => {
                    e.preventDefault()
                    this.doLogin()
                }}>메인으로 이동</button>
            </form>
        )
    }
}


export default class OpenClass extends Component {

    constructor(props) {
        super(props);
        this.state = { currentScene: /*""*/"class", classId: "" }
    }

    changeScene(newScene) {
        this.setState({ currentScene: newScene })
    }

    render() {
        let form = this.state.currentScene === "class" ?
            (<CreateClassForm changeScene={this.changeScene.bind(this)} createClassCallback={(classId)=>{ console.log(`새로 받은 classId는 ${classId}`); this.setState({classId: classId})}} />) :
            (<InviteStudentForm changeScene={this.changeScene.bind(this)} classId={this.state.classId} />)

        return (
            <div>
                {form}
            </div>
        );
    }
}
