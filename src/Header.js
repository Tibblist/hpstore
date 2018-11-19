import React from 'react';
import {Link} from 'react-router-dom';
import { AuthService } from './backend/client/auth';
import { Paper, Button, Divider, Typography} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';

const styles = theme => ({
    container: {
        'height': 128,
        'margin-bottom': 10
    },
    leftnav: {
        'display': 'inline-block',
        'display': 'flex',
        'flex-direction': 'row',
        'align-items': 'flex-start'
    },
    rightnav: {
        'float': 'right',
        'display': 'inline-block',
    },
    button: {
        'display': 'inline-block',
        'vertical-align': 'top'
    }
});


class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            width: 0
        }
    }

    refCallback = element => {
        if (element) {
          var size = element.getBoundingClientRect()
          var width = size.width;
          if (width != this.state.width) {
            this.setState({
                width: width
            })
          }
        }
      };

    handleOpen = () => {
        this.setState({
            open: !this.state.open
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.container} elevation={10} square="true">
            <div className={classes.rightnav}>
                    {AuthService.isAuthed()
                        ? <Button size="large" component={Link} to="/account/orders">Account</Button>
                        : ''}
                    {AuthService.isAuthed()
                        ? <Button size="large" onClick={AuthService.logout} component={Link} to="/">Logout</Button>
                        : <Button size="large" component={Link} to="/login">Login</Button>}
                </div>
                <div className={classes.leftnav}>
                    <Link to="/" className={classes.button}>
                        <img src="https://imageserver.eveonline.com/Corporation/98523546_128.png" alt="Hole Puncher's Logo"></img>
                    </Link>
                    <Button size="large" component={Link} to="/">
                        Home
                    </Button>
                    <div className={classes.button}>
                        <div ref={this.refCallback}>
                            <Button size="large" onClick={this.handleOpen}>
                                <Typography align="center">Browse</Typography>
                            </Button>
                        </div>
                        <Collapse in={this.state.open}>
                            <Paper style={{'display': 'flex', 'flex-direction': 'column', 'vertical-align': 'top', 'width': this.state.width}}>
                                <Button onClick={this.handleOpen} component={Link} to="/store/hulls">Hulls</Button>
                                <Divider/>
                                <Button onClick={this.handleOpen} component={Link} to="/store/mods">Mods and Fighters</Button>
                                <Divider/>
                                <Button onClick={this.handleOpen} disabled component={Link} to="/store/sales">Sales</Button>
                                <Divider/>
                                <Button onClick={this.handleOpen} disabled component={Link} to="/store/fittings">Doctrine Fittings</Button>
                                <Divider/>
                                <Button onClick={this.handleOpen} disabled component={Link} to="/store/fittings/parser">Custom Fittings</Button>
                            </Paper>
                        </Collapse>
                    </div>
                    <Button size="large" component={Link} to="/contact-us">
                        Contact Us
                    </Button>
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