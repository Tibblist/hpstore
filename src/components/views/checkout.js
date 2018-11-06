import React from 'react';
import Paper from '@material-ui/core/Paper';
import CartIcon from '@material-ui/icons/ShoppingCart';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import {Link} from 'react-router-dom';
import { TextField } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { AuthService } from '../../backend/client/auth';

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
    }
});

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class CheckoutItems extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            orderSent: false,
            confirmNumber: 0,
            discountCode: ''
        };
    }

    postOrder = () => {
        var obj = {
            items: this.props.cart,
            discountCode: this.state.discountCode
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
                        <TextField style={{'display': 'inline-block', 'padding-right': '5px'}} onChange={(e) => this.handleCodeChange(e)} placeholder={"Discount Code"}></TextField>
                        <Button variant="contained" onClick={console.log} style={{'background-color': 'green', 'color': 'white'}}>Verify</Button>
                        <ListItemText primary={"Total: " + numberWithCommas(total) + " ISK"} style={{'text-align': 'right', display: 'inline-block'}}></ListItemText>
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" onClick={this.postOrder} className={classes.submitButton}>Submit</Button>
                    </ListItem>
                </List>
            </Paper>
      )}
    }
  }

  export default withStyles(styles)(CheckoutItems);