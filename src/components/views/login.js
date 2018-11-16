import React from 'react';
import {
    Redirect,
    Link
  } from 'react-router-dom';
import { AuthService } from '../../backend/client/auth';
import {CLIENT_ID, SERVER_URL} from '../../config';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    img: {
      'display': 'block',
      'margin-left': 'auto',
      'margin-right': 'auto',
    },
    text: {
      'text-align': 'center'
    }
});
class Login extends React.Component {
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
      const {classes} = this.props;
  
      if (redirectToPreviousRoute) {
        return <Redirect to={from} />;
      }
      console.log(from);
      return (
        <div>
          <p className={classes.text}>You must log in to view the page at: {from.pathname}</p>
          <a href={"https://login.eveonline.com/oauth/authorize/?response_type=code&redirect_uri=http%3A%2F%2F" + SERVER_URL +"%2Fcallback&client_id=" + CLIENT_ID +"&scope=publicData&state=" + from.pathname}>
            <img className={classes.img} alt="Log in" src="https://web.ccpgamescdn.com/eveonlineassets/developers/eve-sso-login-black-large.png"></img>
          </a>
        </div>
      );
    }
}

export default withStyles(styles)(Login);