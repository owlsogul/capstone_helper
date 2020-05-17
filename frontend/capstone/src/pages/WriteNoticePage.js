import React, { Component } from 'react'
import WriteNotice from '../components/WriteNotice.component'
import '../App.css'
import axios from 'axios'



class WriteNoticePage extends Component {
    constructor(props) {
        super(props)
    }

    submitNotice = async function () {
        const title = document.getElementsByName('title')[0].nodeValue.trim()
        const contents = document.getElementsByName('contents')[0].nodeValue.trim()

        if (title === "") {
            return alert('제목을 입력해주세요.')
        }

        else if (contents === "") {
            return alert("내용을 입력해주세요.")
        }

        if(res.data) {
            alert('공지가 등록되었습니다.')
            return window.location.replace('/')
        }

        const data = { title: title, contents: contents }
        const res = await axios('/writenotice', {
            method: 'POST',
            data: data,
            headers: new Headers()
        })
    }
    

    render() {
        return (
            <div>
                <WriteNotice />

                <div id='post_submit'>
                    <button>등록</button>
                </div>
            </div>
        )
    }
}

export default WriteNoticePage