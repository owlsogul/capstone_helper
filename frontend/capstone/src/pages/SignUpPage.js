import React, { Component } from "react";
import {Congratulation, CommonRegister, SelectType} from '../components/signup.component';
import NavigationBar from '../components/NavigationBar'

export default class SignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displayScreen: "Select"
    }
    this.handleType = this.handleType.bind(this)
    this.onBackStep = this.onBackStep.bind(this)
    this.onSuccessRegister = this.onSuccessRegister.bind(this)
  }

  handleType(type) {
    this.setState({
      displayScreen: type === "PROF" ? "Prof" : "Stud"
    })
  }

  onBackStep() {
    this.setState({
      displayScreen: "Select"
    })
  }

  onSuccessRegister(type) {
    this.setState({
      displayScreen: type === "PROF" ? "SucProf" : "SucStud"
    })
  }


  render() {
    var content;
    if (this.state.displayScreen === "Select") {
      content = <SelectType onSelectType={this.handleType} />
    }
    else if (this.state.displayScreen === "Prof") {
      content = <CommonRegister appendix={"Prof"} onClickBack={this.onBackStep} onSuccessRegister={this.onSuccessRegister} />
    }
    else if (this.state.displayScreen === "Stud") {
      content = <CommonRegister appendix={"Stud"} onClickBack={this.onBackStep} onSuccessRegister={this.onSuccessRegister} />
    }
    else if (this.state.displayScreen === "SucProf") {
      content = <Congratulation target={"교수님"} />
    }
    else if (this.state.displayScreen === "SucStud") {
      content = <Congratulation target={"학생님"} />
    }

    return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <div>
          {content}
        </div>
      </div>
    </div>
    );
  }
}