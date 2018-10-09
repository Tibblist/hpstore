import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import Header from './Header';
import './index.css';

class App extends React.Component {
    render() {
        return (
        <div>
            <Header/>
            {this.props.children}
        </div>
    );}
}

ReactDom.render(
    <Router history={browserHistory} routes={routes} />,
    document.querySelector('#app')
  );