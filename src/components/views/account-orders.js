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
    constructor(props) {
        super(props);
        this.state = { 
            claimID: 0,
            editID: 0
        };
    }

    componentDidMount() {
        this.props.fetchOrders();
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
        this.setState({
            claimID: ''
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
            </div>
        );
        }
    }
}

export default withStyles(styles)(AccountOrders);