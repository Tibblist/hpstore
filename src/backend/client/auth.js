import { Route, Redirect } from 'react-router-dom';
import React from 'react';



var _authed = false;
var _name = "";
var _isAdmin = false;

export const Groups = Object.freeze({
    MEMBER: 1,
    BUILDER: 2,
    ADMIN: 3,
});

export class AuthService {

      static getName() {
          return _name;
      }

      static isAuthed() {
        console.log("Is user authed: " + _authed);
        return _authed;
      }

      static authenticate(name) {
          console.log("Authenticated user: " + name);
          _name = name;
          _authed = true;
      }

      static logout() {
          console.log("Logged out!");
          _authed = false;
      }

      static isAdmin() {
          return _isAdmin;
      }
}

export const AuthRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        AuthService.isAuthed() === true
        ? <Component {...props} />
        : <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }} />
    )} />
);
