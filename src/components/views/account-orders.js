import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import {SERVER_URL} from '../../config';
import MUIDataTable from "mui-datatables";

const request = require('superagent');

const Status = Object.freeze({
    PAY:    <TableCell style={{backgroundColor: "yellow"}}><b style={{color: "black"}}>Confirming Payment</b></TableCell>,
    BUILD:  <TableCell style={{backgroundColor: "green"}}><b style={{color: "black"}}>In Build</b></TableCell>,
    DELAY:  <TableCell style={{backgroundColor: "yellow"}}><b style={{color: "black"}}>Build Delayed</b></TableCell>,
    REJECT: <TableCell style={{backgroundColor: "red"}}><b style={{color: "black"}}>Rejected</b></TableCell>,
});

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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

const columns = [
    {
     name: "Transaction ID",
     options: {
      filter: false,
      sort: true,
     }
    },
    {
     name: "Name",
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

function prepData(transID, name, price, startDate, expectedDate, deliveredDate, status) {
    return {transID, name, price, startDate, expectedDate, deliveredDate, status};
}

class AccountOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            data: [] 
        };
        this.fetchData = this.fetchData.bind(this);
        this.testSendOrder = this.testSendOrder.bind(this);
        console.log("Showing orders");
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        request
        .get("/api/getOrders")  
        .end((err, res) => {
            if (res == null) {
                console.log(err);
                return;
            }
            var newData = [];
            for (var i = 0; i < res.body.length; i++) {
                var keys = Object.keys(res.body[i]);
                var temp = [];
                keys.forEach(function(key){
                    if (key === "status") {
                        temp.push(showStatus(res.body[i][key]));
                        //temp.push("Hello");
                        return;
                    } else if (key === "price") {
                        temp.push(numberWithCommas(res.body[i][key]) + " ISK");
                        return;
                    }
                    temp.push(res.body[i][key]);
                });
                newData.push(temp);
            }
            console.log(newData);
            this.setState({
                data: newData
            });
        });
    }

    testSendOrder() {
        request
            .post('/api/createOrder')
            .set('Content-Type', 'application/json')
            .send(prepData(120, "Naglfar", 1200000000, "10/20/18", "10/27/18", "", 1))
            .then(
                this.fetchData()
            );
    }

    render() {
        const { classes } = this.props;
        console.log(this.state.data);
        return (
        <div className={classes.root}>
            <MUIDataTable
                title={"Users Orders"}
                data={this.state.data}
                columns={columns}
                options={options}
            />
                        <button style={{marginLeft: '50%', marginRight: '50%'}} onClick={this.testSendOrder}>Add an order</button>
        </div>
        );
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