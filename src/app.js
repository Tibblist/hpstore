import React from 'react';
import Header from './Header';
import { Route } from 'react-router-dom';
import Home from './components/views/home';
import Store from './components/views/store';
import Login from './components/views/login';
import CssBaseline from '@material-ui/core/CssBaseline';
import './css/app.css';

class App extends React.Component {
    render() {
        return (
        <div>
            <CssBaseline/>
            <Header/>
            <Route path="/" exact component={Home}/>
            <Route path="/store" component={Store}/>
            <Route path="/login" component={Login}/>
        </div>
        );
    }
}

export default App;