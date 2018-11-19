import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {

    }
});

class FittingsParser extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>

            </div>
        );
    }
}

export default withStyles(styles)(FittingsParser);