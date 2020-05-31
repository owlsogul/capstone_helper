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
}


class MessageClassList extends Component {
  listGroupClicked = (classes) => (
    this.props.listGroupClickedCallBack(classes.classId)
  )

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div style={style.leftHalf}>
        <ListGroup>
          {this.props.takeClassList.map((classes) => (
            <ListGroup.Item action onClick={() => { this.listGroupClicked(classes) }}>
              {classes.className}
            </ListGroup.Item>
          ))}
          {this.props.manageClassList.map((classes) => (
            <ListGroup.Item action onClick={() => { this.listGroupClicked(classes) }}>
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
    console.log("메세지가 보내짐@@")
    this.props.sendMsg(this.props.classId, this.state.writingMessage)
      .then(res => console.log("나의 결과는" + res))
      .then(console.log("결과를 알려줘...."))
  }

  render() {
    if (this.props.classId == -1) {
      return (
        <div style={style.rightHalf}>
          <h6> 수업을 선택해 주세요.</h6>
        </div>
      )
    } else {
      console.log(this.props.classId)
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
          {this.props.messages.map((message) => (
            <h6>{message.body}</h6>
          ))}
        </div>
      )
    }
  }
}

export { MessageClassList, MessageList }