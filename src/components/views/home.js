import React from 'react';
import { DB } from '../../backend/db';


export default class Home extends React.Component {

    testCount() {
        DB.testCount();
    }

    render() {
        return (
            <div>
                Hello World!
                <button onClick={this.testCount}>
                    Click me!
                </button>
                <CountView count={DB.getCount()}></CountView>
            </div>
        );
    }
}

class CountView extends React.Component {
    render() {
        return (
            <div>props:{this.props.count}</div>
        );
    }
}