import React from 'react';
import {
    Redirect,
    Link
  } from 'react-router-dom';
import { AuthService } from '../../backend/client/auth';

export default class Login extends React.Component {
    state = {
      redirectToPreviousRoute: false
    };
  
    login = () => {
      AuthService.authenticate("Tibblist");
      this.setState({ redirectToPreviousRoute: true });
    };
  
    render() {
      const { from } = this.props.location.state || { from: { pathname: "/" } };
      const { redirectToPreviousRoute } = this.state;
  
      if (redirectToPreviousRoute) {
        return <Redirect to={from} />;
      }
  
      return (
        <div>
          <p>You must log in to view the page at: {from.pathname}</p>
          <Link to="https://login.eveonline.com/oauth/authorize/?response_type=code&redirect_uri=https%3A%2F%2Fstore.holepunchers.space%2Fcallback&client_id=3rdpartyClientId&scope=characterContactsRead%20characterContactsWrite&state=uniquestate123">
          <button onClick={this.login}>Log in</button>
          </Link>
        </div>
      );
    }
}