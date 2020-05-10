import React, { Component } from 'react';
import LeftNavigationBar from "./LeftNavigationBar"
import AccountInfo from "./AccountInfo.component"
import "../App.css"

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isShowExtension: false 
    }
    this.handleItemSelect = this.handleItemSelect.bind(this)
    this.toggleAccountInfo = this.toggleAccountInfo.bind(this)
  }

  toggleAccountInfo(shown){
    let show = !this.state.isShowExtension
    if (shown != null) show = shown

    this.setState({ isShowExtension: show })
  }

  handleItemSelect(item){
    console.log(item)
    if (item === "User") this.toggleAccountInfo()
    else {
      this.toggleAccountInfo(false)
      if (item === "Dashboard") this.props.history.push('/dashboard')
      else if (item === "Message") this.props.history.push('/message')
    }
  }

  render() {
    let leftExtensionFlag = "dashboard-left-extension"
    if (this.state.isShowExtension) leftExtensionFlag += " show-extension"
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-left">
            <LeftNavigationBar initState={ this.props.initState } onItemSelected={this.handleItemSelect}/>
          </div>
          <div className={leftExtensionFlag}>
            <AccountInfo 
              userId={ "userId" }
            />
          </div>
          <div className="dashboard-body">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}