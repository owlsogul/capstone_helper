import React, { Component } from 'react'
import ClassInfo from './ClassInfo.component'

class ClassInfoList extends Component {
    static defaultProps = {
        data: []
    }


    render() {
        const { data } = this.props;
        const list = data.map(
            info => (<ClassInfo info={info} />)
        )

        return (
            <div>
                {list}
            </div>
        )
    }
}

export default ClassInfoList;
