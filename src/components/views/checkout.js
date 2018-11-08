import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import { TextField } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { AuthService } from '../../backend/client/auth';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const request = require('superagent');


const styles = theme => ({
    container: {
        'margin-right': '10%',
        'margin-left': '10%',
        'margin-top': '20px',

    },
    list: {
        backgroundColor: 'white'

    },
    submitButton: {
        'background-color': 'blue',
        'color': 'white',
        'display': 'block',
        'margin-right': 'auto',
        'margin-left': 'auto'
    },
    formControl: {
        minWidth: 120,
        'padding-left': '5px',
    },
    menu: {
    },
    menuItem: {
        'background-color': 'white'
    },
    label: {
        'padding-left': '3%',
    }
});

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class CheckoutItems extends React.Component {
    constructor(props) {
        super(props);
        var character = '';
        var location = '';
        if (this.props.character) {
            character = this.props.character;
        }
        if (this.props.location) {
            location = this.props.location;
        }
        this.state = { 
            orderSent: false,
            confirmNumber: 0,
            discountCode: '',
            location: location,
            character: character
        };
    }

    postOrder = () => {
        var obj = {
            items: this.props.cart,
            discountCode: this.state.discountCode,
            character: this.state.character,
            location: this.state.location
        }
        request
        .post("/api/postOrder")
        .set('Authorization', AuthService.getToken())
        .send(obj)
        .retry(2)
        .end((err, res) => {
            if (err) {
                console.log(err);
            }
            if (res.body === "Invalid pricing") {
                console.alert("Invalid item pricing, please reload the store and try again")
            }
            //console.log(res);
            this.setState({
                confirmNumber: res.text,
                orderSent: true
            })
        })
    }

    handleCodeChange = (event) => {
        this.setState({
            discountCode: event.target.value
        });
    }

    handleLocationChange = (event) => {
        this.setState({
            location: event.target.value
        })
    }

    handleCharacterChange = (event) => {
        this.setState({
            character: event.target.value
        })
    }
  
    render() {
        if (this.state.orderSent) {
            return (
                <Paper>
                    <Typography variant="h5" gutterBottom>
                        Thank you for your order.
                    </Typography>
                    <Typography variant="subtitle1">
                        Your order number is #{this.state.confirmNumber}. You can find the status of your order <Link to='/account/orders'><p>Here.</p></Link>
                    </Typography>
                </Paper>
            )
        } else {
            const {classes} = this.props;
            var total = 0;
            for (var i = 0; i < this.props.cart.length; i++) {
                total += this.props.cart[i].quantity * this.props.cart[i].price
            }
            return (
            <Paper className={classes.container}>
                <List className={classes.list}>
                    {this.props.cart.map((item, id) => {
                        return <ListItem key={item.id}>
                        <img alt="" src={"https://image.eveonline.com/Type/" + item.id + "_64.png"} className={classes.itemImg}></img>
                        <ListItemText primary={item.name + " x" + item.quantity}/>
                        <p>{numberWithCommas(item.price * item.quantity)} ISK</p>
                        </ListItem>
                    })}
                    <ListItem>
                        <TextField style={{'display': 'inline-block', 'padding-right': '1%'}} onChange={(e) => this.handleCodeChange(e)} placeholder={"Discount Code"}></TextField>
                        <Button variant="contained" onClick={console.log} style={{'background-color': 'green', 'color': 'white'}}>Verify</Button>
                        <Typography className={classes.label}>Delivery Location:</Typography>
                        <FormControl className={classes.formControl}>
                            <Select
                                value={this.state.location}
                                onChange={this.handleLocationChange}
                                inputProps={{
                                name: 'Delivery Location',
                                id: 'location',
                                }}
                                className={classes.menu}
                            >
                            <MenuItem className={classes.menuItem} value={"1DQ1-A - 1-st Thetastar of Dickbutt"}>
                            <em>1DQ1-A - 1-st Thetastar of Dickbutt</em>
                            </MenuItem>
                            <MenuItem className={classes.menuItem} value={"J5A-IX - The Player of Games"}>J5A-IX - The Player of Games</MenuItem>
                            <MenuItem className={classes.menuItem} value={"D-W7F0 - #% Gaarastar %#"}>D-W7F0 - #% Gaarastar %#</MenuItem>
                            <MenuItem className={classes.menuItem} value={"F-NXLQ - Babylon 5-Bil"}>F-NXLQ - Babylon 5-Bil</MenuItem>
                            <MenuItem className={classes.menuItem} value={"B17O-R - Onii-chan League Headquarters"}>B17O-R - Onii-chan League Headquarters</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField style={{'display': 'inline-block', 'padding-left': '3%'}} onChange={(e) => this.handleCharacterChange(e)} defaultValue={this.props.character} placeholder={"Character Name"}></TextField>
                        <ListItemText primary={"Total: " + numberWithCommas(total) + " ISK"} style={{'text-align': 'right', display: 'inline-block'}}></ListItemText>
                    </ListItem>
                    <ListItem>
                        {isDisabled(this.state.location, this.state.character, this.props.cart)
                        ? <Button disabled variant="contained" onClick={this.postOrder} className={classes.submitButton}>Submit</Button>
                        : <Button variant="contained" onClick={this.postOrder} className={classes.submitButton}>Submit</Button>}
                    </ListItem>
                </List>
            </Paper>
      )}
    }
  }

function isDisabled(loc, char, cart) {
    if (loc === '' || char === '' || cart.length === 0) {
        return true;
    }
    return false;
}

  export default withStyles(styles)(CheckoutItems);