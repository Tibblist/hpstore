import React from 'react';
import Header from './Header';
import { Route, Redirect } from 'react-router-dom';
import Home from './components/views/home';
import Store from './components/views/store';
import Login from './components/views/login';
import Account from './components/views/account';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AuthService } from './auth';
import './css/app.css';

const SecretRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        AuthService.isAuthed === true
        ? <Component {...props} />
        : <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }} />
    )} />
  );

class App extends React.Component {
    render() {
        return (
        <div>
            <CssBaseline/>
            <Header/>
            <Route path="/" exact component={Home}/>
            <Route path="/store" component={Store}/>
            <SecretRoute path="/account" component={Account}></SecretRoute>
            <Route path="/login" component={Login}/>
        </div>
        );
    }
}

export default App;