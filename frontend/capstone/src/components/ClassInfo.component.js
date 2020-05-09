import React, { Component } from 'react';
import '../App.css'

class ClassInfo extends Component {
    static defaultProps = {
        info: {
            name: '이름',
            status: '[직책]',
            email: 'xxx@cau.ac.kr',
            address: '제 2공학관 5xx호'
        },
        
    }

    render() {
        const {
            name, status, email, address
        } = this.props.info

        return (
            <div className='classinfo-box'>
                <div><b>{name}</b></div>
                <div>{status}</div>
                <div>{email}</div>
                <div>{address}</div>
            </div>
        )
    }
}

export default ClassInfo;