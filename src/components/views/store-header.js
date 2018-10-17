import React from 'react';
import SearchBar from '../utils/search-bar';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
      ...theme.mixins.gutters(),
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
    },
  });

class StoreHeader extends React.Component {
    render () {
        const {classes} = this.props;
        return (
            <Paper className={classes.root}>
                <SearchBar></SearchBar>
            </Paper>
        );
    }
}

export default withStyles(styles)(StoreHeader);