import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper, List, ListItem, ListItemText, Typography, Button, TextField, Select } from '@material-ui/core';
import { AuthService } from '../../backend/client/auth';
import { Link, Redirect } from 'react-router-dom';

const request = require('superagent');

const styles = theme => ({
    root: {

    },
    container: {
        'margin-left': '20%',
        'margin-right': '20%',
        'margin-top': '10px',
        'display': 'flex',
        'flex-direction': 'column',
    },
    text: {
        'width': '50%',
        'display': 'flex',
        'flex-direction': 'column',
        'margin-right': 'auto',
        'margin-left': 'auto',
        'align-content': 'center',
        'margin-top': '5px',
    },
    button: {
        'display': 'block',
        'margin-left': 'auto',
        'margin-right': 'auto',
        'margin-top': '20px',
        'margin-bottom': '20px'
    },
    label: {
        'margin-top': '10px',
        'text-align': 'center',
        'font-size': '20px',
        'margin-bottom': '10px'
    }
});

const numberWithCommas = (x) => {
    if (x === null) {
        return null;
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class OrderStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: {},
            submitted: false,
            orderID: ''
        }
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.fetchData(this.props.match.params.id);
        }
    }

    componentWillReceiveProps(newProps) {
        //console.log("Old id: " + this.props.match.params.id + " New id: " + newProps.match.params.id);
        if (newProps.match.params.id && this.props.match.params.id !== newProps.match.params.id) {
            this.fetchData(newProps.match.params.id);
        }
    }

    fetchData = (id) => {
        //console.log(this.props.match.params.id);
        if (id === 0) {
            return;
        }
        request
        .get("/api/orderStatus")
        .set('Authorization', AuthService.getToken())
        .query({id: id})
        .end((err, res) => {
            if (res.body === null) {
                return;
            }
            if (res.body.status === -1) {
                this.props.messageFunction("Could not find order ID! Please try another.", "error");
                this.resetState();
                return;
            }
            //console.log(res.body)
            var newOrder = res.body;
            newOrder.status = parseInt(res.body.status, 10);
            this.setState({
                order: newOrder,
                submitted: true
            })
        });
    }

    resetState = () => {
        this.setState({
            order: {},
            submitted: false,
            orderID: ''
        });
    }

    setOrderID = (event) => {
        this.setState({
            orderID: event.target.value
        });
    }

    render() {
        const { classes } = this.props;

        if (!this.state.submitted) {
            return (
                <Paper className={classes.container}>
                    <TextField style={{width: 250}} className={classes.text} value={this.state.orderID} label="Enter Order ID" onChange={this.setOrderID}/>
                    <Button variant="contained" className={classes.button} component={Link} to={"/orderstatus/" + this.state.orderID}>Submit</Button>
                </Paper>
            )
        }


        return (
            <div className={classes.root}>
                <Paper className={classes.container}>
                    <Typography align="center" className={classes.label}>Viewing order #{this.state.order.id}</Typography>
                    <List className={classes.text}>
                        {this.state.order.items.map((item, id) => {
                            return (
                                <ListItem key={id}>
                                    <ListItemText>{item.name}</ListItemText>
                                    <ListItemText>{numberWithCommas(item.price)} ISK</ListItemText>
                                    <ListItemText>x{item.quantity}</ListItemText>
                                </ListItem>
                            )
                        })}
                    </List>
                    <Typography className={classes.label} align="center">Builder: {this.state.order.builder ? this.state.order.builder : "Unclaimed"}</Typography>
                    <Typography className={classes.label} align="center">Price: {numberWithCommas(Math.round(this.state.order.price)) + " ISK"}</Typography>
                    <Typography className={classes.label} align="center">Expected Delivery Date: {this.state.order.expectedDate}</Typography>
                    <Typography className={classes.label} align="center">Delivery Location: {this.state.order.location}</Typography>
                    <Typography className={classes.label} align="center">Delivery Character: {this.state.order.character}</Typography>
                    <Typography className={classes.label} align="center">Status: {showStatus(this.state.order.status)}</Typography>
                </Paper>
            </div>
        );
    }
}

function showStatus(value) {
    switch (value) {
        case 1:
            return "Confirming Payment"
        case 2:
            return "In Build"
        case 3:
            return "Build delayed"
        case 4:
            return "Rejected"
        case 5:
            return "Delivered"
        default:
            return "ERROR NO STATUS"
    }
}

export default withStyles(styles)(OrderStatus);