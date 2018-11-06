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
  
    render() {
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
                    <ListItemText primary={item.name}/>
                    <p>{numberWithCommas(item.price)} ISK</p>
                    </ListItem>
                })}
                <ListItem>
                    <TextField style={{'display': 'inline-block', 'padding-right': '5px'}} placeholder={"Discount Code"}></TextField>
                    <Button variant="contained" onClick={console.log} style={{'background-color': 'green', 'color': 'white'}}>Verify</Button>
                    <ListItemText primary={"Total: " + numberWithCommas(total) + " ISK"} style={{'text-align': 'right', display: 'inline-block'}}></ListItemText>
                </ListItem>
                <ListItem>
                    <Button variant="contained" onClick={console.log} className={classes.submitButton}>Submit</Button>
                </ListItem>
            </List>
        </Paper>
      )}
  }

  export default withStyles(styles)(CheckoutItems);