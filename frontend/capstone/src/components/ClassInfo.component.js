import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

const ClassInfoList = () => (
    <ul>
        <div>
            <ul>
                <h1>강의계획서</h1>
                <a class="btn btn-primary btn-lg" href="#" role="button">다운로드</a>
            </ul>
        </div>
        <br></br>
        <div class="adminInfo">
            <h1 class="display-6">관리자 정보</h1>
            <hr class="my-4"></hr>
            <h3>{list.}</h3>
            <div>{item.date}</div>
        </div>
        )}
    </ul>
);

const list = [
    {
        name: '박상오',
        status: '[교수]',
        email: 'sang_o@cau.ac.kr',
        address: '제 2공학관 5xx호'
    },
    {
        name: '김경찬',
        status: '[조교]',
        email: 'kckim@cau.ac.kr',
        address: '제 2공학관 5xx호'
    },
];

export default ClassInfoList;