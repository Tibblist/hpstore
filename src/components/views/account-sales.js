import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Typography, List, ListItem, ListItemText, Button, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import InputAdornment from '@material-ui/core/InputAdornment';

const styles = theme => ({
    root: {
        'margin-left': '10%',
        display: 'flex',
        'justify-content': 'space-around',
    },
    sales: {
        'width': 'auto',
        //'float': 'left',
    },
    discounts: {
        'width': 'auto',
        //'float': 'right',
    },
    container: {
        display: 'flex',
        'justify-content': 'space-around',
    },
    button: {
        'display': 'block',
        'margin-left': 'auto',
        'margin-right': 'auto',
        'margin-top': '20px',
        'margin-bottom': '20px'
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
            maxSold: 0,
            code: '',
            maxUse: 0,
            percentOff: ''

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

    handleCloseD = (code) => {
        var discounts = this.state.discountArray;
        for (var i = 0; i < discounts.length; i++) {
            if (discounts[i].code === code) {
                discounts.splice(i, 1);
            }
        }

        this.setState({
            discountArray: discounts
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

    handlePercentChangeD = (event) => {
        this.setState({
            percentOff: event.target.value
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

    handleMaxChange = (event) => {
        this.setState({
            maxSold: event.target.value
        })
    }

    handleCodeChange = (event) => {
        this.setState({
            code: event.target.value
        })
    }

    handleUseChange = (event) => {
        this.setState({
            maxUse: event.target.value
        })
    }

    createDiscount = () => {
        var newDiscount = {
            code: this.state.code,
            maxUse: this.state.maxUse,
            percentOff: this.state.percentOff,
            used: 0,
        }

        var discounts = this.state.discountArray;
        discounts.push(newDiscount);

        this.setState({
            code: '',
            maxUse: 0,
            percentOff: ''
        })
    }

    createSale = () => {
        var newSale = {
            name: this.state.name,
            expirationDate: this.state.expirationDate,
            percentOff: this.state.amountOff,
            itemName: this.state.itemName,
            description: this.state.amountOff + "% off of " + this.state.itemName + " until " + this.state.expirationDate + " or a max of " + this.state.maxSold + " sold",
            maxSold: this.state.maxSold
        }

        var sales = this.state.salesArray;
        sales.push(newSale);

        this.setState({
            salesArray: sales,
            name: '',
            itemName: '',
            expirationDate: '',
            type: '',
            amountOff: '',
            maxSold: 0
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
                    </List>
                    <div className={classes.container}>
                    <TextField label="Sale Name"onChange={this.handleNameChange} value={this.state.name} style={{'padding-right': '20px', 'margin-left': '20px'}}></TextField>
                        <TextField type="date" label="Expiration Date" onChange={this.handleDateChange} value={this.state.expirationDate} InputLabelProps={{shrink: true,}} style={{'margin-right': '20px',}}></TextField>
                        <TextField label="Percent Off" value={this.state.amountOff} onChange={this.handlePercentChange} InputProps={{endAdornment: <InputAdornment position="end">%</InputAdornment>,}} style={{'margin-right': '20px',}}></TextField>
                        <TextField label="Item Name" value={this.state.itemName} onChange={this.handleItemChange} style={{'margin-right': '20px',}}></TextField>
                    </div>
                    <Button onClick={this.createSale} variant="contained" className={classes.button}>Add</Button>
                </Paper>
                <Paper className={classes.discounts}>
                    <Typography variant="h5" align="center" color="textPrimary" gutterBottom className={classes.header}>Discount Codes</Typography>
                    <List>
                        {this.state.discountArray.map((discount, id) => {
                            return (
                                <ListItem key={id}>
                                    <ListItemText>{discount.code}</ListItemText>
                                    <ListItemText>{discount.percentOff + "%"}</ListItemText>
                                    <ListItemText>{discount.used + "/" + discount.maxUse}</ListItemText>
                                    <Button onClick={() => this.handleCloseD(discount.code)}>
                                        <CloseIcon/>
                                    </Button>
                                </ListItem>
                            )
                        })}
                    </List>
                    <div className={classes.container}>
                        <TextField label="Discount Code" onChange={this.handleCodeChange} value={this.state.code} style={{'padding-right': '20px', 'margin-left': '20px'}}></TextField>
                        <TextField label="Percent Off" value={this.state.percentOff} onChange={this.handlePercentChangeD} InputProps={{endAdornment: <InputAdornment position="end">%</InputAdornment>,}} style={{'margin-right': '20px',}}></TextField>
                        <TextField label="Max Uses" onChange={this.handleUseChange} value={this.state.maxUse} style={{'margin-right': '20px',}}></TextField>
                    </div>
                    <Button onClick={this.createDiscount} variant="contained" className={classes.button}>Add</Button>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(AccountSales);