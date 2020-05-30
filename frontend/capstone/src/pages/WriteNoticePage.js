import React, { Component } from 'react'
import WriteNotice from '../components/WriteNotice.component'
import '../App.css'
import { useState } from 'react';
import NoticePage from './NoticePage'



export default class WriteNoticePage extends Component {
    constructor(props) {
        super(props);
        this.state = { currentScene: /*""*/"notice" }
    }
  
    changeScene(newScene) {
        this.setState({ currentScene: newScene })
    }
  
    render() {
        let form = this.state.currentScene === "notice" ?
            (<WriteNotice changeScene={this.changeScene.bind(this)} />) :
            (<NoticePage changeScene={this.changeScene.bind(this)} />)
  
        return (
            <div>
                <div>
                    <div>
                        {form}
                    </div>
                </div>
            </div>
        );
    }
  }