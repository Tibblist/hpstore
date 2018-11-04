import React from 'react';
import Paper from '@material-ui/core/Paper';
import CartIcon from '@material-ui/icons/ShoppingCart';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';

const styles = theme => ({
    cart: {
        'margin-left': '20%',
        'display': 'inline-block',
    },
    icon: {
        'display': 'inline-block',
        'width': '50px',
        'height': '50px'
    }
  });

class CheckoutMenu extends React.Component {

    state = {
        open: false,
    };
    

    render () {
        const {classes} = this.props;
        return (
        <div className={classes.cart}>
            <Button>
                <CartIcon className={classes.icon}/>
            </Button>
            <Collapse>
                
            </Collapse>
        </div>
    )}
}

export default withStyles(styles)(CheckoutMenu);