import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        'text-align': 'center',
        'margin-top': 50
    },
    text: {
        'color': 'blue'
    }
});

class FittingsParser extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <p className={classes.text}>Hello World!</p>
            </div>
        );
    }
}

export default withStyles(styles)(FittingsParser);