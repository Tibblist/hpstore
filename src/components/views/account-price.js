import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { AuthService } from '../../backend/client/auth';
import { Typography, List, ListItem, ListItemText, FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import CloseIcon from '@material-ui/icons/Close';
import Input from '@material-ui/core/Input';

const request = require('superagent');


const styles = theme => ({
    root: {
        'margin-left': '10%'
    },
    container: {
        'margin-left': '10%',
        'margin-right': '10%',
        'margin-top': '15px',
        display: 'flex',
        'justify-content': 'space-around',
    },
    priceItem: {
        'margin-right': '10%',
        'margin-left': '10%',
        'margin-top': '10px',
    },
    submitButton: {
        'display': 'block',
        'margin-right': 'auto',
        'margin-left': 'auto',
        'margin-top': '25px',
    },
    text: {
        'width': '50%',
        'display': 'block',
        'margin-right': 'auto',
        'margin-left': 'auto',
    },
    label: {
        'text-align': 'center'
    },
    margins: {
        'width': 'auto',
    },
    prices: {
        'width': 'auto',
    },
    pricelist: {
        'width': 'auto',
    },
    ooolist: {
        width: 'auto'
    },
    form: {
        display: 'flex',
        'justify-content': 'space-around',
    }
});

const numberWithCommas = (x) => {
    if (x === null) {
        return null;
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function compareStrings(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
  
    return (a < b) ? -1 : (a > b) ? 1 : 0;
}

class AccountPrice extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            matArray: [],
            categoryArray: [],
            priceList: [],
            id: 0,
            price: 0,
            items: [],
            oooid: 0,
            ooolist: [],
            itemArray: []
        };
        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        request
        .get("/api/getMatPrices")
        .set('Authorization', AuthService.getToken())
        .end((err, res) => {
            if (err) {
                console.log(err);
                this.setState({
                    matArray: [{id: '0', name: 'Error getting prices', price: 0}]
                });
                return;
            }
            this.setState({
                matArray: res.body
            });
        })
        request
        .get("/api/getMargins")
        .set('Authorization', AuthService.getToken())
        .end((err, res) => {
            if (err) {
                console.log(err);
                this.setState({
                    categoryArray: [{id: '0', name: 'Error getting margins', price: 0}]
                });
                return;
            }
            var categoryArray = res.body.sort(function (a, b) {
                return compareStrings(a.name, b.name);
            })
            this.setState({
                categoryArray: categoryArray
            });
        })
        request
        .get("/api/getItems")
        .set('Authorization', AuthService.getToken())
        .end((err, res) => {
            if (err) {
                console.log(err);
                this.setState({
                    items: [{name: "Error getting items"}]
                }); 
                return;
            }
            var newSuggestions = [];
            for (var i = 0; i < res.body.length; i++) {
              newSuggestions.push({name: res.body[i].name, id: res.body[i].id});
            }
            newSuggestions.sort(function (a, b) {
                return compareStrings(a.name, b.name);
            })
            this.setState({
                items: newSuggestions,
                itemArray: res.body
            });
        })
        request
        .get("/api/getPricelist")
        .set('Authorization', AuthService.getToken())
        .end((err, res) => {
            if (err) {
                console.log(err);
                this.setState({
                    priceList: [{name: "Error getting items"}]
                }); 
                return;
            }
            this.setState({
                priceList: res.body
            })
        })
        request
        .get("/api/getoooList")
        .set('Authorization', AuthService.getToken())
        .end((err, res) => {
            if (err) {
                console.log(err);
                this.setState({
                    ooolist: [{id: 0}]
                }); 
                return;
            }
            this.setState({
                ooolist: res.body
            })
        })
    }

    handleMatChange = (id, event) => {
        for (var i = 0; i < this.state.matArray.length; i++) {
            if (this.state.matArray[i].id == id) {
                this.state.matArray[i].price = event.target.value;
            }
        }
    }

    handleMarginChange = (id, event) => {
        for (var i = 0; i < this.state.categoryArray.length; i++) {
            if (this.state.categoryArray[i].id == id) {
                this.state.categoryArray[i].margin = event.target.value;
            }
        }
    }

    handleItemChange = (event) => {
        this.setState({
            id: event.target.value
        })
    }

    handlePriceChange = (event) => {
        this.setState({
            price: event.target.value
        })
    }

    handleoooChange = (event) => {
        this.setState({
            oooid: event.target.value
        })
    }

    findName = (id) => {
        if (id === 0) {
            return "Couldn't get items";
        }
        for (var i = 0; i < this.state.itemArray.length; i++) {
            if (this.state.itemArray[i].id === id) {
                return this.state.itemArray[i].name
            }
        }
        return "Item id: " + id + " has no name"
    }

    createCustomPrice = () => {
        if (this.state.id === 0) {
            return;
        }
        var newItem = {
            id: this.state.id,
            name: this.findName(this.state.id),
            price: this.state.price
        }
        for (let i = 0; i < this.state.priceList.length; i++) {
            if (this.state.priceList[i].id === newItem.id) {
                this.state.priceList[i].price = this.state.price;
                this.clearState();
                return;
            }
        }
        
        var priceList = this.state.priceList;
        priceList.push(newItem);

        this.setState({
            priceList: priceList
        })
        this.clearState();
    }

    createooo = () => {
        var ooolist = this.state.ooolist;
        for (var i = 0;  i < ooolist.length; i++) {
            if (ooolist[i].id === this.state.oooid) {
                return;
            }
        }
        ooolist.push(this.state.oooid);
        this.setState({
            ooolist: ooolist,
            oooid: 0
        })
    }

    clearState = () => {
        this.setState({
            id: 0,
            price: 0
        })
    }

    clearCustomPrice = (name) => {
        var priceList = this.state.priceList;
        for (let i = 0; i < priceList.length; i++) {
            if (priceList[i].name === name) {
                priceList.splice(i, 1);
            }
        }
        this.setState({
            priceList: priceList
        })
    }

    clearoooId = (id) => {
        console.log(id);
        var ooolist = this.state.ooolist;
        for (var i = 0;  i < ooolist.length; i++) {
            if (ooolist[i] === id) {
                ooolist.splice(i, 1);
            }
        }
        console.log(ooolist)
        this.setState({
            ooolist: ooolist
        })
    }

    submitMats = () => {
        request
        .post("/api/postMatPrices")
        .set('Authorization', AuthService.getToken())
        .send(this.state.matArray)
        .retry(2)
        .end((err, res) => {
            if (err) {
                console.log(err);
            }
        })
    }

    submitMargins = () => {
        request
        .post("/api/postMargins")
        .set('Authorization', AuthService.getToken())
        .send(this.state.categoryArray)
        .retry(2)
        .end((err, res) => {
            if (err) {
                console.log(err);
            }
        })
    }

    submitPricelist = () => {
        request
        .post("/api/postPricelist")
        .set('Authorization', AuthService.getToken())
        .send(this.state.priceList)
        .retry(2)
        .end((err, res) => {
            if (err) {
                console.log(err);
            }
        })
    }

    submitoooList = () => {
        request
        .post("/api/postoooList")
        .set('Authorization', AuthService.getToken())
        .send(this.state.ooolist)
        .retry(2)
        .end((err, res) => {
            if (err) {
                console.log(err);
            }
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.container}>
                    <div className={classes.prices}>
                        <Typography>Raw Material Base Pricing</Typography>
                        {this.state.matArray.map((item, id) => {
                            return <Paper key={id}>
                                <p className={classes.label}>{item.name}</p>
                                <TextField 
                                className={classes.text} 
                                defaultValue={item.price} 
                                placeholder={String(item.price)} 
                                onChange={(e) => this.handleMatChange(item.id, e)}>
                                </TextField>
                            </Paper>
                        })}
                        <Button variant="contained" className={classes.submitButton} onClick={this.submitMats}>
                            Submit
                        </Button>
                    </div>
                    <div className={classes.margins}>
                        <Typography>Item Categorical Margins</Typography>
                        {this.state.categoryArray.map((item, id) => {
                            return <Paper key={id}>
                                <p className={classes.label}>{item.name}</p>
                                <TextField 
                                className={classes.text} 
                                defaultValue={item.margin} 
                                placeholder={String(item.margin)} 
                                onChange={(e) => this.handleMarginChange(item.id, e)}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                  }}
                                />
                            </Paper>
                        })}
                        <Button variant="contained" className={classes.submitButton} onClick={this.submitMargins}>
                            Submit
                        </Button>
                    </div>
                    <div className={classes.pricelist}>
                        <Typography>Item Custom Pricelist</Typography>
                        <List>
                            {this.state.priceList.map((item, id) => {
                                return (
                                    <ListItem key={id}>
                                        <ListItemText>{item.name}</ListItemText>
                                        <ListItemText>{numberWithCommas(item.price)} ISK</ListItemText>
                                        <Button onClick={() => this.clearCustomPrice(item.name)}>
                                            <CloseIcon/>
                                        </Button>
                                    </ListItem>
                                )
                            })}
                        </List>
                        <div className={classes.form}>
                            <FormControl style={{ 'margin-right': 20, 'margin-left': 20 }}>
                                <InputLabel htmlFor="item-helper">Item Name</InputLabel>
                                <Select
                                    value={this.state.id}
                                    onChange={this.handleItemChange}
                                    input={<Input name="item" id="item-helper" />}
                                >
                                    {this.state.items.map((item, id) => {
                                        return (
                                            <MenuItem value={item.id} key={id}>{item.name}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            <TextField label="Item Price" onChange={this.handlePriceChange} value={this.state.price} InputProps={{ endAdornment: <InputAdornment position="end">$</InputAdornment>, }} style={{ 'margin-right': 20 }}></TextField>
                        </div>
                        <Button variant="contained" className={classes.submitButton} onClick={this.createCustomPrice}>Add</Button>
                        <Button variant="contained" className={classes.submitButton} onClick={this.submitPricelist}>
                            Submit
                        </Button>
                    </div>
                    <div className={classes.ooolist}>
                        <Typography>Out of Order List</Typography>
                        <List>
                            {this.state.ooolist.map((item, id) => {
                                return (
                                    <ListItem key={id}>
                                        <ListItemText>{this.findName(item)}</ListItemText>
                                        <Button onClick={() => this.clearoooId(item)}>
                                            <CloseIcon/>
                                        </Button>
                                    </ListItem>
                                )
                            })}
                        </List>
                        <div className={classes.form}>
                            <FormControl style={{ 'margin-right': 20, 'margin-left': 20 }} >
                                <InputLabel htmlFor="item-helper">Item Name</InputLabel>
                                <Select
                                    value={this.state.oooid}
                                    onChange={this.handleoooChange}
                                    input={<Input name="item" id="item-helper" />}
                                >
                                    {this.state.items.map((item, id) => {
                                        return (
                                            <MenuItem value={item.id} key={id}>{item.name}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        </div>
                        <Button variant="contained" className={classes.submitButton} onClick={this.createooo}>Add</Button>
                        <Button variant="contained" className={classes.submitButton} onClick={this.submitoooList}>
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(AccountPrice);