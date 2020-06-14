import React, { Component } from 'react';
import '../App.css'
import { useState } from 'react';
import FeedbackFormPage from '../pages/CreateFeedbackFormPage'
import Question from './CreateQuestion.component'
import QuestionList from './CreateQuestionList.component'

class CreateFeedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedbackform: [
        {
          contents: "",
          id: 0
        }
      ]
    }
  }

    handleCreate = (data) => {
      const { feedbackform } = this.state;
      this.setState({
        feedbackform: feedbackform.concat({ id: this.id++, ...data })
      })
    }

    feedbackContents = () => {
      fetch('/api/class/edit_form', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.state.id,
          body: this.state.contents
        }),
      })

        .then(res => res.json())

        .then(json => {
          this.setState({ classId: json["classId"] })
          console.log(json.stringify({ classId: this.state.classId }))
        })

        .then(json => {
          this.setState({ contents: json["contents"] })
          console.log(json.stringify({ formId: this.state.contents }))
        })

        /* .then((json) => {
          console.log("여기는 " + tempClassId)
          console.log("여기는" + tempFormId)
          this.props.createClassCallback(tempClassId)
          this.props.createClassCallback(tempFormId)
        }) */
    }

    render() {
      return (
        <form>
          <h3>
            <strong>피드백 수정</strong>
          </h3>

          <p>
            <strong>평가항목</strong>
          </p>

          <div>
            <Question
            onCreate={this.handleCreate}
            />
            <QuestionList data={this.state.feedbackform}/>
          </div>

          <p>
            <input type="submit" value="저장" onChange={this.feedbackContents()} />
          </p>
        </form>
      )
    }
  }

  export default CreateFeedback