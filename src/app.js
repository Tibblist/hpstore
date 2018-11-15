import React from 'react';
import Header from './Header';
import {Route} from 'react-router-dom';
import Home from './components/views/home';
import Store from './components/views/store';
import Login from './components/views/login';
import Account from './components/views/account';
import ContactUs from './components/views/contact-us'
import CssBaseline from '@material-ui/core/CssBaseline';
import {AuthRoute} from './backend/client/auth';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            userSettings: {
                character: '',
                location: ''
            }
        };
    }


    render() {
        return (
        <div>
            <CssBaseline/>
            <Header/>
            <Route path="/" exact component={Home}/>
            <Route path="/store" component={Store}/>
            <AuthRoute path="/account" component={Account}></AuthRoute>
            <Route path="/contact-us" component={ContactUs}></Route>
            <Route path="/login" component={Login}/>
        </div>
        );
    }
}

export default App;