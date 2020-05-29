import React, { Component } from 'react'
import '../App.css'

class TeamInfo extends Component {
    render() {
        return (
            <div>
                <div>
                    <div className='myteam'>9조</div>
                    <div>
                        <div className='teamname'>
                            조민규 조예진 박민수
                        </div>
                        <div className='teamaddress'>
                            <a href='http://github.com'>
                                http://github.com
                            </a>

                        </div>
                    </div>
                    <h2>
                        <b>발표자료</b>
                    </h2>
                    <div className='teambutton'>
                        <button className='teambuttonmargin'>저장</button>
                        <button className='teambuttonmargin'>연동확인</button>
                    </div>
                    <div>
                        <div className='pptdocument'>6주차: upload</div>
                        <div className='pptdocument'>5주차: 5주차.pdf</div>
                        <div className='pptdocument'>4주차: 4주차.pdf</div>
                    </div>

                </div>
            </div>
        )
    }
}

export default TeamInfo