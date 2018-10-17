import React from 'react';
import Header from './Header';
import { Route, Redirect } from 'react-router-dom';
import Home from './components/views/home';
import Store from './components/views/store';
import Login from './components/views/login';
import Account from './components/views/account';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AuthRoute} from './backend/auth';

class App extends React.Component {
    render() {
        return (
        <div>
            <CssBaseline/>
            <Header/>
            <Route path="/" exact component={Home}/>
            <Route path="/store" component={Store}/>
            <AuthRoute path="/account" component={Account}></AuthRoute>
            <Route path="/login" component={Login}/>
        </div>
        );
    }
}

export default App;