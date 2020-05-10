import React, { Component } from 'react';
import '../App.css'

class ClassInfo extends Component {
    static defaultProps = {
        info: {
            name: '이름',
            status: '[직책]',
            email: 'xxx@cau.ac.kr',
        },
        
    }

    render() {
        const {
            name, status, email
        } = this.props.info

        return (
            <div className='classinfo-box'>
                <div><b>{name}</b></div>
                <div>{status}</div>
                <div>{email}</div>
            </div>
        )
    }
}

export default ClassInfo;