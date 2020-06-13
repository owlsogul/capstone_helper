import React, { Component } from 'react';
import '../App.css'
import { useState } from 'react';
import FeedbackFormPage from '../pages/CreateFeedbackFormPage'

class AddFeedbackform extends Component {
  constructor(props) {
    super(props);
    this.state = { formId: 0, name: ""}
  }

  handlenameChange = (e) => {
    this.setState({ name: e.target.value })
  }

  handleformIdChange = (e) => {
    this.setState({ formId: e.target.value + 1 })
  }

  render() {
    const {
      item
    } = this.props.name

    return (
      <p>
        <strong>
          <input type="text" name="evaluate_index" value={this.state.name} placeholder="평가 항목 입력" onChange={this.handlenameChange, this.handleformIdChange} />
        </strong>
      </p>
    )
  }
}

class CreateFeedback extends Component {
  constructor(props) {
    super(props);
    this.state = { classId: 0, formId: 0, name: "", feedback: ""}
  }

  addFeedbackForm = (e) => {
    return (
      <p>
        <strong>
          <input type="text" name="evaluate_index" value={this.state.name} placeholder="평가 항목 입력" onChange={this.handlenameChange, this.handleformIdChange} />
        </strong>
      </p>
    )
  }

  handleclassIdChange = (e) => {
    this.setState({ classId: e.target.value })
  }

  handleformIdChange = (e) => {
    this.setState({ formId: e.target.value + 1 })
  }

  handlenameChange = (e) => {
    this.setState({ name: e.target.value })
  }

  feedbackContents() {
    let tempClassId = ""
    let tempFormId = ""
    fetch('/api/class/edit_form', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        classId: this.state.classId,
        formId: this.state.formId ,
        name: this.state.name,
        body: this.state.feedback
      }),
    })

      .then(res => res.json())

      .then(json => {
        tempClassId = json.classId
        this.setState({ classId: json["classId"] })
        console.log(json.stringify({ classId: this.state.classId }))
      })

      .then(json => {
        tempFormId = json.formId
        this.setState({ formId: json["formId"] })
        console.log(json.stringify({ formId: this.state.formId }))
      })

      .then(json => {
        this.setState({ name: json["name"] })
        console.log(JSON.stringify({ name: this.state.name }))
      })

      .then((json) => {
        console.log("여기는 " + tempClassId)
        console.log("여기는" + tempFormId)
        this.props.createClassCallback(tempClassId)
        this.props.createClassCallback(tempFormId)
      })
  }

  render() {
    return (
      <form>
        <h3>
          <strong>피드백 항목 수정</strong>
        </h3>

        <p>
          <strong>평가항목</strong>
        </p>

        <div>
          <button onChange={this.feedbackContents()} onClick={this.addFeedbackForm()}>항목 추가</button>
        </div>

        <p>
          <strong>
            <input type="text" name="evaluate_index" value={this.state.name} placeholder="평가 항목 입력" onChange={this.handlenameChange, this.handleformIdChange} />
          </strong>
        </p>

        <p>
          <input type="submit" value="확인" onChange={this.feedbackContents()} />
        </p>
      </form>
    )
  }
}

export default CreateFeedback