import React from 'react';
import './header.css';

export default class Header extends React.Component {
    render() {
        return (
        <header className="menu">
            <nav className="menu__navigation">
            <div></div>
            <div className="menu__logo"><a href="/">
            <img src="https://imageserver.eveonline.com/Corporation/98523546_128.png"></img>
            </a></div>
            <div className="spacer" />
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
                        <LoginButton></LoginButton>
                        <li className="menu_button"><a href="/">Browse</a></li>
                        <li className="menu_button"><a href="/">Contact Us</a></li>
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
                <li className="menu_button"><a href="/">Login</a></li>
            );
        } else {
            return (
                <li className="menu_button"><a href="/">Logout</a></li>
            );
        }
    }
}