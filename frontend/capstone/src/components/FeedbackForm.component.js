import React, { Component } from 'react';
import '../App.css'
import { useState } from 'react';
import CreateFeedback from './CreateFeedbackForm.component'


class FeedbackComment extends Component {
  constructor(props) {
    super(props);
    this.state = { classId: this.props.match.params.classId, name: "", myTeam: 0 }
  }

  handlefeedbackChange = (e) => {
    this.setState({ feedback: e.target.value })
  }

  handlemyTeamChange = (e) => {
    this.setState({ myTeam: e.target.value })
  }

  /* getForm = (e) => {
    form({ classId: this.state.classId })
      .then((res) => res.json())
      .then((json) => {
        console.log(json)
        this.setState({
          form: json
        })
      })
  } */

  render() {

    return (
      <form>
        <h3>
          <strong>Capstone Design Feedback Form</strong>
          <input type="text" name="myTeam" value={this.state.myNumber} placeholder="자신의 조 입력" onChange={this.handleMyNumberChange} />
        </h3>

        <p>
          <strong>평가항목</strong>
        </p>
        <div>
          <CreateFeedback />
        </div>
        <p>
          <div>
            <strong>피드백을 작성해주세요</strong>
          </div>
          <div>
            <textarea id='fcontent_txt' name='feedback' placeholder='내용을 입력하세요.' value={this.state.feedback} onChange={this.handlefeedbackChange} />
          </div>
        </p>
        <p>
          <input type="submit" value="제출"/>
        </p>
      </form>
    )
  }
}

export default FeedbackComment