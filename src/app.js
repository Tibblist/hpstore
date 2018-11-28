import React from 'react';
import Header from './Header';
import {Route, Switch} from 'react-router-dom';
import Home from './components/views/home';
import Store from './components/views/store';
import Login from './components/views/login';
import Account from './components/views/account';
import JumpFreight from './components/views/jump-freight';
import ContactUs from './components/views/contact-us'
import CssBaseline from '@material-ui/core/CssBaseline';
import {AuthRoute} from './backend/client/auth';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-129885093-1');

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
    
    componentWillUnmount() {
        localStorage.removeItem("Cart");
    }

    render() {
        ReactGA.pageview(window.location.pathname + window.location.search);
        return (
        <div>
            <CssBaseline/>
            <Header/>
            <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/store" component={Store}/>
                <AuthRoute path="/account" component={Account}></AuthRoute>
                <Route path="/contact-us" component={ContactUs}></Route>
                <Route path="/login" component={Login}/>
                <Route path="/freight" component={JumpFreight}/>
            </Switch>
        </div>
        );
    }
}

export default App;