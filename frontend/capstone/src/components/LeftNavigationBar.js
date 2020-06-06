import React, { Component } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

const style = {

  container: {
    backgroundColor: "rgb(1, 116, 183)",
    minHeight: "100%",
    padding: 10,
  },

  selectedContainer: {
    marginBottom: 10,
    backgroundColor: "#ffffff",
    borderRadius: 5,
  },

  icon: {
    width: 50,
    height: 50
  },

  iconContainer:{
    paddingTop: 5,
    textAlign: "center"
  },

  itemContainer: {
    marginBottom: 10
  }
}

class NavItem extends Component {

  constructor(props){
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick(){
    if (this.props.onClick) {
      this.props.onClick(this.props.title)
    }
  }


  render(){
    let containerStyle = this.props.isSelected ? style.selectedContainer : style.itemContainer 

    return (
      <div className="nav-item" style={ containerStyle } onClick={this.onClick}>
        <div className="nav-item-icon" style={ style.iconContainer }>
          <img 
            style={ style.icon }
            src={ this.props.icon }
          />
        </div>
        <div className="nav-item-title">
          {this.props.title}
        </div>
      </div>
    )
  }

}

/**
 * props:
 *  initState:
 *    처음 선택되어있을 목록. User, Dashboard, Message 순이다.
 *  onItemSelected: 
 *    Item이 Select되었을 때 호출되는 callback 함수
 *    (User, Dashboard, Message가 param으로 전달됨)
 */
class NavigationBar extends Component {

  constructor(props){
    super(props)
    this.onClick = this.onClick.bind(this)

    let initState = this.props.initState ? this.props.initState : [ false, false, false ]
    this.state = {
      items: initState
    }
  }

  onClick(clickedTitle){
    let selectCallback = this.props.onItemSelected ? this.props.onItemSelected : ()=>{}
    if (clickedTitle === "User"){
      this.setState({ items: [ true, false, false ] })
      selectCallback("User")
    }
    else if (clickedTitle === "Dashboard"){
      this.setState({ items: [ false, true, false ] })
      selectCallback("Dashboard")
    }
    else if (clickedTitle === "Message"){
      this.setState({ items: [ false, false, true ] })
      selectCallback("Message")
    }
  }

  render() {
    return (
      <div className="container" style={ style.container }>
        <NavItem 
          title={"User"} 
          icon={"/asset/icon-profile.png"} 
          isSelected={this.state.items[0]} 
          onClick={this.onClick}
        />
        <NavItem 
          title={"Dashboard"} 
          icon={"/asset/icon-dashboard.png"} 
          isSelected={this.state.items[1]}
          onClick={this.onClick}
        />
        <NavItem 
          title={"Message"} 
          icon={"/asset/icon-message.png"} 
          isSelected={this.state.items[2]}
          onClick={this.onClick}
        />
      </div>
    )
  }

}
export default NavigationBar;