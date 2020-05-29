import React, { Component } from 'react';
import ui from '../ui.png'; 

import { Badge, Button } from "react-bootstrap"

export default class People extends Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    title: '중간고사 기간 수업 관련 공지',
    body: '이번 학기는 중간고사 기간에 따로 수업이 없습니다. 잘 확인하셔서 착오 없으시길 바랍니다. ',
    date: '1999-11-25',
  }

  render() {
    // badge 그리기
    let badge = <Badge variant="secondary">대기</Badge>
    if (this.props.takeStatus == 1) badge = <Badge variant="success">수강</Badge>

    // 버튼들 그리기
    let btns = 
      <td>
        <Button 
          variant="primary" 
          onClick={()=>{this.props.handleOper(this.props.userId, "A")}}
        >
          승인
        </Button>
        <Button 
          variant="danger"
          onClick={()=>{this.props.handleOper(this.props.userId, "D")}}
        >삭제</Button>
      </td>
    if (this.props.takeStatus == 1){
      btns = <td>
        <Button 
          variant="danger"
          onClick={()=>{this.props.handleOper(this.props.userId, "D")}}
        >삭제</Button>
      </td>
    }
    return (
      <tr>
        <td>
          {this.props.userId} {badge}
        </td>
        <td>
          {this.props.userName}
        </td>
        {btns}
      </tr>
    );
  }
}