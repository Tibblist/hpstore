import React from 'react';
import {
    Redirect,
    Link
  } from 'react-router-dom';
import { AuthService } from '../../backend/client/auth';
import {CLIENT_ID} from '../../config';


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
      console.log(from);
      return (
        <div>
          <p>You must log in to view the page at: {from.pathname}</p>
          <a target="_blank" href={"https://login.eveonline.com/oauth/authorize/?response_type=code&redirect_uri=http%3A%2F%2Flocalhost:5000%2Fcallback&client_id=" + CLIENT_ID +"&scope=publicData&state=" + from.pathname}>
            <button>Log in</button>
          </a>
        </div>
      );
    }
}