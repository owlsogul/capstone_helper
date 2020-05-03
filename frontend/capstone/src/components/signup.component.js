import React, { Component } from "react";

class Congratulation extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <div>
                        회원가입을 축하드립니다. {this.props.target}
                    </div>
                </div>
            </div>
        )
    }
}

class CommonRegister extends Component {

    constructor(props) {
        super(props)
        this.state = { userId: "", userPw: "", userPwChk: "", userName: "", studentCode: "", userPhone: "" }
    }

    onClickRegister() {
        console.log(JSON.stringify(this.state))
        fetch(this.props.appendix === "Prof" ? '/api/user/register_prof' : '/api/user/register', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state),
        })
            .then(res => {
                if (res.status != 200) throw res.status
                return res.json()
            })
            .then(() => {
                this.props.onSuccessRegister(this.props.appendix)
            })
    }

    render() {
        var appendix = null
        if (this.props.appendix === "Prof") {
            appendix = <ProfessorRegister onChange={(txt) => { this.setState({ userPhone: txt }) }} />
        }
        else {
            appendix = <StudentRegister onChange={(txt) => { this.setState({ studentCode: txt }) }} />
        }
        return (
            <form onSubmit={(e) => { e.preventDefault() }}>
                <h3>회원가입</h3>

                <div className="form-group">
                    <label>이름</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="이름을 입력하세요."
                        value={this.state.userName}
                        onChange={(e) => { this.setState({ userName: e.target.value }) }}
                    />
                </div>

                <div className="form-group">
                    <label>이메일</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="이메일을 입력하세요."
                        value={this.state.userId}
                        onChange={(e) => { this.setState({ userId: e.target.value }) }}
                    />
                </div>

                <div className="form-group">
                    <label>비밀번호</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="비밀번호를 입력하세요."
                        value={this.state.userPw}
                        onChange={(e) => { this.setState({ userPw: e.target.value }) }}
                    />
                </div>

                <div className="form-group">
                    <label>비밀번호 확인</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="비밀번호를 다시 입력하세요."
                        value={this.state.userPwChk}
                        onChange={(e) => { this.setState({ userPwChk: e.target.value }) }}
                    />
                </div>
                {appendix}

                <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={(e) => {
                        this.onClickRegister()
                    }}
                >
                    회원가입
                </button>
                <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={(e) => {
                        this.props.onClickBack()
                        console.log("??")
                    }}
                >
                    돌아가기
                </button>
            </form>

        )
    }
}

class ProfessorRegister extends Component {

    render() {
        return (
            <div>
                <div className="form-group">
                    <label>폰 번호</label>
                    <input type="text" className="form-control" placeholder="폰 번호를 입력하세요" onChange={(e) => { this.props.onChange(e.target.value) }} />
                </div>
            </div>
        )
    }
}


class StudentRegister extends Component {
    render() {
        return (
            <div>
                <div className="form-group">
                    <label>학번</label>
                    <input type="text" className="form-control" placeholder="학번을 입력하세요." onChange={(e) => { this.props.onChange(e.target.value) }} />
                </div>
            </div>
        )
    }
}

class SelectType extends Component {

    static defaultProps = {
        onSelectType: console.log
    }

    constructor(props) {
        super(props)
        this.onClickProfessor = this.onClickProfessor.bind(this)
        this.onClickStudent = this.onClickStudent.bind(this)
    }

    onClickProfessor() {
        this.props.onSelectType("PROF")
    }

    onClickStudent() {
        this.props.onSelectType("STUD")
    }

    render() {
        return (
            <div>
                <h3>어느 유형으로 가입하시겠습니까?</h3>
                <div>
                    <div
                        onClick={this.onClickProfessor}
                    >
                        교수님
                    </div>
                    <div
                        onClick={this.onClickStudent}
                    >
                        학생/조교
                    </div>
                </div>
            </div>
        )
    }
}

export default class SignUp extends Component {

    constructor(props) {
        super(props)
        this.state = {
            displayScreen: "Select"
        }
        this.handleType = this.handleType.bind(this)
        this.onBackStep = this.onBackStep.bind(this)
        this.onSuccessRegister = this.onSuccessRegister.bind(this)
    }

    handleType(type) {
        this.setState({
            displayScreen: type === "PROF" ? "Prof" : "Stud"
        })
    }

    onBackStep() {
        this.setState({
            displayScreen: "Select"
        })
    }

    onSuccessRegister(type) {
        this.setState({
            displayScreen: type === "PROF" ? "SucProf" : "SucStud"
        })
    }


    render() {
        var content;
        if (this.state.displayScreen === "Select") {
            content = <SelectType onSelectType={this.handleType} />
        }
        else if (this.state.displayScreen === "Prof") {
            content = <CommonRegister appendix={"Prof"} onClickBack={this.onBackStep} onSuccessRegister={this.onSuccessRegister} />
        }
        else if (this.state.displayScreen === "Stud") {
            content = <CommonRegister appendix={"Stud"} onClickBack={this.onBackStep} onSuccessRegister={this.onSuccessRegister} />
        }
        else if (this.state.displayScreen === "SucProf") {
            content = <Congratulation target={"교수님"} />
        }
        else if (this.state.displayScreen === "SucStud") {
            content = <Congratulation target={"학생님"} />
        }

        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <div>
                        {content}
                    </div>
                </div>
            </div>
        );
    }
}