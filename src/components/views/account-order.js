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
        'margin-right': '37.5%'
    },
    label: {
        'margin-top': '10px',
        'text-align': 'center',
    },
    menuItem: {
        //'background-color': 'white'
    },
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

    fetchData = () => {
        request
        .get("/api/getOrder")
        .set('Authorization', AuthService.getToken())
        .query('id', this.props.match.params.id)
        .end((err, res) => {
            this.setState({
                order: res.body
            })
        });
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
        var newOrder = this.state.order;
        newOrder.character = event.target.value;
        this.setState({
            order: newOrder
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.container}>
                <Typography></Typography>
                <Typography className={classes.label}>Price: </Typography>
                <TextField 
                    className={classes.text} 
                    defaultValue={this.state.order.price} 
                    placeholder={String(this.state.order.price)}
                    onChange={(e) => this.handlePriceChange(e)}>
                </TextField>
                <Typography className={classes.label}>Builder: </Typography>
                <TextField 
                    className={classes.text} 
                    defaultValue={this.state.order.builder} 
                    placeholder={String(this.state.order.builder)}
                    onChange={(e) => this.handleBuilderChange(e)}>
                </TextField>
                <Typography className={classes.label}>Amount Paid: </Typography>
                <TextField 
                    className={classes.text} 
                    defaultValue={this.state.order.amountPaid} 
                    placeholder={String(this.state.order.amountPaid)}
                    onChange={(e) => this.handleAmountPaidChange(e)}>
                </TextField>
                <Typography className={classes.label}>Expected Delivery Date: </Typography>
                <TextField 
                    className={classes.text} 
                    defaultValue={this.state.order.endDate} 
                    placeholder={String(this.state.order.endDate)}
                    onChange={(e) => this.handleEndDateChange(e)}>
                </TextField>
                <Typography className={classes.label}>Delivered on Date: </Typography>
                <TextField 
                    className={classes.text} 
                    defaultValue={this.state.order.deliveredDate} 
                    placeholder={String(this.state.order.deliveredDate)}
                    onChange={(e) => this.handleDeliveredDateChange(e)}>
                </TextField>
                <Typography className={classes.label}>Location to be delivered to: </Typography>
                <TextField 
                    className={classes.text} 
                    defaultValue={this.state.order.location} 
                    placeholder={String(this.state.order.location)}
                    onChange={(e) => this.handleLocationChange(e)}>
                </TextField>
                <Typography className={classes.label}>Character to be delivered to: </Typography>
                <TextField 
                    className={classes.text} 
                    defaultValue={this.state.order.character} 
                    placeholder={String(this.state.order.character)}
                    onChange={(e) => this.handleCharacterChange(e)}>
                </TextField>
                <FormControl className={classes.text}>
                    <Select
                        value={this.state.order.status}
                        onChange={this.handleStatusChange}
                        inputProps={{
                        name: 'Delivery Location',
                        id: 'location',
                        }}
                        className={classes.menu}
                    >
                    <MenuItem className={classes.menuItem} value={1}>
                    <em>Confirming Payment</em>
                    </MenuItem>
                    <MenuItem className={classes.menuItem} value={2}>In Build</MenuItem>
                    <MenuItem className={classes.menuItem} value={3}>Build Delayed</MenuItem>
                    <MenuItem className={classes.menuItem} value={4}>Rejected</MenuItem>
                    </Select>
                </FormControl>
            </Paper>
        );
    }
}

export default withStyles(styles)(AccountReports);