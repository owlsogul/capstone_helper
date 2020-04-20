import React, { Component } from 'react';
//import PropTypes from "prop-types";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class NavigationBar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/sign-in"}>로그인</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/sign-up"}>회원가입</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}
export default NavigationBar;