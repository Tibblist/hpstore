import React from 'react';
import {Link} from 'react-router-dom';
import './css/header.css';
import { AuthService } from './auth';

export default class Header extends React.Component {
    render() {
        return (
        <header className="menu">
            <nav className="menu__navigation">
            <div></div>
            <Navigation/>
            </nav>
        </header>
        );
    }
}

class Navigation extends React.Component {
    render() {
        return (
            <div className="navbar_navigation-items">
                <ul>
                        <div className="menu_logo"><a href="/">
                            <img src="https://imageserver.eveonline.com/Corporation/98523546_128.png" alt="Hello"></img>
                        </a></div>
                        <LoginButton></LoginButton>
                        <li className="menu_button"><Link to="/store">Browse</Link></li>
                        <li className="menu_button"><Link to="/">Contact Us</Link></li>
                        <div className="username">Welcome {getName()}</div>
                </ul>
            </div>
        );
    }
}

class LoginButton extends React.Component {
    render() {
        if (AuthService.isAuthed() === false) {
            return (
                <li className="menu_button"><Link to="/login">Login</Link></li>
            );
        } else {
            return (
                <li className="menu_button"><a href="/" onClick={AuthService.logout}>Logout</a></li>
            );
        }
    }
}

function getName() {
    if (AuthService.isAuthed() === true) {
        return <div className="username">{AuthService.getName()}</div>
    } else {
        return <div className="username">Guest</div>
    }
}