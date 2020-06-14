import React, { Component } from 'react'
import '../App.css'
import { Form, TextArea } from 'semantic-ui-react'

class WriteNotice extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        title: "",
        writingMessage: ""
    }

    handleTargetText = (e) => {
        this.setState({ writingMessage: e.target.value })
    }

    handleTitle = (e) => {
        this.setState({ title: e.target.value })
    }

    onClickButton = (e) => {
        this.props.sendMsg(this.state.title, this.state.writingMessage)
    }

    render() {
        return (
            <div className='Write'>
                <input
                    type="text"
                    className="form-control"
                    placeholder="제목을 입력하세요"
                    aria-label="메세지를 입력하세요"
                    aria-describedby="button-addon2"
                    value={this.state.title}
                    onChange={this.handleTitle}
                />

                <Form>
                    <TextArea id='content_txt' name='contents' placeholder='내용을 입력하세요.' value={this.state.writingMessage}
                        onChange={this.handleTargetText} />
                </Form>

                <button className="btn btn-primary btn-block" onClick={this.onClickButton}>등록</button>
            </div>
        )
    }
}

export default WriteNotice