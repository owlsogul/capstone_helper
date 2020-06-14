import React, { Component } from 'react';
import TeamTemplate from "../components/TeamTemplate"
import network from "../network"
import { DefaultFeedbackList } from '../components/FeedbackPage.component'
import { MyExpansionPanel } from '../components/FeedbackPage.component'
import { FeedbackList, FeedbackForm } from '../components/FeedbackPage.component'

const getListFeedback = (classId, teamId) => {
  return network.network('/api/feedback/list_reply', { body: { classId: classId, teamId: teamId, type: "receive" } })
}

const getForm = (classId, teamId) => {
  return network.network('/api/feedback/list_form', { body: { classId: classId } })
}

export default class CheckFeedbackPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    }
  }

  componentDidMount() {
    let classId = this.props.match.params.classId
    let teamId = this.props.match.params.teamId
    if (!classId || !teamId) {
      window.location = "/dashboard"
    }
    getListFeedback(classId, teamId)
      .then((json) => {
        console.log("피드백 리스트는...")
        console.log(json)
        this.setState({ posts: json })
      })

    getForm(classId)
      .then((json) => {
        console.log("폼은...")
        console.log(json)
      })
  }

  render() {
    return (
      <TeamTemplate match={this.props.match} history={this.props.history} >
        <div>
          <FeedbackForm feedBackFormText={"이번주 평가폼 작성하기"}></FeedbackForm>
          <br></br>
        </div>
        <FeedbackList json={this.state.posts} ></FeedbackList>
      </TeamTemplate >
    )
  }
}