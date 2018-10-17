import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({

});

class AccountDash extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div>
                Hello World!
            </div>
        );
    }
}

export default withStyles(styles)(AccountDash);