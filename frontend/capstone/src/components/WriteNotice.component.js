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

    createnotice() {
        fetch('/api/class/post_notice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: this.state.title,
                contents: this.state.contents
            })
        })
            .then(json => {
                console.log(json)
                console.log(json["title"])
                this.setState({ noticeId: json["title"] })
            })

            .then(res => {
                return res.json()
            })
            .catch((err) => {
                console.log("등록 불가")
                if (err.title === '') {
                    return alert("제목을 입력해주세요.")
                }
                else if (err.contents === '') {
                    return alert("내용을 입력해주세요.")
                }
                /*if (res.data) {
                    alert("공지가 등록되었습니다.")
                    return window.location.replace('/')
                }*/
            })
    }

    handleClick = () => {
        console.log("Click");
    }

    render() {

        return (
            <div className='Write'>
                <div>
                    <input type='text' id='title_txt' name='title' placeholder='제목을 입력하세요' />
                </div>

                <div>
                    <textarea id='content_txt' name='contents' placeholder='내용을 입력하세요.'></textarea>
                </div>
                <div id='post_submit'>
                    <Link to="/notice">
                        <button onClick={this.handleClick}>등록</button>
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