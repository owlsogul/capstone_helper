import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

const ComplexList = () => (
  <ul>
    {list.map(item => (
      <div class="jumbotron">
        <h1 class="display-4">{item.title}</h1>
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
    title: '아아 긴급한 공지사항이 있습니다',
    body: '종강까지 d-100',
    date: '1999-11-25',
  },
  {
    title: '마이크테스트 원투',
    body: '과제가 왜이렇게 많아',
    date: '1999-11-25',
  },
];
export default ComplexList;