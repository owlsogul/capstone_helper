import React, { Component } from 'react'
import Question from './CreateQuestion.component'

class QuestionList extends Component {
    static defaultProps = {
        data: []
    }

    render() {
        const { data } = this.props
        const list = data.map(
            feedback => (<Question feedback={feedback}/>)
        )
        return (
            <div>
                {list}
            </div>
        )
    }
}

export default QuestionList