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
              {this.props.feedBackFormText}
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
              // props.body.map((e) => {
              //   Object.keys(e)
              // }).map(key => {
              //   return <h3>{key + "는" + e[key]}</h3>
              // })
              JSON.stringify(props.body)
            }
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}


class FeedbackList extends Component {
  render() {
    var myArray = null
    var keys = null
    console.log("json은")
    console.log(this.props.json)
    var arr = [] // 제일 큰 array

    if (this.props.json != null) {
      console.log("여기로 잘 옴!!!")
      this.props.json.forEach((e) => {
        keys = Object.keys(JSON.parse(e["FeedbackForm"]["body"]))
        var bodyArr = []
        e["FeedbackReplies"].forEach((k) => {
          var finalArr = []
          keys.forEach(key => {
            var obj = {}
            console.log(key)
            console.log(JSON.parse(k["body"])[key])
            obj[key] = JSON.parse(k["body"])[key]
            finalArr.push(obj)
          })
          bodyArr.push(finalArr)
        })
        arr.push({ "title": e["title"], "body": bodyArr })
      })
      myArray = arr
      return (
        <div>
          {
            myArray.map((e) => {
              return <MyExpansionPanel title={e.title} body={e.body}></MyExpansionPanel>
            })
          }
        </div>
      )
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