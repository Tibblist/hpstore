import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

var id = 0;

const Status = Object.freeze({
    PAY:    <TableCell style={{backgroundColor: "yellow"}}><b style={{color: "black"}}>Confirming Payment</b></TableCell>,
    BUILD:  <TableCell style={{backgroundColor: "green"}}><b style={{color: "black"}}>In Build</b></TableCell>,
    DELAY:  <TableCell style={{backgroundColor: "yellow"}}><b style={{color: "black"}}>Build Delayed</b></TableCell>,
    REJECT: <TableCell style={{backgroundColor: "red"}}><b style={{color: "black"}}>Rejected</b></TableCell>,
});

function prepData(transID, name, price, startDate, expectedDate, deliveredDate, status) {
    id++;
    return {id, transID, name, price, startDate, expectedDate, deliveredDate, status};
}

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

const data = [
    prepData(110, "Naglfar", 1200000000, "10/20/18", "10/27/18", "", Status.BUILD),
    prepData(114, "Naglfar", 1200000000, "10/20/18", "10/27/18", "", Status.PAY),
    prepData(120, "Naglfar", 1200000000, "10/20/18", "10/27/18", "", Status.DELAY),
    prepData(123, "Naglfar", 1200000000, "10/20/18", "10/27/18", "", Status.REJECT),
    prepData(125, "Naglfar", 1200000000, "10/20/18", "10/27/18", "", Status.REJECT),
]

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

class AccountOrders extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Transaction ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell >Price</TableCell>
            <TableCell >Order Date</TableCell>
            <TableCell >Expected End Date</TableCell>
            <TableCell >Delivered Date</TableCell>
            <TableCell >Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(n => {
            return (
            <TableRow key={n.id}>
                <TableCell component="th" scope="row" numeric>
                    {n.transID}
                </TableCell>
                <TableCell >{n.name}</TableCell>
                <TableCell >{numberWithCommas(n.price)}</TableCell>
                <TableCell >{n.startDate}</TableCell>
                <TableCell >{n.expectedDate}</TableCell>
                <TableCell >{n.deliveredDate}</TableCell>
                {n.status}
            </TableRow>
             );
             })}
            </TableBody>
            </Table>
        </Paper>
        );
    }
}

export default withStyles(styles)(AccountOrders);