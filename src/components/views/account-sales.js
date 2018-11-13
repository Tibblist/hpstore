import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Typography, List, ListItem, ListItemText, Button, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import InputAdornment from '@material-ui/core/InputAdornment';

const styles = theme => ({
    root: {
        'margin-right': '10%',
        'margin-left': '20%',
    },
    sales: {
        'width': 'auto',
        'float': 'left',
    },
    discounts: {
        'width': '20%',
        'float': 'right',
    }
});

class AccountSales extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            salesArray: [],
            discountArray: [],
            name: '',
            itemName: '',
            expirationDate: '',
            type: '',
            amountOff: '',

        };
    }

    componentDidMount() {
        //this.fetchData();
    }

    handleClose = (name) => {
        var sales = this.state.salesArray;
        for (var i = 0; i < sales.length; i++) {
            if (sales[i].name === name) {
                sales.splice(i, 1);
            }
        }
        
        this.setState({
            salesArray: sales
        })
    }

    handleNameChange = (event) => {
        this.setState({
            name: event.target.value
        })
    }

    handleDateChange = (event) => {
        this.setState({
            expirationDate: event.target.value
        })
    }

    handlePercentChange = (event) => {
        this.setState({
            amountOff: event.target.value
        })
    }

    handleItemChange = (event) => {
        this.setState({
            itemName: event.target.value
        })
    }

    createSale = () => {
        var newSale = {
            name: this.state.name,
            expirationDate: this.state.expirationDate,
            percentOff: this.state.amountOff,
            itemName: this.state.itemName,
            description: this.state.amountOff + "% off of " + this.state.itemName + " until " + this.state.expirationDate,
        }

        var sales = this.state.salesArray;
        sales.push(newSale);

        this.setState({
            salesArray: sales
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Paper className={classes.sales}>
                    <Typography variant="h5" align="center" color="textPrimary" gutterBottom className={classes.header}>Per Item Sales</Typography>
                    <List>
                    {this.state.salesArray.map((sale, id) => {
                        return (
                            <ListItem key={id}>
                                <ListItemText>{sale.name}</ListItemText>
                                <ListItemText>{sale.description}</ListItemText>
                                <Button onClick={() => this.handleClose(sale.name)}>
                                    <CloseIcon/>
                                </Button>
                            </ListItem>
                        )
                    })}
                    <TextField label="Sale Name"onChange={this.handleNameChange} value={this.state.name} style={{'padding-right': '20px', 'margin-left': '20px'}}></TextField>
                    <TextField type="date" label="Expiration Date" onChange={this.handleDateChange} value={this.state.expirationDate} InputLabelProps={{shrink: true,}} style={{'margin-right': '20px',}}></TextField>
                    <TextField label="Percent Off" value={this.state.amountOff} onChange={this.handlePercentChange} InputProps={{endAdornment: <InputAdornment position="end">%</InputAdornment>,}} style={{'margin-right': '20px',}}></TextField>
                    <TextField label="Item Name" value={this.state.itemName} onChange={this.handleItemChange} style={{'margin-right': '20px',}}></TextField>
                    <Button onClick={this.createSale} variant="contained">Add</Button>
                    </List>
                </Paper>
                <Paper className={classes.discounts}>
                    <Typography variant="h5" align="center" color="textPrimary" gutterBottom className={classes.header}>Discount Codes</Typography>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(AccountSales);