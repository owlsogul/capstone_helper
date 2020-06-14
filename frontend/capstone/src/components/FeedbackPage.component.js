import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import network from '../network/index';
import { array } from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

class FeedbackForm extends Component {
  render() {
    return (
      <div>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <div>평가폼 확인하기</div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              {JSON.stringify(this.props.feedBackFormText)}
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    )
  }
}

function SimpleExpansionPanel(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>{props.title}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            {props.body}
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

// title, key 받아오기
/*
[
  {title: 5주차 피드백,
  body: [{내용의흐름도:5, 내용: 어쩌구저쩌구}, {내용의흐름도:5, 내용: 어쩌구저쩌구}]
  },
  {title: 5주차 피드백,
  body: [{내용의흐름도:5, 내용: 어쩌구저쩌구}, {내용의흐름도:5, 내용: 어쩌구저쩌구}]
  }
  ]
  */

function MyExpansionPanel(props) {
  const classes = useStyles();
  console.log("안에는....")
  console.log(props)

  return (
    <div className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>{props.title}</Typography>

        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            {
              props.body.map(reply => {
                var body = reply.body
                return (
                  <div>
                    <div>평가 조 : {reply.targetTeamId}</div>
                    <div>[평가 내역]
                    {
                        Object.entries(body)
                          .sort((prev, next) => { // 이부분은 해도 되고 안해도 되고 문제 id로 정렬하는거
                            if (prev[0] < next[0]) return -1
                            else if (prev[0] == next[0]) return 0
                            else return 1
                          })
                          .map(([key, value]) => {
                            return (
                              <div>
                                {/* <div>문항 번호 {key}</div> */}
                                <div>{value.title} : {value.answer}</div>
                              </div>
                            )
                          })
                      }
                    </div>
                    <br>
                    </br>
                  </div>
                )
              })
            }
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}


class FeedbackList extends Component {

  constructor(props) {
    super(props)
    this.renderWeeks = this.renderWeeks.bind(this)
  }

  renderWeeks() {
    return this.props.feedbackList.map(feedback => {
      let formBody = feedback.FeedbackForm.body // form body json string
      let replyBody = feedback.FeedbackReplies.map(reply => {
        var formObj = JSON.parse(formBody)
        var replyObj = JSON.parse(reply.body)

        // form에다가 answer 항목 넣어서 전달.
        Object.keys(formObj).forEach(key => {
          if (replyObj[key]) {
            formObj[key].answer = replyObj[key]
          }
        })

        var retValue = {
          targetTeamId: reply.targetTeamId,
          teamId: reply.teamId,
          body: formObj
        }
        return retValue
      })
      return <MyExpansionPanel title={feedback.title} body={replyBody}></MyExpansionPanel>
    })
  }

  render() {
    var myArray = null
    var keys = null
    console.log("json은")
    console.log(this.props.feedbackList)
    var arr = [] // 제일 큰 array

    if (this.props.feedbackList && this.props.feedbackList.length > 0) {
      return (<>
        {this.renderWeeks()}
      </>)
    }
    else {
      console.log("여기여기여기")
      return <h6>보여줄 것이 없습니다.</h6>
    }
  }
}

class DefaultFeedbackList extends Component {
  render() {
    return <SimpleExpansionPanel title={this.props.title} body={this.props.body}></SimpleExpansionPanel>
  }
}
export { FeedbackForm, FeedbackList, DefaultFeedbackList, MyExpansionPanel }