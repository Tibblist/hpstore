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

const styles = theme => ({
    container: {
        backgroundColor: 'white'
    }
});

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class CheckoutItems extends React.Component {
  
    render() {
      const {classes} = this.props;
      return (
        <Paper className={classes.container}>
            <List>
                {this.props.cart.map((item, id) => {
                    return <ListItem key={item.id}>
                    <img alt="" src={"https://image.eveonline.com/Type/" + item.id + "_64.png"} className={classes.itemImg}></img>
                    <ListItemText primary={item.name}/>
                    <p>{numberWithCommas(item.price)} ISK</p>
                    </ListItem>
                })}
            </List>
        </Paper>
      )}
  }

  export default withStyles(styles)(CheckoutItems);