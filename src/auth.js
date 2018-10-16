import { Route, Redirect } from 'react-router-dom';
import React from 'react';
var _authed = false;
var _name = "";

export class AuthService {
      constructor() {
        console.log("Contructor for AuthService ran!");
      }

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
