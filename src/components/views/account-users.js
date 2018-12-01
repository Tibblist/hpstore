import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { AuthService } from '../../backend/client/auth';
import { Paper, List, ListItem, ListItemText, FormControl, Select, MenuItem, Divider, Button } from '@material-ui/core';

const request = require('superagent');

const styles = theme => ({
    root: {
        'display': 'block',
        'margin-right': '20%',
        'margin-left': '20%'
    },
    paper: {
        'background-color': 'white'
    },
    button: {
        'display': 'block',
        'margin-right': 'auto',
        'margin-left': 'auto',
        'margin-top': 20,
    }
});

class AccountCustomers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [] 
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        request
        .get("/api/getUsers")
        .set('Authorization', AuthService.getToken())
        .end((err, res) => {
            if (err) {
                console.log(err);
            }
            console.log(res.body);
            this.setState({
                users: res.body
            });
        });
    }

    handleChange = (name, event) => {
        var newUserArray = this.state.users;
        for (var i = 0; i < newUserArray.length; i++) {
            if (newUserArray[i].name === name) {
                newUserArray[i].group = event.target.value;
            }
        }
        this.setState({
            users: newUserArray
        })
    }

    postUsers = () => {
        request
        .post("/api/postUsers")
        .set('Authorization', AuthService.getToken())
        .send(this.state.users)
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
            <Paper className={classes.paper}>
                <List>
                    {this.state.users.map((user, id) => {
                        return (
                            <div key={user.name}>
                                <ListItem>
                                    <ListItemText>{user.name}</ListItemText>
                                    <FormControl>
                                        <Select
                                            value={user.group}
                                            onChange={(e) => this.handleChange(user.name, e)}
                                            inputProps={{
                                                name: 'User Group',
                                                id: 'group',
                                            }}
                                        >
                                            <MenuItem value={0}>Banned</MenuItem>
                                            <MenuItem value={1}>Customer</MenuItem>
                                            <MenuItem value={2}>Builder</MenuItem>
                                            <MenuItem value={3}>Admin</MenuItem>
                                        </Select>
                                    </FormControl>
                                </ListItem>
                                <Divider/>
                            </div>
                        )
                    })}
                </List>
                <Button className={classes.button} variant="contained" onClick={this.postUsers}>Submit</Button>
            </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(AccountCustomers);