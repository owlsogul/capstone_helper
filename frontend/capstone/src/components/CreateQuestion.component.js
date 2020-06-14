import React, { Component } from 'react'

class Question extends Component {
    static defaultProps = {
        feedback: {
            contents: '평가항목',
            id: 0
        }
    }

    /* handleChange = (e) => {
        this.setState({
            contents: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.onCreate(this.state);
        this.setState({
            contents: ''
        })
    } */


    render() {
        const {
            contents, id
        } = this.props.feedback

        let radioid = this.props.radioid
        return(
            <div className="row">
                {this.props.options.map(function(option) {
                    return (
                        <div key={radioid} className="column">
                            <label>{option}</label>
                            <input type="radio" name={radioid} value={option}/>
                        </div>
                    )
                })}
            </div>
        )

        return (
            <form onSubmit={this.handleSubmit}>
                <p>
                    <strong>
                        <input
                            placeholder="평가 항목"
                            // value={this.state.contents}
                            //onChange={this.handleChange
                            contents="contents"
                        />
                    </strong>
                    <input type="radio" name="index_score" value='1'>1</input>
                    <input type="radio" name="index_score" value='2'>2</input>
                    <input type="radio" name="index_score" value='3'>3</input>
                    <input type="radio" name="index_score" value='4'>4</input>
                    <input type="radio" name="index_score" value='5'>5</input>
                </p>
            </form>
        )
    }
}

export default Question