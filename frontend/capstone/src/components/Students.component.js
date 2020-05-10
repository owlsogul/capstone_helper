import React, { Component } from 'react';
import ui from '../ui.png'; 


export default class Students extends Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    title: '중간고사 기간 수업 관련 공지',
    body: '이번 학기는 중간고사 기간에 따로 수업이 없습니다. 잘 확인하셔서 착오 없으시길 바랍니다. ',
    date: '1999-11-25',
  }

  render() {
    return (
      <ul>
        <image src={ui}/>
        <p>{this.props.takes}</p>
        <p>{this.props.targetClass}</p>
      </ul>
    );
  }
}