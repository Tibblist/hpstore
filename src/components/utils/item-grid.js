import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CartIcon from '@material-ui/icons/AddShoppingCart';

const styles = theme => ({
    root: {
        'margin-left': '10%',
        'margin-right': '5%',
        'margin-top': 20,
    },
    container: {
        
    },
    gridItem: {
        'margin-top': 10,
    },
    itemName: {
        'text-align': 'center',
    },
    itemPrice: {
        'text-align': 'center',

    },
    itemImg: {
        'display': 'block',
        'margin-left': 'auto',
        'margin-right': 'auto',
    },
    addButton: {
        'display': 'block',
        'margin-left': 'auto',
        'margin-right': 'auto',
    }
  });

/*function createItemArray() {
    var itemArray = [];
    for (var i = 0; i < 50; i++) {
        var item = [i, "Naglfar", "1.2B", "https://wiki.eveuniversity.org/images/thumb/f/f9/Naglfar.jpg/256px-Naglfar.jpg"];
        itemArray.push(item);
    }
    return itemArray;
}*/

class ItemGrid extends React.Component {

    handleCart = (id) => {
        this.props.addFunction(id);
    }

    render() {
        const { classes } = this.props;
        var itemArray = this.props.items;
        return (
            <div className={classes.root}>
            <Grid container spacing={8} className={classes.container}>
                <Grid item xs={12}>
                    <Grid container className="item-grid" justify="space-evenly" alighitems="center" spacing={0}>
                        {itemArray.map(function(item, id) {
                        return  <Paper className={classes.gridItem} key={id}>
                            <div className={classes.itemImg}><img src={"https://image.eveonline.com/Render/" + item.id + "_256.png"} onError={(e)=>{e.target.onerror = null; e.target.src="https://image.eveonline.com/Type/" + item.id + "_64.png"}} alt={item[1]} className={classes.itemImg}></img></div>
                            <Typography className={classes.itemName}>{item.name}</Typography>
                            <Typography className={classes.itemPrice}>Price: {item.price} ISK</Typography>
                            <Button variant="contained" className={classes.addButton} onClick={() => this.handleCart(item.id)}>
                                Add to cart
                                <CartIcon/>
                            </Button>
                            </Paper>
                        }, this)}
                    </Grid>
                </Grid>
            </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(ItemGrid);