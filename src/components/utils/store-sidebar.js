import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { AuthService } from '../../backend/client/auth';
import Paper from '@material-ui/core/Paper';
import { Divider, ListItemText, List, ListItem } from '@material-ui/core';

const request = require('superagent');

const styles = theme => ({
    root: {
        'float': 'left',
        'position': 'absolute',
        'width': '20%'
    },
    list: {
        display: 'inline-block',
        zIndex: 2,
        'float': 'left',
        'background-color': "white",
    },
    container: {
        'margin-top': '20px',
        'display': 'inline-block'
    },
    listContainer: {
        height: '100%',
    }
});

class StoreSideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            categoryArray: [] 
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        request
        .get("/api/getCategories")
        .set('Authorization', AuthService.getToken())
        .end((err, res) => {
            if (err) {
                console.log(err);
                this.setState({
                    categoryArray: [{id: '0', name: 'Error getting margins', price: 0}]
                });
                return;
            }
            var categoryArray = res.body;
            console.log(res.body)
            categoryArray.sort(function (a, b) {
                return compareStrings(a.name, b.name);
            })
            this.setState({
                categoryArray: categoryArray
            });
        })
    }

    handleClick = (group) => {
        this.props.filterArray(group);
    }

    render () {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Paper className={classes.container}>
                    <List className={classes.list}>
                        {this.state.categoryArray.map((category, id) => {
                            return (
                                <ListItem button onClick={() => this.handleClick(category.id)}>
                                    <Divider />
                                    <ListItemText>{category.name}</ListItemText>
                                </ListItem>
                            )
                        })}
                    </List>
                </Paper>
            </div>
        )
    }
}

function compareStrings(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
  
    return (a < b) ? -1 : (a > b) ? 1 : 0;
  }

export default withStyles(styles)(StoreSideBar);