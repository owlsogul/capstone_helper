import React, { Component } from 'react';
import CreateClassForm from "../components/openclass.component"
import InviteStudentForm from "../components/openclass.component"

export default class OpenClass extends Component {

  constructor(props) {
      super(props);
      this.state = { currentScene: /*""*/"class" }
  }

  changeScene(newScene) {
      this.setState({ currentScene: newScene })
  }

  render() {
      let form = this.state.currentScene === "class" ?
          (<CreateClassForm changeScene={this.changeScene.bind(this)} />) :
          (<InviteStudentForm changeScene={this.changeScene.bind(this)} />)

      return (
          <div className="auth-wrapper">
              <div className="auth-inner">
                  <div>
                      {form}
                  </div>
              </div>
          </div>
      );
  }
}
