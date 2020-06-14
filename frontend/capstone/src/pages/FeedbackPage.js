import React, { Component } from 'react';
import TeamTemplate from "../components/TeamTemplate"
import network from "../network"
import { FeedbackForm, FeedbackList } from '../components/FeedbackPage.component'

const getFeedbackForm = (classId) => {
  return network.network('/api/feedback/list_form', { body: { classId: classId } })
}

const getFeedbackList = (classId, teamId) => {
  return network.network('/api/feedback/list_reply', { body: { classId: classId, teamId: teamId, type: "send" } })
}

export default class FeedbackPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamName: "",
      joins: [],
      form: "",
      feedBackFormText: "폼이 없습니다",
      feedbackList: []
    }
  }

  componentDidMount() {
    let classId = this.props.match.params.classId
    let teamId = this.props.match.params.teamId
    if (!classId || !teamId) {
      window.location = "/dashboard"
    }
    getFeedbackList(classId, teamId)
      .then(json => {
        this.setState({ feedbackList: json })
        console.log("feeback list는..")
        console.log(this.state.feedbackList)
      })
    getFeedbackForm(classId)
      .then(json => {
        console.log("폼은...")
        console.log(json)
        this.setState({ form: json })
      })
  }

  render() {
    return (
      <TeamTemplate match={this.props.match} history={this.props.history} >
        <div>
          <FeedbackForm feedBackFormText={this.state.form}></FeedbackForm>
        </div>
        <br></br>
        <FeedbackList feedbackList={this.state.feedbackList} ></FeedbackList>
      </TeamTemplate >
    );
  }
}