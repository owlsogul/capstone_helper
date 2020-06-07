import React, { Component } from 'react';
import '../App.css'
import { useState } from 'react';
import CreateFeedback from './CreateFeedbackForm.component'

function form(sendObj) {
  return fetch('/api/class/list_form', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ classId: sendObj.classId }),
  })

    .then(json => {
      this.setState({ body: json["feedback"] })
      console.log(JSON.stringify({ body: this.state.feedback }))
    })
}


class FeedbackComment extends Component {
  constructor(props) {
    super(props);
    this.state = { classId: this.props.match.params.classId, name: "", formId: 0, feedback: "", myTeam: 0 }
    this.getForm = this.getForm.bind(this);
  }

  handlefeedbackChange = (e) => {
    this.setState({ feedback: e.target.value })
  }

  handlemyTeamChange = (e) => {
    this.setState({ myTeam: e.target.value })
  }

  getForm() {
    form({ classId: this.state.classId })
      .then((res) => res.json())
      .then((json) => {
        console.log(json)
        this.setState({
          form: json
        })
      })
  }

  render() {
    console.log("id는" + this.props.match.params.classId)
    console.log(this.props.match)

    return (
      <form>
        <h3>
          <strong>Capstone Design Feedback Form</strong>
          <input type="text" name="myTeam" value={this.state.myNumber} placeholder="자신의 조 입력" onChange={this.handleMyNumberChange} />
        </h3>

        <p>
          <strong>평가항목</strong>
        </p>
        <p>
          <strong>
            <p type="text" name="evaluate_index" value={this.state.name} />
          </strong>
          <input type="radio" name="index_score" value='1'>1</input>
          <input type="radio" name="index_score" value='2'>2</input>
          <input type="radio" name="index_score" value='3'>3</input>
          <input type="radio" name="index_score" value='4'>4</input>
          <input type="radio" name="index_score" value='5'>5</input>
        </p>
        <p>
          <div>
            <strong>피드백을 작성해주세요</strong>
          </div>
          <div>
            <textarea id='fcontent_txt' name='feedback' placeholder='내용을 입력하세요.' value={this.state.feedback} onChange={this.handlefeedbackChange} />
          </div>
        </p>
        <p>
          <input type="submit" value="제출" onChange={form()} />
        </p>
      </form>
    )
  }
}

export default FeedbackComment