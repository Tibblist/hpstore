import { Route, Redirect } from 'react-router-dom';
import React from 'react';
import Cookies from 'js-cookie';

export const Groups = Object.freeze({
    MEMBER: 1,
    BUILDER: 2,
    ADMIN: 3,
});

export class AuthService {

      static getName() {
          return Cookies.get('name');
      }

      static isAuthed() {
        console.log(Cookies.get('token'));

        if (Cookies.get('token') != undefined) {
            return true;
        } else {
            return false;
        }
      }

      static getToken() {
          return Cookies.get('token');
      }

      static logout() {
          console.log("Logged out!");
          Cookies.remove('token');
          Cookies.remove('name');
      }

      static isAdmin() {
          return parseInt(Cookies.get('group'), 10) === 3;
      }

      static isBuilder() {
          console.log(Cookies.get('group'));
        return parseInt(Cookies.get('group'), 10) > 1;
      }
}

export const AuthRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        AuthService.isAuthed() === true
        ? <Component {...props} {...rest}/>
        : <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }} />
    )} />
);
