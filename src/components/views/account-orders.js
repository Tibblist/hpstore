import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MUIDataTable from "mui-datatables";
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';
import { AuthService } from '../../backend/client/auth';
import Paper from '@material-ui/core/Paper';
import {Link} from 'react-router-dom';

const request = require('superagent');

const styles = theme => ({
    root: {
        'margin-left': '20%',
        'margin-right': '5%',
        'margin-top': '5px',
        overflowX: 'auto',
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
        'margin-left': '20px'
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
      filter: true,
      sort: true,
     }
    },
    {
     name: "Items",
     options: {
      filter: true,
      sort: true,
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
      filter: true,
      sort: true,
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
      filter: true,
      sort: true,
     }
    },
    {
     name: "Items",
     options: {
      filter: true,
      sort: true,
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
};

class AccountOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            claimID: 0,
            editID: 0
        };
    }

    handleClaimID = (event) => {
        this.setState({
            claimID: event.target.value
        });
    }
    handleEditID = (event) => {
        this.setState({
            editID: event.target.value
        });
    }

    submitClaim = () => {
        console.log("Sending " + this.state.claimID);
        request
        .post("/api/claimOrder")
        .set('Authorization', AuthService.getToken())
        .send({id: this.state.claimID})
        .retry(2)
        .end((err, res) => {
            if (err) {
                console.log(err);
            }
            this.props.updateOrders();
        })
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
                    <Paper className={classes.fields}>
                            <div className={classes.item}>
                                <TextField onChange={(e) => this.handleClaimID(e)}/><Button className={classes.button} variant="contained" onClick={this.submitClaim}>Claim Order</Button>
                            </div>
                            <div className={classes.item}>
                                <TextField onChange={(e) => this.handleEditID(e)}/><Link to={"/account/order/" + this.state.editID}><Button className={classes.button} variant="contained">Edit Order</Button></Link>
                            </div>
                    </Paper>
                </div>
            );
        } else {
            return (
            <div className={classes.root}>
                <MUIDataTable
                    title={"Users Orders"}
                    data={this.props.data}
                    columns={userColumns}
                    options={options}
                />
            </div>
        );
        }
    }
}

export default withStyles(styles)(AccountOrders);