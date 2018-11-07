import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MUIDataTable from "mui-datatables";

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
    render() {
        const { classes } = this.props;
        console.log(this.props.data);
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