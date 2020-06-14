import React, { Component } from 'react'
import WriteNotice from '../components/WriteNotice.component'
import ClassTemplate from "../components/ClassTemplate"
import network from "../network/index"
import '../App.css'

// 공지 올리기
const uploadNotice = (classId, title, body) => {
    return network.network("/api/class/post_notice", { body: { classId: classId, title: title, body: body } })
}

class WriteNoticePage extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        let classId = this.props.match.params.classId
        this.setState({ classId: classId })
    }

    sendMsg(title, body) {
        console.log("classId는")
        // console.log(this.state.classId)
        /// TODO: classId가 undefined인 문제 있음. 
        uploadNotice(1, title, body)
            .then((res) => {
                if (res.status == 200)
                    alert("성공적으로 공지가 등록되었습니다. ")
            })
    }

    render() {
        return (
            <ClassTemplate match={this.props.match}>
                <div>
                    <WriteNotice sendMsg={this.sendMsg} />
                </div>
            </ClassTemplate>
        )
    }
}

export default WriteNoticePage