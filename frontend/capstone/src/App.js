import React from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Login from './pages/LoginPage';
import SignUp from './pages/SignUpPage';
import wait from './pages/Wait';
import OpenClass from './pages/OpenClass'
import RedirectingComponent from './components/RedirectingComponent.js';
import NoticePage from './pages/NoticePage.js';
import DashboardPage from "./pages/DashboardPage"
import ClassInfoPage from './pages/ClassInfo';
import StudentList from './pages/StudentList';
import WriteNoticePage from './pages/WriteNoticePage';
import TeamPage from './pages/TeamPage';
import TeamInfoPage from './pages/TeamInfoPage';

import ManageLinkPage from './pages/ManageLinkPage';

import JoinPage from './pages/JoinPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path='/' component={RedirectingComponent} />
          <Route path="/open-class" component={OpenClass} />
          <Route path="/sign-in" component={Login} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/wait" component={wait} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/writenotice" component={WriteNoticePage} />
          <Route path="/:classId/notice" component={NoticePage} />
          <Route path="/:classId/classinfo" component={ClassInfoPage} />
          <Route path="/:classId/students" component={StudentList} />
          <Route exact path="/:classId/teams" component={TeamPage} /> 
          <Route path="/:classId/manageLink" component={ManageLinkPage} /> 

          <Route path="/:classId/teams/:teamId" component={TeamInfoPage} /> 

          <Route path="/join/:code" component={JoinPage} /> 
          
        </Switch>
      </div >
    </Router >
  )
}

export default App;
