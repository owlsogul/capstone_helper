import React from 'react';
import './App.css';
//import PropTypes from "prop-types";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import NavigationBar from './components/NavigationBar';

import Login from './components/login.component';
import SignUp from './components/signup.component';

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar></NavigationBar>
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Switch>
              <Route exact path='/' component={Login} />
              <Route path="/sign-in" component={Login} />
              <Route path="/sign-up" component={SignUp} />
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App;