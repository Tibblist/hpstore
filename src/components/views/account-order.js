import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { AuthService } from '../../backend/client/auth';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';

const request = require('superagent');

const styles = theme => ({
    container: {
        'margin-left': '20%',
        'margin-right': '20%',
        'margin-top': '10px'
    },
    text: {
        'width': '25%',
        'margin-left': '40%',
        'margin-right': '37.5%',
        'margin-top': '5px'
    },
    label: {
        'margin-top': '10px',
        'text-align': 'center',
    },
    menuItem: {
        //'background-color': 'black'
    },
    menu: {
        'color': 'black'
    },
    button: {
        'display': 'block',
        'margin-left': 'auto',
        'margin-right': 'auto',
        'margin-top': '20px'
    }
});

class AccountReports extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: {} 
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(props) {
        console.log(this.state);
    }

    fetchData = () => {
        //console.log(this.props.match.params.id);
        request
        .get("/api/getOrder")
        .set('Authorization', AuthService.getToken())
        .query({id: this.props.match.params.id})
        .end((err, res) => {
            if (res.body === undefined) {
                return;
            }
            //console.log(res.body)
            var newOrder = res.body;
            newOrder.status = parseInt(res.body.status, 10);
            this.setState({
                order: res.body
            })
        });
    }

    postOrder = () => {
        request
        .post("/api/postOrderUpdate")
        .set('Authorization', AuthService.getToken())
        .send(this.state.order)
        .retry(2)
        .end((err, res) => {
            if (err) {
                console.log(err);
            }
        })
    }

    handlePriceChange = (event) => {
        var newOrder = this.state.order;
        newOrder.price = event.target.value;
        this.setState({
            order: newOrder
        })
    }

    /*handleBuyerChange = (event) => {
        var newOrder = this.state.order;
        newOrder.buyer = event.target.value;
        this.setState({
            order: newOrder
        })
    }*/

    handleBuilderChange = (event) => {
        var newOrder = this.state.order;
        newOrder.builder = event.target.value;
        this.setState({
            order: newOrder
        })
    }

    handleAmountPaidChange = (event) => {
        var newOrder = this.state.order;
        newOrder.amountPaid = event.target.value;
        this.setState({
            order: newOrder
        })
    }

    handleEndDateChange = (event) => {
        var newOrder = this.state.order;
        newOrder.endDate = event.target.value;
        this.setState({
            order: newOrder
        })
    }

    handleDeliveredDateChange = (event) => {
        var newOrder = this.state.order;
        newOrder.deliveredDate = event.target.value;
        this.setState({
            order: newOrder
        })
    }

    handleLocationChange = (event) => {
        var newOrder = this.state.order;
        newOrder.location = event.target.value;
        this.setState({
            order: newOrder
        })
    }

    handleCharacterChange = (event) => {
        var newOrder = this.state.order;
        newOrder.character = event.target.value;
        this.setState({
            order: newOrder
        })
    }

    handleStatusChange = (event) => {
        console.log("Changing status to: " + event.target.value);
        var newOrder = this.state.order;
        newOrder.status = event.target.value;
        this.setState({
            order: newOrder
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.container}>
                <Typography className={classes.label}>Editing order #{this.state.order.id}</Typography>
                <Typography className={classes.label}>Price: </Typography>
                <TextField 
                    className={classes.text} 
                    value={this.state.order.price} 
                    placeholder={String(this.state.order.price)}
                    onChange={(e) => this.handlePriceChange(e)}>
                </TextField>
                <Typography className={classes.label}>Builder: </Typography>
                <TextField 
                    className={classes.text} 
                    value={this.state.order.builder} 
                    placeholder={String(this.state.order.builder)}
                    onChange={(e) => this.handleBuilderChange(e)}>
                </TextField>
                <Typography className={classes.label}>Amount Paid: </Typography>
                <TextField 
                    className={classes.text} 
                    value={this.state.order.amountPaid} 
                    placeholder={String(this.state.order.amountPaid)}
                    onChange={(e) => this.handleAmountPaidChange(e)}>
                </TextField>
                <Typography className={classes.label}>Expected Delivery Date: </Typography>
                <TextField 
                    className={classes.text} 
                    value={this.state.order.endDate} 
                    placeholder={String(this.state.order.endDate)}
                    onChange={(e) => this.handleEndDateChange(e)}>
                </TextField>
                <Typography className={classes.label}>Delivered on Date: </Typography>
                <TextField 
                    className={classes.text} 
                    value={this.state.order.deliveredDate} 
                    placeholder={String(this.state.order.deliveredDate)}
                    onChange={(e) => this.handleDeliveredDateChange(e)}>
                </TextField>
                <Typography className={classes.label}>Location to be delivered to: </Typography>
                <TextField 
                    className={classes.text} 
                    value={this.state.order.location} 
                    placeholder={String(this.state.order.location)}
                    onChange={(e) => this.handleLocationChange(e)}>
                </TextField>
                <Typography className={classes.label}>Character to be delivered to: </Typography>
                <TextField 
                    className={classes.text} 
                    value={this.state.order.character} 
                    placeholder={String(this.state.order.character)}
                    onChange={(e) => this.handleCharacterChange(e)}>
                </TextField>
                <FormControl className={classes.text}>
                    <Select
                        value={this.state.order.status}
                        onChange={(e) => this.handleStatusChange(e)}
                        inputProps={{
                        name: 'Delivery Status',
                        id: 'status',
                        }}
                        className={classes.menu}
                    >
                    <MenuItem className={classes.menuItem} value={1}>
                    Confirming Payment
                    </MenuItem>
                    <MenuItem className={classes.menuItem} value={2}>In Build</MenuItem>
                    <MenuItem className={classes.menuItem} value={3}>Build Delayed</MenuItem>
                    <MenuItem className={classes.menuItem} value={4}>Rejected</MenuItem>
                    <MenuItem className={classes.menuItem} value={5}>Delivered</MenuItem>
                    </Select>
                </FormControl>
                <Button className={classes.button} variant="contained" onClick={this.postOrder}>Save</Button>
            </Paper>
        );
    }
}

export default withStyles(styles)(AccountReports);