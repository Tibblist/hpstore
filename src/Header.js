import React from 'react';
import {Link} from 'react-router-dom';
import './css/header.css';

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
                            <img src="https://imageserver.eveonline.com/Corporation/98523546_128.png"></img>
                        </a></div>
                        <LoginButton></LoginButton>
                        <li className="menu_button"><Link to="/store">Browse</Link></li>
                        <li className="menu_button"><Link to="/">Contact Us</Link></li>

                </ul>
            </div>
        );
    }
}

class LoginButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false
        }
    }

    render() {
        if (this.state.isLoggedIn === false) {
            return (
                <li className="menu_button"><Link to="/login">Login</Link></li>
            );
        } else {
            return (
                <li className="menu_button"><a href="/">Logout</a></li>
            );
        }
    }
}