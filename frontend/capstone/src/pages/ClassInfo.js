import React, { Component } from 'react';
import ClassInfo from '../components/ClassInfo.component'
import ClassInfoList from '../components/ClassInfoList.component'
import { confirmAlert } from 'react-confirm-alert';
import ClassTemplate from "../components/ClassTemplate"
import network from "../network"

class ClassInfoPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      professor: {},
      member: []
    }
  }

  // 이 페이지가 불러와졌을 때 어떤일들을 할지
  componentDidMount(){

    // url에서 classId를 읽어오고 없을경우 dashboard로 이동
    let classId = this.props.match.params.classId
    if (!classId) window.location = "/dashboard"

    // classId에 맞는 수강자, 관리자들을 불러옴
    network.network("/api/class/member", { body: {classId: classId} })
      .then(member=>{
        console.log(member)
        this.setState({ professor: member.targetClass,member: member.manages })
      })
      .catch(err=>{
        console.log(err)
      })
  }

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
          onClick: () => { }
        }
      ]

    })
  }

  render() {
    
    const postList = this.state.member.map((post) => (
      <div>
        <div><b>{post.User.name}</b></div>
        <div>{post.user}</div>
        <div>{post.email}</div>
      </div>
    ))
    
    return (
      <ClassTemplate match={this.props.match}>
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
          </div>
          <div>
            <div><b>{this.state.professor.professorName}</b></div>
            {this.state.professor.professor}
          </div>
          <div class="adminInfo" style={{ width: "30rem", margin: "auto" }}>
            { postList
            /*<ClassInfoList data={this.state.information} />*/}
          </div>

          <br></br><br></br>
          <div>
            <button onClick={this.submit}>
              종강하기
            </button>
          </div>
        </div>
      </ClassTemplate>
      
    )
  }
}

export default ClassInfoPage;