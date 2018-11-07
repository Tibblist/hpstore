import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { AuthService } from '../../backend/client/auth';
import { Typography } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
const request = require('superagent');


const styles = theme => ({
    root: {

    },
    container: {
        'margin-left': '20%',
        'margin-right': '20%',
        'margin-top': '5%'
    },
    priceItem: {
        'margin-right': '10%',
        'margin-left': '10%',
        'margin-top': '10px',
    },
    submitButton: {
        'margin-right': '50%',
        'margin-left': '50%',
        'margin-top': '25px',
        'margin-bottom': '50px'
    },
    text: {
        'width': '25%',
        'margin-left': '40%',
        'margin-right': '37.5%'
    },
    label: {
        'margin-left': '50%',
    },
    margins: {
        'width': '40%',
        'float': 'right',
    },
    prices: {
        'width': '40%',
        'float': 'left',

    }

});

class AccountPrice extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            matArray: [],
            categoryArray: [] 
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
            this.setState({
                categoryArray: res.body
            });
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

    submitChanges = () => {
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
                    </div>
                </div>
                <Button variant="contained" className={classes.submitButton}b onClick={this.submitChanges}>
                    Submit
                </Button>
            </div>
        );
    }
}

export default withStyles(styles)(AccountPrice);