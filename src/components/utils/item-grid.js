import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        'margin-left': '10%',
        'margin-right': '5%',
    },
    container: {
        left: 200,
        backgroundColor: 'yellow',
    },
  });

function createItemArray() {
    var itemArray = [];
    for (var i = 0; i < 50; i++) {
        var item = [i, "naglfar", "1.2B", "https://wiki.eveuniversity.org/images/thumb/f/f9/Naglfar.jpg/256px-Naglfar.jpg"];
        itemArray.push(item);
    }
    return itemArray;
}

class ItemGrid extends React.Component {
    render() {
        const { classes } = this.props;
        var itemArray = createItemArray();
        return (
            <div className={classes.root}>
            <Grid container spacing={8} className={classes.container}>
                <Grid item xs={12}>
                    <Grid container className="item-grid" justify="space-evenly" alighitems="center" spacing={0}>
                        {itemArray.map(function(item, id) {
                        return  <Grid className="grid-item" key={id}>
                            <div className="item-image"><img src={item[3]} alt={item[1]}></img></div>
                            <div className="item-name">{item[1]}</div>
                            <div className="item-price">{item[2]}</div>
                            </Grid>
                        })}
                    </Grid>
                </Grid>
            </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(ItemGrid);