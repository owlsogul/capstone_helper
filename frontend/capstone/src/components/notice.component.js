import React, { Component } from 'react';
import Moment from 'react-moment';
import 'moment-timezone';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

class ComplexList extends Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    title: '중간고사 기간 수업 관련 공지',
    body: '이번 학기는 중간고사 기간에 따로 수업이 없습니다. 잘 확인하셔서 착오 없으시길 바랍니다. ',
    date: '1999-11-25',
    list: []
  }

  render() {
    return (
      <ul>
        {this.props.list.map(item => (
          <div class="jumbotron">
            <h3>{item.title}</h3>
            <hr class="my-4"></hr>
            <h5>{item.body}</h5>
            <div><Moment format={"YYYY.MM.DD"}>{item.writtenDate}</Moment> (<Moment fromNow>{item.writtenDate}</Moment>)</div>
            {/* <a class="btn btn-primary btn-lg" href="#" role="button">수정</a>
            <a class="btn btn-primary btn-lg" href="#" role="button">삭제</a> */}
          </div>
        ))}
      </ul>
    )
  }
}

export default ComplexList;