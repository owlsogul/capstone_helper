import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';

const ComplexList = () => (
  <ul>
    {list.map(item => (
      <li key={item.id}>
        <h1>{item.title}</h1>
        <h3>{item.body}</h3>
        <div>{item.date}</div>
      </li>
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

/*
class Notice extends Component {
  render() {
    return (
      <Accordion defaultActiveKey="0">
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              Click me!
      </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>Hello! I'm the body</Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="1">
              Click me!
      </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="1">
            <Card.Body>Hello! I'm another body</Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    )
  }
}

export default Notice;
*/