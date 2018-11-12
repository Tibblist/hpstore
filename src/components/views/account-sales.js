import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

const styles = theme => ({
    root: {

    }
});

class AccountSales extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Paper className={classes.sales}>
                    <Typography className={classes.header}>Per Item Sales</Typography>
                </Paper>
                <Paper className={classes.discounts}>
                    <Typography className={classes.header}>Discount Codes</Typography>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(AccountSales);