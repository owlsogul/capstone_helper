import React, { Component } from 'react'
import '../App.css'
import { useState } from 'react';
import NoticePage from '../pages/NoticePage'
import { Link } from 'react-router-dom'

class WriteNotice extends Component {
    constructor(props) {
        super(props)
        this.state = { title: "", contents: "", noticeId: "" }
    }

    handleTitleChange = (e) => {
        this.setState({ title: e.target.value })
    }

    handleContentsChange = (e) => {
        this.setState({ contents: e.target.value })
    }

    createnotice() {
        let tempClassId = ''
        fetch('/api/class/post_notice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ noticeTitle: this.state.title, noticeContents: this.state.contents })
        })

            .then(res => res.json())

            .then(json => {
                console.log(json)
                console.log(json["title"])
                this.setState({ noticeTitle: json["title"] })
            })

            .then(json => {
                console.log(json)
                console.log(json["contents"])
                this.setState({ noticeContents: json["contents"] })
            })

            .then(json => {
                tempClassId = json.classId
                this.setState({ noticeId: json["nticeId"] })
            })

            .then((json) => {
                console.log("여기는 " + tempClassId)
                // this.props.createClassCallback(tempClassId)
                this.props.changeScene("notice")
            })

            .catch((err) => {
                console.log("등록 불가")
                if (err.title === '') {
                    return alert("제목을 입력해주세요.")
                }
                else if (err.contents === '') {
                    return alert("내용을 입력해주세요.")
                }
            })
    }

    render() {

        return (
            <div className='Write'>
                <div>
                    <input type='text' id='title_txt' name='title' placeholder='제목을 입력하세요' value={this.state.title} onChange={this.handleTitleChange} />
                </div>

                <div>
                    <textarea id='content_txt' name='contents' placeholder='내용을 입력하세요.' value={this.state.contents} onChange={this.handleContentsChange}></textarea>
                </div>
                <div id='post_submit'>
                    <Link to="/notice">
                        <button onClick={this.createnotice}>등록</button>
                    </Link>
                </div>
            </div>
        )
    }
}

export default class WriteNoticePage extends Component {
    constructor(props) {
        super(props);
        this.state = { currentScene: /*""*/"notice" }
    }

    changeScene(newScene) {
        this.setState({ currentScene: newScene })
    }

    render() {
        let form = this.state.currentScene === "notice" ?
            (<WriteNotice changeScene={this.changeScene.bind(this)} />) :
            (<NoticePage changeScene={this.changeScene.bind(this)} />)

        return (
            <div>
                <div>
                    <div>
                        {form}
                    </div>
                </div>
            </div>
        );
    }
}