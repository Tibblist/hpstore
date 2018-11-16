import React from 'react';
import {Link} from 'react-router-dom';
import { AuthService } from './backend/client/auth';
import { Paper, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    container: {
        'height': 128,
        'margin-bottom': 10
    },
    leftnav: {
        'display': 'inline-block',
    },
    rightnav: {
        'float': 'right',

    },
    button: {
        'display': 'inline-block',
        'vertical-align': 'top'
    }
});


class Header extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.container} elevation={10} square="true">
                <div className={classes.leftnav}>
                    <Link to="/" className={classes.button}>
                        <img src="https://imageserver.eveonline.com/Corporation/98523546_128.png" alt="Hole Puncher's Logo"></img>
                    </Link>
                    <Button size="large" component={Link} to="/">
                        Home
                    </Button>
                    <Button size="large" component={Link} to="/store">
                        Browse
                    </Button>
                    <Button size="large" component={Link} to="/contact-us">
                        Contact Us
                    </Button>
                </div>
                <div className={classes.rightnav}>
                    {AuthService.isAuthed()
                        ? <Button size="large" component={Link} to="/account/orders">Account</Button>
                        : ''}
                    {AuthService.isAuthed()
                        ? <Button size="large" onClick={AuthService.logout} component={Link} to="/">Logout</Button>
                        : <Button size="large" component={Link} to="/login">Login</Button>}
                </div>
            </Paper>
        )
    }
}

export default withStyles(styles)(Header);

/*export default class Header extends React.Component {
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
                        <div className="menu_logo"><Link to="/">
                            <img src="https://imageserver.eveonline.com/Corporation/98523546_128.png" alt="Hello"></img>
                        </Link></div>
                        <LoginButton></LoginButton>
                        {accountTab()}
                        <li className="menu_button"><Link to="/store">Browse</Link></li>
                        <li className="menu_button"><Link to="/contact-us">Contact Us</Link></li>
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
                <li className="menu_button"><Link to="/" onClick={AuthService.logout}>Logout</Link></li>
            );
        }
    }
}

function getName() {  //Exists to check if they have logged in or not and display either their name or guest
    if (AuthService.isAuthed() === true) {
        return <div className="username">{AuthService.getName()}</div>
    } else {
        return <div className="username">Guest</div>
    }
}

function accountTab() {
    if (AuthService.isAuthed() === true) {
        return <li className="menu_button"><Link to="/account/orders">Account</Link></li>
    } else {
        return ''
    }
}*/