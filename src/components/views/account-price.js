import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { AuthService } from '../../backend/client/auth';
const request = require('superagent');


const styles = theme => ({
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
        'width': '20%',
        'margin-left': '42.5%',
        'margin-right': '40%'
    },
    label: {
        'margin-left': '50%',
    }

});

class AccountPrice extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            matArray: [] 
        };
        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        request
        .get("/api/getMatPrices")
        .end((err, res) => {
            if (err) {
                console.log(err);
                this.setState({
                    matArray: [{id: '0', name: 'Error getting items', price: 0}]
                });
                return;
            }
            this.setState({
                matArray: res.body
            });
        })
    }

    handleChange = (id, event) => {
        console.log("id of changed item is: " + id);
        console.log(event.target.value);
        for (var i = 0; i < this.state.matArray.length; i++) {
            if (this.state.matArray[i].id == id) {
                this.state.matArray[i].price = event.target.value;
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
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                {this.state.matArray.map((item, id) => {
                    return <Paper key={id}>
                        <p className={classes.label}>{item.name}</p>
                        <TextField className={classes.text} defaultValue={item.price} placeholder={String(item.price)} onChange={(e) => this.handleChange(item.id, e)}>
                        </TextField>
                    </Paper>
                })}
                <Button variant="contained" className={classes.submitButton}b onClick={this.submitChanges}>
                    Submit
                </Button>
            </div>
        );
    }
}

export default withStyles(styles)(AccountPrice);