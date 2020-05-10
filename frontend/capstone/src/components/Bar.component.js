import React, { Component } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export default class Bar extends Component {
  constructor(props) {
    super(props);
    this.state = { }
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container">
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link">과목명</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link">수업중 아님</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link">공지사항</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={"/sign-in"}>조 정보</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={"/sign-up"}>수업 정보</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    );
  }
}