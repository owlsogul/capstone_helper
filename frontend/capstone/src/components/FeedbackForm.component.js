import React, { Component } from 'react';
import '../App.css'

class FeedbackForm extends Component {
    static defaultProps = {
        info: {
            teamnumber: '0조',
            name: '이름',
            score: '[점수]',
            feedback: 'string',
        },
    }
    
}