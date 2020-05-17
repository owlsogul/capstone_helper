import React, { Component } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {Table, Button} from "react-bootstrap"
export class AssistLinkList extends Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    default: "만들어진 조교 초대 링크가 없습니다.",
    list: []
  }

  render() {
    return (
      <Table striped>
        <thead>
          <tr>
            <th>초대 코드</th>
            <th>만료 일자</th>
            <th>삭제하기</th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.list.map((takes, idx)=>(
              <tr key={idx}>
                <td>{takes.code}</td>
                <td>{takes.expiredDate}</td>
                <td><a class="btn btn-primary btn-lg" href="#" role="button">삭제</a></td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    )
  }
}

export class StudentLinkList extends Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    default: "만들어진 학생 초대 링크가 없습니다.",
    list: []
  }

  render() {
    return (
      <Table striped>
            <thead>
              <tr>
                <th>초대 코드</th>
                <th>만료 일자</th>
                <th>자동 허락 여부</th>
                <th>삭제하기</th>
              </tr>
            </thead>
            <tbody>
              {
                this.props.list.map((takes, idx)=>(
                  <Link
                    key={idx}
                    code={takes.code}
                    expiredDate={takes.expiredDate}
                    isAutoJoin={takes.isAutoJoin.toString()}
                  />
                ))
              }
            </tbody>
          </Table>
    )
  }
}

export default class Link extends Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    title: '중간고사 기간 수업 관련 공지',
    body: '이번 학기는 중간고사 기간에 따로 수업이 없습니다. 잘 확인하셔서 착오 없으시길 바랍니다. ',
    date: '1999-11-25',
  }

  render() {
    // 버튼들 그리기
    let btns = 
      <td>
        <Button 
          variant="danger"
          onClick={()=>{this.props.handleOper(this.props.userId, "D")}}
        >삭제</Button>
      </td>
    return (
      <tr>
        <td>
          {this.props.code}
        </td>
        <td>
          {this.props.expiredDate}
        </td>
        <td> 
          {this.props.isAutoJoin}
        </td>
        {btns}
      </tr>
    );
  }
}