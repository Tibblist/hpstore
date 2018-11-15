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
    },
    deposit: {
        'text-align': 'center'
    }
});

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class CheckoutItems extends React.Component {
    constructor(props) {
        var total = 0;
        for (var i = 0; i < props.cart.length; i++) {
            total += props.cart[i].quantity * props.cart[i].price
        }
        super(props);
        this.state = { 
            orderSent: false,
            confirmNumber: 0,
            discountCode: '',
            location: '1DQ1-A - 1-st Thetastar of Dickbutt',
            character: '',
            total: total
        };
    }

    componentWillMount() {
        this.fetchData();
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
                return;
            }
            //console.log(res)
            localStorage.removeItem("Cart");
            console.log("Removing cart from localstorage");
            if (res.body != null && res.body.status === 5) {
                console.alert("Invalid item pricing, please reload the store and try again")
                return;
            }
            this.clearCart();
            this.setState({
                confirmNumber: res.text,
                orderSent: true
            })
        })
    }

    fetchData = () => {
        request
        .get("/api/getSettings")
        .set('Authorization', AuthService.getToken())
        .end((err, res) => {
            if (err) {
                console.log(err);
                return;
            }
            this.setState({
                character: res.body.character,
                location: res.body.location
            });
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

    clearCart = () => {
        this.props.clearCart();
    }
  
    render() {
        const {classes} = this.props;
        if (this.state.orderSent) {
            return (
                <Paper>
                    <Typography variant="h5" className={classes.deposit} gutterBottom>
                        Thank you for your order.
                    </Typography>
                    <Typography variant="h5" className={classes.deposit}>
                        Your transaction ID is <b>#{this.state.confirmNumber}</b> Make sure to send your deposit to the corp Hole Punchers in game with your transaction ID as the reason text. It is important you do this right for your order to be processed in a timely manner. 
                    </Typography>
                    <Typography variant="h5" className={classes.deposit}>
                        Be sure to pay your deposit of <b>{numberWithCommas(Math.floor(this.state.total * .25))}</b> ISK to corp "Hole Punchers Builders" in game
                    </Typography>
                    <Typography variant="h5" className={classes.deposit}>
                        You can find the status of your order <Link to='/account/orders'>Here.</Link>
                    </Typography>
                </Paper>
            )
        } else {
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
                        <TextField style={{'display': 'inline-block', 'padding-left': '3%'}} onChange={(e) => this.handleCharacterChange(e)} value={this.state.character} placeholder={"Character Name"}></TextField>
                        <ListItemText primary={"Total: " + numberWithCommas(this.state.total) + " ISK"} style={{'text-align': 'right', display: 'inline-block'}}></ListItemText>
                    </ListItem>
                    <ListItem>
                    <ListItemText primary={"This transaction will require a 25% deposit after you order before it will be put into build."} style={{'text-align': 'center', }}></ListItemText>
                    </ListItem>
                    <ListItem>
                    <ListItemText primary={"By submitting this order you agree to accept the final contract within 1 week of it being issued, otherwise your order will be forfeit. In return we agree to produce your order in a reasonable timeframe."} style={{'text-align': 'center', }}></ListItemText>
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