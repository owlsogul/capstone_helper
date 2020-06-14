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

function MyExpansionPanel(props) {
  const classes = useStyles();
  var a = null;
  var b = null;
  var v = null;
  a = props.questionsAndAnswers[Object.keys(props.questionsAndAnswers)]
  // console.log(a) // [Log] {질문1: "발표를 잘했나요?", 질문2: "발표 자료의 완성도는 어땠나요?"} (main.chunk.js, line 1203)
  // console.log(Object.keys(a)) // [Log] ["0", "1"] (2) (main.chunk.js, line 1204)

  // for (var i = 0; i < Object.keys(a).length; i++) {
  //   for (var j = 0; j < Object.keys(a[key]).length; j++) {
  //     return (
  //       <div>
  //         <li>set</li>
  //         <form>a[key][set]</form>
  //       </div>
  //     )
  //   }
  // }
  return (
    <div className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>{props.week}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            <Pagination count={props.count} color="primary"></Pagination>
            {
              Object.keys(a).map((key) => {
                // console.log(key)
                return key;
              }).map((set) => {
                console.log(set)
                console.log(a[set]) // [Log] {질문2: "발표를 잘했나요?", 답변1: "예"} (main.chunk.js, line 1285)
                return `${a[set]}`
              })
              // .map((each)=>{
              //   Object.keys(each) // [["0", "1", "2"], ["0", "1", "2"]] (2)
              // }).map((v)=>{
              //   return <h1>{v}</h1>
              // })
            }
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}


class FeedbackList extends Component {
  render() {
    var keys = null
    console.log("json은")
    console.log(this.props.json)
    var arr = [] // 제일 큰 array

    if (this.props.json != null) {
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
      this.props.json.forEach((e) => {
        var bodyArray = []
        console.log("타이틀은")
        console.log(e["title"])
        console.log(e["FeedbackForm"]["body"])
        keys = Object.keys(JSON.parse(e["FeedbackForm"]["body"]))
        console.log("키는")
        console.log(keys)
        console.log("질문들은")
        keys.forEach((key)=>{
          console.log("각각의 키는")

          console.log(JSON.parse(e["FeedbackForm"]["body"])[key])
          console.log(JSON.parse(e["FeedbackForm"]["body"])[key].title) // 내용의 흐름도
          console.log(JSON.parse(e["FeedbackForm"]["body"])[key].type)
          
        })

        e["FeedbackReplies"].forEach((k) => {
          console.log("reply는")
          console.log(k["body"])
          // console.log(k["body"]["_1"]) // 어쩌구 저쩌구 
          keys.forEach(key=>{
            console.log(key)
            console.log(JSON.parse(k["body"])[key]) // 어쩌구 저쩌구 
            var obj = {}
            obj[key] = JSON.parse(k["body"])[key]
            bodyArray.push(obj)
            // bodyArray.push({{key}: k["body"][key]})
          })
        })
        arr.push({"title": e["title"], "body": bodyArray}) // 5주차 피드백
      })
      console.log("///////////////")
      console.log(arr)
    }
    return (
      <div>
        {/* {this.props.json.forEach((e)=>{
          console.log(e["title"])
          return <MyExpansionPanel week={e["title"]}></MyExpansionPanel>
        })} */}
        <h1>hello!</h1>
      </div>
    )
  }
}

class DefaultFeedbackList extends Component {
  render() {
    return <SimpleExpansionPanel title={this.props.title} body={this.props.body}></SimpleExpansionPanel>
  }
}
export { FeedbackForm, FeedbackList, DefaultFeedbackList }