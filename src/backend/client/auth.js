import { Route, Redirect } from 'react-router-dom';
import React from 'react';
import Cookies from 'js-cookie';

const request = require('superagent');

export class AuthService {

      static getName() {
          if (localStorage.getItem('name')) {
            return localStorage.getItem('name');
          } else {
              return "Guest";
          }
      }

      static isAuthed() {

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
          localStorage.removeItem('group');
          localStorage.removeItem('name');
      }

      static isAdmin() {
          return parseInt(localStorage.getItem('group'), 10) === 3;
      }

      static isBuilder() {
        return parseInt(localStorage.getItem('group'), 10) > 1;
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

export function getUserInfo() {
    console.log("Getting users information")
    request
        .get("/api/userInfo")
        .end((err, res) => {
            if (err) {
                console.log(err);
                return;
            }

            if (res.body === null) {
                console.log("You are not authenticated yet!");
                return;
            }
            localStorage.setItem('name', res.body.name);
            localStorage.setItem('group', res.body.group);
        })
}
