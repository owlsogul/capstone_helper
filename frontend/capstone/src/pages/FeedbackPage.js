import React, { Component } from 'react';
import TeamTemplate from "../components/TeamTemplate"
import network from "../network"
import { FeedbackForm, FeedbackList } from '../components/FeedbackPage.component'

const getFeedbackForm = (classId) => {
  return network.network('/api/feedback/get_last_post', { body: { classId: classId } })
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
      feedBackFormText: "폼이 없습니다",
      feedbackList: null
    }
  }

  componentWillMount() {
    let classId = this.props.match.params.classId
    let teamId = this.props.match.params.teamId
    if (!classId || !teamId) {
      window.location = "/dashboard"
    }
    network.network("/api/team/get_team", {
      body: { classId: classId, teamId: teamId }
    })
      .then(team => {
        console.log(team)
        this.setState({
          teamName: team.teamName,
          joins: team.Joins,
          githubUrl: team.githubUrl
        })
      })

    getFeedbackList(this.props.match.params.classId, this.props.match.params.teamId)
      .then(json => {
        console.log("피드백 리스트는...")
        console.log(json)
        json.forEach((e) => {
          console.log("각각은...")
          console.log(e)
        })
        this.setState({ feedbackList: json })
        console.log("feeback list는..")
        console.log(this.state.feedbackList)
      })
  }

  render() {
    return (
      <TeamTemplate match={this.props.match} history={this.props.history} >
        <div>
          <FeedbackForm feedBackFormText={this.state.feedBackFormText}></FeedbackForm>
          <br></br>
        </div>

        {/* {this.state.feedbackList.map((e) => { */}
        {/* })} */}

        {/* <FeedbackList questionsAndAnswers = { dummy } ></FeedbackList> */}
        <FeedbackList json={this.state.feedbackList} ></FeedbackList>
      </TeamTemplate >
    );
  }
}