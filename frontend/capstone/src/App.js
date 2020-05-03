import React from 'react';
import './App.css';
//import PropTypes from "prop-types";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Login from './components/login.component';
import SignUp from './components/signup.component';
import wait from './components/wait';
import OpenClass from './components/openclass.componet';
import RedirectingComponent from './components/RedirectingComponent.js';
import Notice from './components/notice.component.js';

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar></NavigationBar>
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Switch>
              <Route exact path='/' component={RedirectingComponent} />
              <Route path="/sign-in" component={Login} />
              <Route path="/sign-up" component={SignUp} />
              <Route path="/wait" component={wait} />
              <Route path="/open-class" component={OpenClass} />
              <Route path="/notice" component={Notice} />
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App;