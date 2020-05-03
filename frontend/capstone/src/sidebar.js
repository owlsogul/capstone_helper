import React, { Component } from 'react';
import './App.css';
import Drawer from '@material-ui/core/Drawer';



class Sidebar extends React.Component {
  state = {
    isSidebarExpanded: false
  };

  sidebarExpanded = () => (
    <Drawer className="sidebar" open={this.state.isSidebarExpanded}>
    <div className="sidebar">
      <span
        role="presentation"
      >
        <button className="btn" onClick={() => this.setState({ isSidebarExpanded: false })}>이전</button>
      </span>
      <ul>
        <li>로그아웃</li>
        <li>회원탈퇴</li>
      </ul>
    </div>
    </Drawer>
  );

  sidebarCollapsed = () => (
    <div className="sidebar collapsed">
      <span
        role="presentation"
      >
        <img src='data:image/png;base64,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' width='80px' height='80px' />
      </span>
      <ul>
        <li>
          <button className="btn" onClick={() => this.setState({isSidebarExpanded: true})}>계정정보</button>
        </li>
        <li>
          <button className="btn">대시보드</button>
        </li>
        <li>
          <button className="btn">메시지함</button>
        </li>
      </ul>
    </div>
  );

  render() {
    const { isSidebarExpanded } = this.state;

    return (
      <div className="app">
        {isSidebarExpanded && this.sidebarExpanded()}
        {isSidebarExpanded || this.sidebarCollapsed()}
      </div>
    );
  }
}


export default Sidebar;