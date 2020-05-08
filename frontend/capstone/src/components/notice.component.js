import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

const ComplexList = () => (
  <ul>
    {list.map(item => (
      <div class="jumbotron">
        <h1 class="display-6">{item.title}</h1>
        <hr class="my-4"></hr>
        <h3>{item.body}</h3>
        <div>{item.date}</div>
        <a class="btn btn-primary btn-lg" href="#" role="button">수정</a>
        <a class="btn btn-primary btn-lg" href="#" role="button">삭제</a>
      </div>
    ))}
  </ul>
);

const list = [
  {
    title: '중간고사 기간 수업 관련 공지',
    body: '이번 학기는 중간고사 기간에 따로 수업이 없습니다. 잘 확인하셔서 착오 없으시길 바랍니다. ',
    date: '1999-11-25',
  },
  {
    title: '과제 생성 공지  ',
    body: '과제가 2개 생성되었으니 학생들은 eclass를 확인하기 바랍니다. ',
    date: '1999-11-25',
  },
];
export default ComplexList;