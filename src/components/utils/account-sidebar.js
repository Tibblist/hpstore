import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import SettingsIcon from '@material-ui/icons/Settings';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { AuthService } from '../../backend/auth';


const styles = theme => ({
    list: {
        backgroundColor: 'white',
    },
    container: {
        display: 'inline-block',
        zIndex: 1,
        'float': 'left',
    },
    listContainer: {
        height: '100%',
    }
  });

class SideBar extends React.Component {
    render () {
        const {classes} = this.props;
        return (
            <Paper className={classes.container}>
                <div className={classes.listContainer}>
                    <List className={classes.list}>{listItems()}</List>
                </div>
            </Paper>
        );
    }
}

function listItems() {
    if (AuthService.isAdmin() === true) {
        return adminListItems;
    } else {
        return userListItems;
    }
}

const adminListItems = (
    <div>
      <ListItem button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Orders" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Customers" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItem>
    </div>
);

const userListItems = (
    <div>
      <ListItem button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Orders" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItem>
    </div>
  );

  export default withStyles(styles)(SideBar);