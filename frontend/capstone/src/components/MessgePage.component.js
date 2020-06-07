import React, { Component } from 'react';
import { ListGroup } from "react-bootstrap"

const style = {
  leftHalf: {
    width: "50%",
    left: "0px",
    padding: "30px",
    backgroundColor: "#ffffff",
    height: "100%",
    borderRight: "1px solid black",
    position: "absolute",
  },
  rightHalf: {
    width: "50%",
    right: "0px",
    backgroundColor: "#dddddd",
    height: "100%",
    borderRight: "1px solid black",
    position: "absolute",
  },
  eachMessage: {
    padding: "30px",
    border: "1px solid black",
  },
  eachStudent: {
    width: "30%",
    border: "1px solid black",
  },
}

class MessageClassList extends Component {
  listGroupClicked(classes, boolValue) {
    this.props.listGroupClickedCallBack(classes.classId)
    this.props.setIsAdmin(boolValue)
  }

  constructor(props) {
    super(props)
    this.listGroupClicked = this.listGroupClicked.bind(this)
  }

  render() {
    return (
      <div style={style.leftHalf}>
        <ListGroup>
          {this.props.takeClassList.map((classes) => (
            <ListGroup.Item action onClick={() => { this.listGroupClicked(classes, false) }}>
              {classes.className}
            </ListGroup.Item>
          ))}
          {this.props.manageClassList.map((classes) => (
            <ListGroup.Item action onClick={() => { this.listGroupClicked(classes, true) }}>
              {classes.className}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    )
  }
}

class MessageList extends Component {
  state = {
    writingMessage: ""
  }

  handleTargetText = (e) => {
    this.setState({ writingMessage: e.target.value })
  }

  onClickButton = (e) => {
    this.props.sendMsg(this.props.classId, this.state.writingMessage)
    this.setState({ writingMessage: "" })
  }

  render() {
    if (this.props.classId == -1) {
      return (
        <div style={style.rightHalf}>
          <h6> 수업을 선택해 주세요.</h6>
        </div>
      )
    } else if (this.props.messages.length > 0) {
      console.log("메세지는")
      console.log(this.props.messages)
      return (
        <div style={style.rightHalf}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="메세지를 입력하세요"
              aria-label="메세지를 입력하세요"
              aria-describedby="button-addon2"
              value={this.state.writingMessage}
              onChange={this.handleTargetText}
            />
            <button onClick={this.onClickButton}>메세지 보내기</button>
          </div>
          {
            this.props.messages.map((message, index) => (
              <div>
                <EachMessage message={message}></EachMessage>
              </div>
            ))}
        </div>
      )
    } else {
      return (
        <div style={style.rightHalf}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="메세지를 입력하세요"
              aria-label="메세지를 입력하세요"
              aria-describedby="button-addon2"
              value={this.state.writingMessage}
              onChange={this.handleTargetText}
            />
            <button onClick={this.onClickButton}>메세지 보내기</button>
          </div>
          <h6> 기존 메시지가 없습니다.</h6>
        </div>
      )
    }
  }
}

class AdminMessageList extends Component {
  state = {
    writingMessage: ""
  }

  handleTargetText = (e) => {
    this.setState({ writingMessage: e.target.value })
  }

  onClickButton = (e) => {
    this.props.sendMsg(this.props.classId, this.state.writingMessage)
    this.setState({ writingMessage: "" })
  }

  render() {
    if (this.props.classId == -1) {
      return (
        <div style={style.rightHalf}>
          <h6> 수업을 선택해 주세요.</h6>
        </div>
      )
    } else if (this.props.student == "") {
      // 학생 선택 전
      var title = null
      {
        if (this.props.messages.length == 0) {
          title = <h6>메세지가 없습니다</h6>
        }
      }
      return (
        <div style={style.rightHalf}>
          {this.props.messages.map((person) => {
            return <EachStudent eachStudent={person}></EachStudent>
          })}
          {title}
        </div>
      )
    } else {
      return (
        <div style={style.rightHalf}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="메세지를 입력하세요"
              aria-label="메세지를 입력하세요"
              aria-describedby="button-addon2"
              value={this.state.writingMessage}
              onChange={this.handleTargetText}
            />
            <button onClick={this.onClickButton}>메세지 보내기</button>
          </div>

          {this.props.messages.forEach((person) => (
            // const [key, value] = messages
            // TODO: 여기서는 
            person.map((singleMessage) => (
              <div>
                <AdminEachMessage message={singleMessage}></AdminEachMessage>
              </div>
            ))
          ))}
        </div>
      )
    }
  }
}

class EachMessage extends Component {
  render() {
    if (this.props.message["msgType"] == 0) {
      // 내가 보낸것
      return (
        <div style={style.eachMessage} >
          <li> [나] </li>
          <li> {this.props.message["body"]} </li>
        </div>
      )
    } else {
      // 상대가 보낸것
      return (
        <div style={style.eachMessage} >
          <li> [상대] </li>
          <li> {this.props.message["body"]} </li>
        </div>
      )
    }
  }
}

class EachStudent extends Component {
  render() {
    return (
      <div style={style.eachStudent} >
        <li> {this.props.eachStudent} </li>
      </div>
    )
  }
}

class AdminEachMessage extends Component {
  render() {
    if (this.props.message["msgType"] == 0) {
      // 내가 보낸것
      return (
        <div style={style.eachMessage} >
          <li> [관리자] </li>
          <li> {this.props.message["body"]} </li>
        </div>
      )
    } else {
      // 상대가 보낸것
      return (
        <div style={style.eachMessage} >
          <li> [학생] </li>
          <li> {this.props.message["body"]} </li>
        </div>
      )
    }
  }
}

export { MessageClassList, MessageList, AdminMessageList, EachMessage, AdminEachMessage, EachStudent }