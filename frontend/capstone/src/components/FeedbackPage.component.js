import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import network from '../network/index';

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
  a = props.questionsAndAnswers[Object.keys(props.questionsAndAnswers)]
  console.log(a) // [Log] {질문1: "발표를 잘했나요?", 질문2: "발표 자료의 완성도는 어땠나요?"} (main.chunk.js, line 1203)
  console.log(Object.keys(a)) // [Log] ["질문1", "질문2"] (2) (main.chunk.js, line 1204)
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
              Object.keys(a).map((key)=>{
                return <li>{key+':'+ a[key]}</li>
              })
            }
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}


class FeedbackList extends Component {
  render() {
    console.log("더미는")
    console.log(this.props.questionsAndAnswers)
    // return <h1> hello </h1>
    return (
      <div>
        {this.props.questionsAndAnswers["questionsAndAnswers"].map((key, index, array) => {
          // 한주차 씩
          console.log("body는")
          console.log(index)
          console.log(Object.keys(key)[0])
          console.log(array[index][Object.keys(key)[0]][0].body[index])
          return <MyExpansionPanel week={Object.keys(key)[0]} questionsAndAnswers={array[index][Object.keys(key)[0]][0].body[index]} count={array[index][Object.keys(key)[0]][1].count}></MyExpansionPanel>
        })}
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