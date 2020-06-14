import React, { Component } from 'react';
import ClassInfo from '../components/ClassInfo.component'
import ClassInfoList from '../components/ClassInfoList.component'
import { confirmAlert } from 'react-confirm-alert';
import ClassTemplate from "../components/ClassTemplate"
import network from "../network"
import { Table } from "react-bootstrap"
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { InputGroup, FormControl, Card } from "react-bootstrap"
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));


class ClassInfoPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      professor: {},
      member: [],
      lectureStatus: false,
      lectureName: "",
    }
  }

  getClassId() {
    return this.props.match.params.classId
  }

  // API get_current_lecture
  getCurrentLecture() {
    network.network("/api/lecture/get_current_lecture", { body: { classId: this.getClassId() } })
      .then(res => {
        console.log(res)
        this.setState({ lectureStatus: res, lectureId: res["lectureId"] })
      })
      .catch(err => {
        if (err.status == 409) this.setState({ lectureStatus: false })
        else console.log(err)
      })
  }

  // API get_class_member
  getClassMember() {
    network.network("/api/class/member", { body: { classId: this.getClassId() } })
      .then(member => {
        console.log(member)
        this.setState({ professor: member.targetClass, member: member.manages })
      })
      .catch(err => {
        console.log(err)
      })
  }

  startLecture(name) {
    network.network("/api/lecture/start_lecture", { body: { classId: this.getClassId(), lectureName: name } })
      .then(res => {
        alert("수업이 시작되었습니다.")
      })
      .catch(err => {
        if (err.status == 409) {
          alert("수업이 이미 진행중입니다.")
        }
        else console.log(err)
      })
      .finally(() => {
        window.location.reload()
      })
  }

  endLecture() {
    network.network("/api/lecture/end_lecture", { body: { classId: this.getClassId() } })
      .then(res => {
        alert("수업이 종료되었습니다.")
      })
      .catch(err => {
        if (err.status == 409) {
          alert("수업이 시작 되지 않았습니다.")
        }
        else console.log(err)
      })
      .finally(() => {
        window.location.reload()
      })
  }

  // 이 페이지가 불러와졌을 때 어떤일들을 할지
  componentDidMount() {

    // url에서 classId를 읽어오고 없을경우 dashboard로 이동
    let classId = this.props.match.params.classId
    if (!classId) window.location = "/dashboard"

    // classId에 맞는 수강자, 관리자들을 불러옴
    this.getClassMember()

    // 강의 정보를 가져옴
    this.getCurrentLecture()

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

  onClickLectureBtn(flag) {
    if (flag) { // 수업 시작
      this.startLecture(this.state.lectureName)
    }
    else { // 수업 종료
      this.endLecture()
    }
  }

  render() {

    const postList = this.state.member.map((post) => (
      <div>
        <div><b>{post.User.name}</b></div>
        <div>{post.user}</div>
        <div>{post.email}</div>
      </div>
    ))

    let lectureForm = (<div>
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>강의 이름: </InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          placeholder="ex) 1주차 캡스톤"
          value={this.state.lectureName}
          onChange={event => { console.log(event.target.value); this.setState({ lectureName: event.target.value }) }}
        />
        <InputGroup.Append>
          <Button variant="outline-primary" onClick={() => { this.onClickLectureBtn(true) }}>수업 시작</Button>
        </InputGroup.Append>
      </InputGroup>
    </div>)
    if (this.state.lectureStatus) {
      lectureForm = (<div>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>강의 이름: </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="ex) 1주차 캡스톤"
            value={this.state.lectureStatus.lectureName}
            contentEditable={false}
          />
          <InputGroup.Append>
            <Button variant="outline-danger" onClick={() => { this.onClickLectureBtn(false) }}>수업 종료</Button>
          </InputGroup.Append>
        </InputGroup>
      </div>)
    }

    return (
      <ClassTemplate match={this.props.match}>
        <div>
          <div style={{ height: "5rem" }}>
            <br></br>
          </div>
          <Card body>
            <div>
              <ul>
                <li>{this.state.lectureId}</li>
                {/* <a class="btn btn-light btn-lg" href="#" role="button">PDF 다운로드</a> */}
                <Button variant="contained" color="primary">강의 계획서 PDF 다운로드</Button>
              </ul>
            </div>
          </Card>
          <br></br><br></br><br></br><br></br>
          <Card body>
            <div>
              <ul>
                <h3>[수업 시작하기]</h3>
                {lectureForm}
              </ul>
            </div>
          </Card>
          <br></br><br></br><br></br><br></br>
          <Card body>
            <div>
              <h3>[관리자 정보]</h3>
            </div>
            <div>
              <div><b>{this.state.professor.professorName}</b></div>
              {this.state.professor.professor}
            </div>
            <div class="adminInfo" style={{ width: "30rem", margin: "auto" }}>
              {postList
            /*<ClassInfoList data={this.state.information} />*/}
            </div>
          </Card>
          <br></br><br></br><br></br><br></br>
          <div>
            <Button variant="contained" color="secondary" onClick={this.submit}>
              종강하기
            </Button>
          </div>
        </div>
      </ClassTemplate>

    )
  }
}

export default ClassInfoPage;