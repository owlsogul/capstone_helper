import React, { Component } from 'react';
import network from "../network/index";
import Dashboard from "../components/Dashboard.component";
import { MessageList, MessageClassList, AdminMessageList } from '../components/MessgePage.component';

//// 학생용 
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

//// 관리자용
// 수업 관리자의 메세지 목록을 호출하는 API
function getClassMessage(classId) {
  return network.network('/api/message/get_class_message', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: { classId: classId },
  })
}

// 수업 관리자들이 메시지를 보내는 API
function sendReply(classId, receiver) {
  return network.network('/api/message/send_reply', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: { classId: classId, receiver: receiver },
  })
}

// 수업 목록 불러오기
const loadClass = () => {
  return network.network("/api/class/list", { method: "GET" })
}

export default class MessagePage extends Component {
  constructor(props) {
    super(props);
    this.state = { classId: -1, isAdmin: false, takeClassList: [], manageClassList: [], messages: [], student: ""  }
    this.studentSelectClass = this.studentSelectClass.bind(this)
    this.adminSelectClass = this.adminSelectClass.bind(this)
    this.sendMessageAnd = this.sendMessageAnd.bind(this)
    this.setIsAdmin = this.setIsAdmin.bind(this)
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
          this.setState({ isAdmin: true })
          manageClassList = manageClassList.concat(res.manage.map(e => {
            return {
              classId: e.classId,
              className: e.Class.className,
            }
          }));
        }

        if (res.own) {
          this.setState({ isAdmin: true })
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

  studentSelectClass(classId) {
    this.setState({ classId: classId })
    getMessage().then((res) => {
      console.log("getMessage의 결과는")
      if (res[classId] != undefined) {
        this.setState({ messages: res[classId] })
      }
    })
  }

  adminSelectClass(classId) {
    console.log("admin이 class선택함")
    this.setState({ classId: classId })
    getClassMessage(classId).then((res) => {
      console.log(res)
      // userId: [{}{}] userId2: [{}{}{}]
      var messages = {}
      var keys = Object.keys(res) // userId, userId2
      for (var i=0; i<keys.length; i++){
        var key = keys[i]
        messages[key] = res[key]
      }
      this.setState({ messages: messages })
    })
  }

  sendMessageAnd(classId, body) {
    sendMessage(classId, body)
      .then(() => {
        return getMessage()
      })
      .then((res) => {
        let a = this.state.classId
        console.log(a)
        this.setState({ messages: res[a] })
        console.log(this.state.message)
      })
  }

  setIsAdmin(boolValue) {
    this.setState({ isAdmin: boolValue })
  }

  render() {
    if (this.state.isAdmin == true) {
      // 관리자용
      return (
        <Dashboard initState={[false, false, true]} history={this.props.history}>
          <div style={{ overflow: 'scroll' }}>
            <MessageClassList takeClassList={this.state.takeClassList}
              manageClassList={this.state.manageClassList}
              listGroupClickedCallBack={this.adminSelectClass}
              setIsAdmin={this.setIsAdmin}
            ></MessageClassList>
            <AdminMessageList classId={this.state.classId} messages={this.state.messages} sendMsg={this.sendReply}></AdminMessageList>
          </div>
        </Dashboard>
      )
    }
    else return (
      // 학생용
      <Dashboard initState={[false, false, true]} history={this.props.history}>
        <div style={{ overflow: 'scroll' }}>
          <MessageClassList takeClassList={this.state.takeClassList}
            manageClassList={this.state.manageClassList}
            listGroupClickedCallBack={this.studentSelectClass}
            setIsAdmin={this.setIsAdmin}
          ></MessageClassList>
          <MessageList classId={this.state.classId} messages={this.state.messages} sendMsg={this.sendMessageAnd}></MessageList>
        </div>
      </Dashboard>
    )
  }
}