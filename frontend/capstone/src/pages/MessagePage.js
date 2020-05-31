import React, { Component } from 'react';
import network from "../network/index";
import Dashboard from "../components/Dashboard.component";
import { MessageList, MessageClassList } from '../components/MessgePage.component';

// 학생들의 메세지 목록을 호출하는 API
function getMessage() {
  return network.network('/api/message/get_message', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
}

// 수업 관리자들에게 메시지를 보내는 API
function sendMessage(classId, body) {
  return network.network('/api/message/send_message', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: { classId: classId, body: body },
  })
}

// 수업 목록 불러오기
const loadClass = () => {
  return network.network("/api/class/list", { method: "GET" })
}

export default class MessagePage extends Component {
  constructor(props) {
    super(props);
    this.state = { classId: -1, takeClassList: [], manageClassList: [], messages: [] }
    this.myCallBack = this.myCallBack.bind(this)
  }

  componentDidMount() {
    loadClass()
      .then((res) => {
        console.log(res)
        let takeClassList = []
        let manageClassList = []

        if (res.take) {
          takeClassList = takeClassList.concat(res.take.map(e => {
            return {
              classId: e.classId,
              className: e.Class.className,
            }
          }));
        }

        if (res.manage) {
          manageClassList = manageClassList.concat(res.manage.map(e => {
            return {
              classId: e.classId,
              className: e.Class.className,
            }
          }));
        }

        if (res.own) {
          manageClassList = manageClassList.concat(res.own.map(e => {
            return {
              classId: e.classId,
              className: e.Class.className,
            }
          }));
        }
        this.setState({ takeClassList: takeClassList, manageClassList: manageClassList })
      })
      .then(json => {
        console.log(json)
      })
      .catch(err => {
        console.log(err)
      })
  }

  myCallBack(classId) {
    this.setState({ classId: classId })
    getMessage().then((res) => {
      this.setState({ message: res[classId] })
      console.log(this.state.message)
    })
  }

  render() {
    return (
      <Dashboard initState={[false, false, true]} history={this.props.history}>
        <MessageClassList takeClassList={this.state.takeClassList} manageClassList={this.state.manageClassList} listGroupClickedCallBack={
          this.myCallBack
        }></MessageClassList>
        <MessageList classId={this.state.classId} messages={this.state.messages} sendMsg={sendMessage}></MessageList>
      </Dashboard>
    )
  }
}