import React from 'react';
import SearchBar from '../utils/search-bar';
import Paper from '@material-ui/core/Paper';
import CartIcon from '@material-ui/icons/ShoppingCart';
import { withStyles } from '@material-ui/core/styles';
import Checkout from '../utils/checkout';

const styles = theme => ({
    root: {
      ...theme.mixins.gutters(),
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
    }
  });

class StoreHeader extends React.Component {
    render () {
        const {classes} = this.props;
        return (
            <Paper className={classes.root}>
                <Checkout cart={this.props.cart} changeQuantity={this.props.changeQuantity}/>
                <SearchBar suggestions={this.props.suggestions} category={this.props.category} className={classes.search} changeFunction={this.props.changeFunction}/>
            </Paper>
        );
    }
}

export default withStyles(styles)(StoreHeader);