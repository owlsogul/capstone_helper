
import React, { Component } from 'react'
import FeedbackForm from '../components/FeedbackForm.component'
import '../App.css'
import network from '../network'
import ClassTemplate from "../components/ClassTemplate"
import { useState } from 'react';

const form = (classId) => {
  return network.network('/api/feedback/list_form', { body: { classId: classId } })
}

export default class FeedbackFormPage extends Component {
  componentDidMount() {
    form(this.props.match.params.classId)
      .then(json => {
        console.log(json)
      })
  }
  constructor(props) {
    super(props);
    this.state = { classId: this.props.match.params.classId, form: [] }
  }

  getForm() {
    form(this.state.classId)
      .then((res) => res.json())
      .then((json) => {
        console.log("폼은...")
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
    /* let form = this.state.currentScene === "feedbackform" ?
        (<CreateFeedbackForm changeScene={this.changeScene.bind(this)} />) :
        (<NoticePage changeScene={this.changeScene.bind(this)} />) */

    return (
      <ClassTemplate match={this.props.match}>
        <div>
          <FeedbackForm match={this.props.match}></FeedbackForm>
        </div>
      </ClassTemplate>
    );
  }
}
