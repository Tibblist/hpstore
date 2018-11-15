import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

const styles = theme => ({
    root: {
        'align-contect': 'center',
        'text-align': 'center',
    },
    paper: {
        'padding-top': 50,
        'padding-bottom': 50
    }
});

class ContactUs extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <Typography>
                        You can reach out to us on our discord, <a target="_blank" href="https://discord.gg/Q2z6WFD">Click Here!</a>
                    </Typography>
                    <iframe src="https://discordapp.com/widget?id=510378397147332608&theme=dark" width="350" height="500" allowtransparency="true" frameborder="0"></iframe>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(ContactUs);