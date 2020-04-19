import React from 'react';
import logo from './logo.svg';
import './App.css';
//import PropTypes from "prop-types";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import Login from './login.component';
import SignUp from './signup.component';



function App() {
  return (<Router>
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="contatiner">
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


      <div className="auth-wrapper">
        <div className="auth-inner">
          <Switch>
            <Route exact path='/' component={Login} />
            <Route path="/sign-in" component={Login} />
            <Route path="/sign-up" component={SignUp} />
          </Switch>
        </div>
      </div>
    </div> </Router>
  )
}

export default App;



/*
const foodILike = [
  {
    id : 1,
    name: "kimchi",
    image:
    "https://t1.daumcdn.net/liveboard/Magazine543/18267aeb115e4e2db1f6cd8d5cc1e9e2.png",
    rating: 5
  },
  {
    id : 2,
    name: "soondae",
    image:
    "https://t1.daumcdn.net/liveboard/Magazine543/18267aeb115e4e2db1f6cd8d5cc1e9e2.png",
    rating: 3
  },
  {
    id : 3,
    name: "baek",
    image:
    "https://t1.daumcdn.net/liveboard/Magazine543/18267aeb115e4e2db1f6cd8d5cc1e9e2.png",
    rating: 4.5
  },
  {
    id : 4,
    name: "dduck",
    image:
    "https://t1.daumcdn.net/liveboard/Magazine543/18267aeb115e4e2db1f6cd8d5cc1e9e2.png",
    rating: 3.9
  }
]



function Food({name, picture, rating}) {
  return (
    <div>
      <h2>I like {name}</h2>
      <h4>{rating} / 5.0</h4>
      <img src={picture} alt={name}/>
    </div>
  )
}



Food.sexyTypes = {
  name: PropTypes.string.isRequired,
  picture: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired
};



function App() {
  return(
  <div>
    {foodILike.map(dish => (
      <Food
        key={dish.id}
        name={dish.name}
        picture={dish.image}
        rating={dish.rating}
      />
    ))}
  </div>
  )
}

export default App;
*/