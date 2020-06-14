import React, { Component } from 'react'
import EditFeedbackForm from '../components/EditFeedbackForm.component'
import '../App.css'
import { useState } from 'react';

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
}

export default class EditFeedbackFormPage extends Component {
  constructor(props) {
    super(props);
    this.state = { classId: this.props.match.params.classId, fomr: [] }
    this.getForm = this.getForm.bind(this);
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

  /*changeScene(newScene) {
      this.setState({ currentScene: newScene })
  } */

  render() {

    console.log("id는" + this.props.match.params.classId)
    console.log(this.props.match)
    /* let form = this.state.currentScene === "feedbackform" ?
        (<CreateFeedbackForm changeScene={this.changeScene.bind(this)} />) :
        (<NoticePage changeScene={this.changeScene.bind(this)} />) */

    return (
      <div>
        <EditFeedbackForm match={this.props.match}></EditFeedbackForm>
      </div>
    );
  }
}