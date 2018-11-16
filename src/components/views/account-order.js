import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { AuthService } from '../../backend/client/auth';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { Typography, ListItemText, List, ListItem, Input, InputLabel, InputAdornment } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {
    Redirect,
    Link
  } from 'react-router-dom';
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
        'margin-top': '5px',
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
        'margin-top': '20px',
    },
    form: {
        'width': '25%',
        'margin-left': '40%',
        'margin-right': '37.5%',
        'margin-top': '5px',
        display: 'flex',
        'justify-content': 'space-around',
    }
});

const numberWithCommas = (x) => {
    if (x === null) {
        return null;
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function compareStrings(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
  
    return (a < b) ? -1 : (a > b) ? 1 : 0;
}
class AccountReports extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: {
                items: []
            },
            items: [],
            itemArray: [],
            quantity: '',
            id: 0,
            done: false
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(props) {
        //console.log(this.state);
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
        request
        .get("/api/getItems")
        .set('Authorization', AuthService.getToken())
        .end((err, res) => {
            if (err) {
                console.log(err);
                this.setState({
                    items: [{name: "Error getting items"}]
                }); 
                return;
            }
            var newSuggestions = [];
            for (var i = 0; i < res.body.length; i++) {
              newSuggestions.push({name: res.body[i].name, id: res.body[i].id});
            }
            newSuggestions.sort(function (a, b) {
                return compareStrings(a.name, b.name);
            })
            this.setState({
                items: newSuggestions,
                itemArray: res.body
            });
        })
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

            this.setState({
                done: true
            })
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
        //console.log("Changing status to: " + event.target.value);
        var newOrder = this.state.order;
        newOrder.status = event.target.value;
        this.setState({
            order: newOrder
        })
    }

    handleClearItem = (id) => {
        var newOrder = this.state.order;
        var items = this.state.order.items;
        for (var i = 0; i < items.length; i++) {
            if (items[i].id === id) {
                items.splice(i, 1);
            }
        }
        newOrder.items = items;
        this.setState({
            order: newOrder
        })
    }

    handleQuantityChange = (event) => {
        this.setState({
            quantity: event.target.value
        })
    }

    handleItemChange = (event) => {
        this.setState({
            id: event.target.value
        })
    }

    createItem = () => {
        if (this.state.quantity === '' || this.state.quantity === 0) {
            return;
        }
        var newOrder = this.state.order;
        var items = this.state.order.items;
        var item;
        var found = false;
        for (var i = 0; i < items.length; i++) {
            if (items[i].id === this.state.id) {
                items[i].quantity += parseInt(this.state.quantity, 10);
                found = true;
            }
        }
        if (!found) {
            for (var i = 0; i < this.state.itemArray.length; i++) {
                if (this.state.itemArray[i].id === this.state.id) {
                    item = {
                        id: this.state.itemArray[i].id,
                        name: this.state.itemArray[i].name,
                        price: this.state.itemArray[i].price,
                        quantity: this.state.quantity
                    }
                }
            }
            items.push(item);
        }

        newOrder.items = items;
        
        this.setState({
            order: newOrder,
            id: 0,
            quantity: ''
        })

        this.recalcTotalPrice();
    }

    recalcTotalPrice = () => {
        var newOrder = this.state.order;
        var items = this.state.order.items;
        var totalPrice = 0;
        for (var i = 0; i < items.length; i++) {
            totalPrice += parseInt(items[i].price, 10) * parseInt(items[i].quantity, 10);
        }

        newOrder.price = totalPrice;

        this.setState({
            order: newOrder
        })
    }

    render() {
        const { classes } = this.props;

        if (this.state.done) {
            return (
                <Redirect to="/account/orders"/>
            )
        }

        return (
            <Paper className={classes.container}>
                <Typography className={classes.label}>Editing order #{this.state.order.id}</Typography>
                <List className={classes.text}>
                    {this.state.order.items.map((item, id) => {
                        return (
                            
                            <ListItem key={id}>
                                <ListItemText>{item.name}</ListItemText>
                                <ListItemText>{numberWithCommas(item.price)} ISK</ListItemText>
                                <ListItemText>x{item.quantity}</ListItemText>
                                <Button onClick={() => this.clearItem(item.id)}>
                                    <CloseIcon/>
                                </Button>
                            </ListItem>
                        )
                    })}
                </List>
                <div className={classes.form}>
                    <FormControl style={{ 'margin-right': 20, 'margin-left': 20 }}>
                        <InputLabel htmlFor="item-helper">Item Name</InputLabel>
                        <Select
                            value={this.state.id}
                            onChange={this.handleItemChange}
                            input={<Input name="item" id="item-helper" />}
                        >
                            {this.state.items.map((item, id) => {
                                return (
                                    <MenuItem value={item.id} key={id}>{item.name}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    <TextField label="Item Quantity" onChange={this.handleQuantityChange} value={this.state.quantity} style={{ 'margin-right': 20 }}></TextField>
                </div>
                <Button variant="contained" className={classes.button} onClick={this.createItem}>Add</Button>
                <Typography className={classes.label}>Price: </Typography>
                <TextField
                    disabled
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
                    type="date"
                    className={classes.text} 
                    value={this.state.order.endDate} 
                    placeholder={String(this.state.order.endDate)}
                    onChange={(e) => this.handleEndDateChange(e)}>
                </TextField>
                <Typography className={classes.label}>Delivered on Date: </Typography>
                <TextField 
                    type="date"
                    className={classes.text} 
                    value={this.state.order.deliveredDate} 
                    placeholder={String(this.state.order.deliveredDate)}
                    onChange={(e) => this.handleDeliveredDateChange(e)}>
                </TextField>
                <Typography className={classes.label}>Location to be delivered to: </Typography>
                <FormControl className={classes.text}>
                    <Select
                        value={this.state.order.location}
                        onChange={this.handleLocationChange}
                        inputProps={{
                            name: 'Delivery Location',
                            id: 'location',
                        }}
                        className={classes.menu}
                    >
                    <MenuItem className={classes.menuItem} value={"J5A-IX - The Player of Games"}>
                        <em>J5A-IX - The Player of Games</em>
                    </MenuItem>
                    <MenuItem className={classes.menuItem} value={"1DQ1-A - 1-st Thetastar of Dickbutt"}>
                        1DQ1-A - 1-st Thetastar of Dickbutt
                    </MenuItem>
                    </Select>
                </FormControl>
                <Typography className={classes.label}>Character to be delivered to: </Typography>
                <TextField 
                    className={classes.text} 
                    value={this.state.order.character} 
                    placeholder={String(this.state.order.character)}
                    onChange={(e) => this.handleCharacterChange(e)}>
                </TextField>
                <Typography className={classes.label}>Order Status: </Typography>
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