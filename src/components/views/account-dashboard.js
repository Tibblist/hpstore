import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const styles = theme => ({

});

class AccountDash extends React.Component {
    render() {
        //const { classes } = this.props;
        return (
            <div>
                <Typography variant="h3" align="center">
                    Important overview of outstanding orders and analysis of financial data coming soon!
                </Typography>
            </div>
        );
    }
}

export default withStyles(styles)(AccountDash);