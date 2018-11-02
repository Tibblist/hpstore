import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

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
                            <div className="item-image"><img src={"none"} alt={item[1]}></img></div>
                            <Typography className={classes.itemName}>{item.name}</Typography>
                            <Typography className={classes.itemPrice}>{item.price}</Typography>
                            </Paper>
                        })}
                    </Grid>
                </Grid>
            </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(ItemGrid);