import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import './index.css';

class Store extends React.Component {
    render() {
        return (
        <div>
            <Header/>
            Secondary Text!
        </div>
    );}
}

ReactDOM.render(<Store />, document.getElementById('root'));
