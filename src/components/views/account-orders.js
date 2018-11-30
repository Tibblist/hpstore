import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MUIDataTable from "mui-datatables";
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { AuthService } from '../../backend/client/auth';
import Paper from '@material-ui/core/Paper';
import {Link} from 'react-router-dom';

const styles = theme => ({
    root: {
        'margin-left': '20%',
        'margin-right': '5%',
        'margin-top': '5px',
        overflowX: 'auto',
        'z-index': 1
      },
      table: {
        minWidth: 700,
    },
    fields: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        'margin-top': '20px'
    },
    item: {
        'margin-top': '10px',
        'margin-bottom': '10px',

    },
    button: {
        'margin-bottom': 20,
        'margin-top': 20,
        //'flex-basis': 'initial',
        //width: 200
    },
});

const userColumns = [
    {
     name: "Transaction ID",
     options: {
      filter: false,
      sort: true,
     }
    },
    {
     name: "Builder",
     options: {
      filter: true,
      sort: true,
     }
    },
    {
     name: "Price",
     options: {
      filter: false,
      sort: false,
     }
    },
    {
     name: "Items",
     options: {
      filter: false,
      sort: false,
     }
    },
    {
     name: "Delivery Location",
     options: {
      filter: true,
      sort: false,
     }
    },
    {
     name: "Deliver To",
     options: {
      filter: false,
      sort: false,
     }
    },
    {
     name: "Order Date",
     options: {
      filter: false,
      sort: false,
     }
    },
    {
     name: "Expected End Date",
     options: {
      filter: false,
      sort: false,
     }
    },
    {
     name: "Delivered Date",
     options: {
      filter: false,
      sort: false,
     }
    },
    {
     name: "Status",
     options: {
      filter: false,
      sort: false,
     }
    },
];

const builderColumns = [
    {
     name: "Transaction ID",
     options: {
      filter: false,
      sort: true,
     }
    },
    {
     name: "Builder",
     options: {
      filter: false,
      sort: false,
     }
    },
    {
     name: "Buyer",
     options: {
      filter: true,
      sort: true,
     }
    },
    {
     name: "Price",
     options: {
      filter: false,
      sort: false,
     }
    },
    {
     name: "Discount Code",
     options: {
      filter: false,
      sort: false,
     }
    },
    {
     name: "Items",
     options: {
      filter: false,
      sort: false,
     }
    },
    {
     name: "Delivery Location",
     options: {
      filter: true,
      sort: false,
     }
    },
    {
     name: "Deliver To",
     options: {
      filter: false,
      sort: false,
     }
    },
    {
     name: "Order Date",
     options: {
      filter: false,
      sort: false,
     }
    },
    {
     name: "Expected End Date",
     options: {
      filter: false,
      sort: false,
     }
    },
    {
     name: "Delivered Date",
     options: {
      filter: false,
      sort: false,
     }
    },
    {
     name: "Status",
     options: {
      filter: false,
      sort: false,
     }
    },
];

const options = {
    //serverSide: true,
    selectableRows: false,
    responsive: 'scroll',
};

class AccountOrders extends React.Component {
    componentDidMount() {
        this.props.fetchOrders();
    }

    render() {
        const { classes } = this.props;
        //console.log(this.props.data);
        if (this.props.isBuilder) {
            return (
                <div className={classes.root}>
                    <MUIDataTable
                        title={"All Orders"}
                        data={this.props.data}
                        columns={builderColumns}
                        options={options}
                    />
                    <Paper style={{marginTop: 25, display: 'flex', alignItems: 'center', flexDirection: 'column'}} elevation={5}>
                        <Typography align="center" variant="h4" >Need help with an order?</Typography>
                        <Button className={classes.button} size="large" variant="outlined" component={Link} to="/contact-us">Contact Us</Button>
                    </Paper>
                </div>
                
            );
        } else {
            return (
            <div className={classes.root}>
                <MUIDataTable
                    title={AuthService.getName() + "'s Orders"}
                    data={this.props.data}
                    columns={userColumns}
                    options={options}
                />
                <Paper style={{marginTop: 25, display: 'flex', alignItems: 'center', flexDirection: 'column'}} elevation={5}>
                    <Typography align="center" variant="h4" >Need help with an order?</Typography>
                    <Button className={classes.button} size="large" variant="outlined" component={Link} to="/contact-us">Contact Us</Button>
                </Paper>
            </div>
        );
        }
    }
}

export default withStyles(styles)(AccountOrders);