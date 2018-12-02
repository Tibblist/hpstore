import React from 'react';
import Header from './Header';
import {Route, Switch} from 'react-router-dom';
//Route view imports
import Home from './components/views/home';
import Store from './components/views/store';
import Login from './components/views/login';
import Account from './components/views/account';
import JumpFreight from './components/views/jump-freight';
import OrderStatus from "./components/views/order-status";
import ContactUs from './components/views/contact-us'
//Imports for snackbar
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import green from '@material-ui/core/colors/green';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
//End snackbar imports
import CssBaseline from '@material-ui/core/CssBaseline';
import {AuthRoute, getUserInfo} from './backend/client/auth';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-129885093-1');

const variantIcon = {
    success: CheckCircleIcon,
    error: ErrorIcon,
    info: InfoIcon,
  };

const styles = theme => ({
    success: {
      backgroundColor: green[600],
    },
    error: {
      backgroundColor: theme.palette.error.dark,
    },
    info: {
      backgroundColor: theme.palette.primary.dark,
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing.unit,
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    },
  });

  const MySnackbarContentWrapper = withStyles(styles)(MySnackbarContent);

  function MySnackbarContent(props) {
    const { classes, className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];
  
    return (
      <SnackbarContent
        className={classNames(classes[variant], className)}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
            <Icon className={classNames(classes.icon, classes.iconVariant)} />
            {message}
          </span>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={onClose}
          >
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]}
        {...other}
      />
    );
  }

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            userSettings: {
                character: '',
                location: ''
            },
            open: false,
            message: '',
            type: ''
        };
    }

    componentDidMount() {
        getUserInfo();
    }
    
    componentWillUnmount() {
        localStorage.removeItem("Cart");
    }

    showSnackbar = (message, type) => {
        /*
        Allowed types are:
        error
        success
        info
        */
       console.log(message + type);
        this.setState({ 
            open: true,
            message: message,
            type: type
        },
        () => {
            console.log("Changed state to open")
        });
      };
    
    handleClose = (event, reason) => {    
        this.setState({ open: false });
    };

    render() {
        ReactGA.pageview(window.location.pathname + window.location.search);
        return (
        <div>
            <CssBaseline/>
            <Header/>
            <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/store" component={Store}/>
                <AuthRoute path="/account" component={Account}></AuthRoute>
                <Route path="/contact-us" component={ContactUs}></Route>
                <Route path="/login" component={Login}/>
                <Route path="/freight" component={JumpFreight}/>
                <Route path="/orderstatus/:id?" render={(routeProps) => (
                    <OrderStatus {...routeProps} messageFunction={this.showSnackbar}/>
                )}/>
                <Route /*component={ ADD 404 COMPONENT HERE }*//>
            </Switch>
            <Snackbar
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            open={this.state.open}
            autoHideDuration={6000}
            onClose={this.handleClose}
            >
                <MySnackbarContentWrapper
                    onClose={this.handleClose}
                    variant={this.state.type}
                    message={this.state.message}
                />
            </Snackbar>
        </div>
        );
    }
}

export default App;