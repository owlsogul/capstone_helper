import React, { Component } from 'react';
import ClassInfo from '../components/ClassInfo.component'
import ClassInfoList from '../components/ClassInfoList.component'
import { confirmAlert } from 'react-confirm-alert';

class ClassInfoPage extends Component {
  /*state = {
    information: [
      {
        name: '박상오',
        status: '[교수]',
        email: 'sang_o@cau.ac.kr',
      },
      {
        name: '김경찬',
        status: '[조교]',
        email: 'kckim@cau.ac.kr',
      },
    ]
  }*/

  //
  constructor(props) {
    super(props)
    this.state={
      information: []
    }
  }

  componentWillMount() {
    fetch('/api/class/member')
    .then(res => res.json())
    .then(data => this.setState({
      posts: data
    }))
  }
  //

  submit = () => {
    confirmAlert({
      title: '종강하기',
      message: '종강 후엔 조회만 가능합니다.종강하시겠습니까?',
      buttons: [
        {
          label: '네!',
          onClick: () => alert('한 학기동안 수고하셨습니다!')
        },
        {
          label: '아니오!',
          onClick: () => {}
        }
      ]
      
    })
  }

  render() {
    //
    const {posts} = this.state
    const postList = posts.map((post) => (
      <div>
        <div><b>{post.name}</b></div>
        <div>{post.status}</div>
        <div>{post.email}</div>
      </div>
    ))
    //
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
          <button class="btn btn-light btn-sm" style={{ marginLeft: "26rem" }}>수정</button>
        </div>
        <div class="adminInfo" style={{ width: "30rem", margin: "auto" }}>
          {/*<ClassInfoList data={this.state.information} />*/}
          {postList}
        </div>

        <br></br><br></br>
        <div>
          <button onClick={this.submit}>
            종강하기
          </button>
        </div>
      </div>
    )
  }
}

export default ClassInfoPage;