import React from 'react';
import logo from './logo.svg';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
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
import TeamInfoPage from './pages/TeamInfoPage';

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar></NavigationBar>
        <Switch>
          <Route exact path='/' component={RedirectingComponent} />
          <Route path="/open-class" component={OpenClass} />
          <Route path="/notice" component={NoticePage} />
          <Route path="/sign-in" component={Login} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/wait" component={wait} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/classinfo" component={ClassInfoPage} />
          <Route path="/students" component={StudentList} />
          <Route path="/writenotice" component={WriteNoticePage} />
          <Route path="/teaminfo" component={TeamInfoPage} />
        </Switch>
      </div >
    </Router >
  )
}


export default App;
