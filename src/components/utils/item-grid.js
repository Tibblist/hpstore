import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CartIcon from '@material-ui/icons/AddShoppingCart';


const numberWithCommas = (x) => {
    if (x === null) {
        return null;
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const styles = theme => ({
    root: {
        'margin-left': '20%',
        'margin-right': '5%',
        'margin-top': 20,
        'display': 'inline-block',
    },
    container: {
        'display': 'inline-block',
    },
    gridItem: {
        'display': 'inline-block',
        'margin-top': 10,
    },
    itemName: {
        'margin-top': 10,
        'text-align': 'center',
        'margin-left': '10px',
        'margin-right': '10px',
    },
    itemPrice: {
        'margin-top': 10,
        'text-align': 'center',

    },
    itemImg: {
        'display': 'block',
        'margin-left': 'auto',
        'margin-right': 'auto',
    },
    addButton: {
        'margin-top': 10,
        'display': 'block',
        'margin-left': 'auto',
        'margin-right': 'auto',
    },
     addButtonDiv: {
        'margin-left': '10px',
        'margin-right': '10px',
        'margin-bottom': '10px'
     }
  });

class ItemGrid extends React.Component {

    handleCart = (id) => {
        this.props.addFunction(id);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.items == undefined) {
            return true;
        }
        if (this.props.items.length === nextProps.items.length) {
            if (this.props.items.length > 0) {
                if (this.props.items[0].id !== nextProps.items[0].id) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }

    render() {
        const { classes } = this.props;
        var itemArray = this.props.items;
        var newArray = [];
        for (var i = 0; i < itemArray.length; i++) {
            if (itemArray[i].category == 6) {
                newArray.push(itemArray[i]);
            }
        }
        for (var i = 0; i < itemArray.length; i++) {
            if (itemArray[i].category != 6) {
                newArray.push(itemArray[i]);
            }
        }
        itemArray = newArray;
        console.log(itemArray);
        return (
            <div className={classes.root}>
            <Grid container spacing={8} className={classes.container}>
                <Grid item xs={12}>
                    <Grid container className="item-grid" justify="space-evenly" alighitems="center" spacing={0}>
                        {itemArray.map(function(item, id) {
                        return  <Paper className={classes.gridItem} key={id}>
                            {getImage(classes, item)}
                            <Typography className={classes.itemName}>{item.name}</Typography>
                            <Typography className={classes.itemPrice}>Price: {numberWithCommas(item.price)} ISK</Typography>
                            <div className={classes.addButtonDiv}>
                            {item.disabled
                            ? <Button disabled variant="contained" className={classes.addButton}> Temp Out of Order</Button>
                            : <Button variant="contained" className={classes.addButton} onClick={() => this.handleCart(item.id)}> Add to cart <CartIcon/></Button>}
                            </div>
                            </Paper>
                        }, this)}
                    </Grid>
                </Grid>
            </Grid>
            </div>
        );
    }
}

function getImage(classes, item) {
    if (item.category == 6) {
        return <div className={classes.itemImg}><img src={"https://image.eveonline.com/Render/" + item.id + "_256.png"} alt={item[1]} className={classes.itemImg}></img></div>
    } else {
        return <div className={classes.itemImg}><img src={"https://image.eveonline.com/Type/" + item.id + "_64.png"} alt={item[1]} className={classes.itemImg}></img></div>
    }
}

export default withStyles(styles)(ItemGrid);