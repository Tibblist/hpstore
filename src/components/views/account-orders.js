import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import MUIDataTable from "mui-datatables";
import { AuthService } from '../../backend/client/auth';


const request = require('superagent');

const Status = Object.freeze({
    PAY:    <TableCell style={{backgroundColor: "yellow"}}><b style={{color: "black"}}>Confirming Payment</b></TableCell>,
    BUILD:  <TableCell style={{backgroundColor: "green"}}><b style={{color: "black"}}>In Build</b></TableCell>,
    DELAY:  <TableCell style={{backgroundColor: "yellow"}}><b style={{color: "black"}}>Build Delayed</b></TableCell>,
    REJECT: <TableCell style={{backgroundColor: "red"}}><b style={{color: "black"}}>Rejected</b></TableCell>,
});

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
            data: [] 
        };
        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        request
        .get("/api/getOrders")
        .set('Authorization', AuthService.getToken())
        .end((err, res) => {
            console.log(res.body);
            if (err) {
                console.log(err);
            }
            if (res.body == null) {
                return;
            }
            for (var i = 0; i < res.body.data.length; i++) {
                if (res.body.isBuilder) {
                    res.body.data[i][8] = showStatus(parseInt(res.body.data[i][8], 10));
                } else {
                    res.body.data[i][7] = showStatus(parseInt(res.body.data[i][7], 10));
                }
            }
            this.setState({
                isBuilder: res.body.isBuilder,
                data: res.body.data
            })
        });
    }

    render() {
        const { classes } = this.props;
        console.log(this.state.data);
        if (this.state.isBuilder) {
            return (
                <div className={classes.root}>
                    <MUIDataTable
                        title={"All Orders"}
                        data={this.state.data}
                        columns={builderColumns}
                        options={options}
                    />
                </div>
            );
        } else {
            return (
            <div className={classes.root}>
                <MUIDataTable
                    title={"Users Orders"}
                    data={this.state.data}
                    columns={userColumns}
                    options={options}
                />
            </div>
        );
        }
    }
}

function showStatus(status) {
    switch (status) {
        case 1:
            return Status.PAY
        case 2:
            return Status.BUILD
        case 3:
            return Status.DELAY
        case 4:
            return Status.REJECT
        default:
            return "ERROR NO STATUS"
    }
}
export default withStyles(styles)(AccountOrders);