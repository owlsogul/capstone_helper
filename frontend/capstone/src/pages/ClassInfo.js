import React, { Component } from 'react';
import ClassInfo from '../components/ClassInfo.component'
import ClassInfoList from '../components/ClassInfoList.component'

class ClassInfoPage extends Component {
  state = {
    information: [
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
    ]
  }

  render() {
    return (
      <div>
        <div style={{ height: "5rem" }}>
          <br></br>
        </div>
        <div>
          <ul>
            <h2>강의계획서</h2>
            <a class="btn btn-light btn-lg" href="#" role="button">PDF 다운로드</a>
          </ul>
        </div>
        <br></br><br></br>
        <div>
          <h2>관리자 정보</h2>
          <button style={{ marginLeft: "25rem" }}>수정</button>
        </div>
        <div class="adminInfo" style={{ width: "30rem", margin: "auto" }}>
          <ClassInfoList data={this.state.information} />
        </div>

        <br></br><br></br>
        <div>
          <button onClick={(e) => this.handleClick(e)}>
          종강하기
          </button>
        </div>
      </div>
    )
  }
}

export default ClassInfoPage;