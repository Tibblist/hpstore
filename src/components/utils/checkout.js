import React from 'react';
import Paper from '@material-ui/core/Paper';
import CartIcon from '@material-ui/icons/ShoppingCart';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import {Link} from 'react-router-dom';
import { TextField } from '@material-ui/core';

const styles = theme => ({
    cart: {
        //'margin-left': '20%',
        //'display': 'inline-block',
        'float': 'right'
    },
    icon: {
        'display': 'inline-block',
        'width': '50px',
        'height': '50px'
    },
    openCart: {
        'float': 'right'
    },
    itemName: {
        'display': 'block',
        'text-align': 'center',
        'margin-left': 'auto',
        'margin-right': 'auto',
    },
    itemQuantity: {
        'width': '20px',
        'display': 'inline-block',
        'text-align': 'center',
    },
    itemImg: {
        'display': 'block',
        'margin-left': 'auto',
        'margin-right': 'auto',
    },
    chkButton: {
        'display': 'block',
        'margin-left': 'auto',
        'margin-right': 'auto',

    },
    price: {
        //'padding-left': '5px',
        'text-align': 'center',
    }
  });

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function abbreviateNumber(num, fixed) {
    if (num === null) { return null; } // terminate early
    if (num === 0) { return '0'; } // terminate early
    fixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show
    var b = (num).toPrecision(2).split("e"), // get power
        k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
        c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3) ).toFixed(1 + fixed), // divide by power
        d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
        e = d + ['', 'K', 'M', 'B', 'T'][k]; // append power
    return e;
  }

class CheckoutMenu extends React.Component {

    state = {
        open: false,
    };
    
    handleClick = () => {
        var newOpen = !this.state.open;
        this.setState({
            open: newOpen,
        })
    }

    handleChange = (id, e) => {
        this.props.changeQuantity(id, e);
        for (var i = 0; i < this.props.cart.length; i++) {
            if (this.props.cart.id == id) {
                if (e.target.value == "") {
                    this.props.cart.quantity = 0;
                    break;
                }
                this.props.cart.quantity = parseInt(e.target.value, 10);
            }
        }
        this.forceUpdate();
    }

    render () {
        const {classes} = this.props;
        var total = 0;
        for (var i = 0; i < this.props.cart.length; i++) {
            total += this.props.cart[i].quantity * this.props.cart[i].price
        }
        return (
        <div className={classes.cart}>
            <Button onClick={this.handleClick}>
                <CartIcon className={classes.icon}/>
            </Button>
            <Collapse in={this.state.open}>
                <Paper className={classes.openCart}>
                    {this.props.cart.map((item, id) => {
                        return <Paper key={item.id}>
                            <img alt="" src={"https://image.eveonline.com/Type/" + item.id + "_64.png"} className={classes.itemImg}></img>
                            <p className={classes.price}>{abbreviateNumber(item.price)}</p>
                            <p className={"  " + classes.itemName}>{item.name} 
                            {"  x   "}<TextField onChange={(e) => this.handleChange(item.id, e)} defaultValue={item.quantity} className={classes.itemQuantity}></TextField>
                            </p>
                        </Paper>
                    })}
                    <p>Total: {numberWithCommas(total)} ISK</p>
                    <Link to="/store/checkout">
                        <Button className={classes.chkButton}>
                            Checkout
                        </Button>
                    </Link>
                </Paper>
            </Collapse>
        </div>
    )}
}

export default withStyles(styles)(CheckoutMenu);