import React, { Component } from 'react';
import TeamTemplate from "../components/TeamTemplate"
import network from "../network"
import {DefaultFeedbackList} from '../components/FeedbackPage.component'

const getListFeedback = (classId, teamId) => {
  return network.network('/api/feedback/list_reply', { body: { classId: classId, teamId: teamId, type: "receive" } })
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
        this.setState({ posts: json })
      })
  }

  render() {
    return (
      <TeamTemplate match={this.props.match} history={this.props.history}>
        <div>
          {this.state.posts.map((e) => {
            return <DefaultFeedbackList title={e.body} body={e.FeedbackPost.FeedbackForm.body}></DefaultFeedbackList>
          })}
        </div>
      </TeamTemplate>
    );
  }
}