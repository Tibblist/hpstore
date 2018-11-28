import { List, ListItemText, Paper, Typography, Select, InputLabel, FormControl, MenuItem, Input, TextField, OutlinedInput, InputAdornment } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import ReactDOM from 'react-dom';

const styles = theme => ({
    root: {

    },
    img: {
        'display': 'block',
        'margin-left': 'auto',
        'margin-right': 'auto',
    },
    calc: {
        'display': 'flex',
        'flex-direction': 'row',
        'justify-content': 'center'
    },
    field: {
        'margin-right': 20
    }
});

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class JumpFreight extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trip: {
                to: 1,
                from: 2,
                mass: "",
                collateral: "",
                total: 0,
                reward: 0
            }
        }
    }

    componentDidMount() {
        this.setState({
          labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
          label2Width: ReactDOM.findDOMNode(this.InputLabelRef2).offsetWidth,
        });
    }

    handleCollateralChange = (event) => {
        var value = event.target.value.replace(/,/g, '');
        if (isNaN(value)) {
            return;
        }
        var trip = this.state.trip;
        if (value !== "") trip.collateral = numberWithCommas(parseInt(value, 10));
        else trip.collateral = "";
        this.setState({
            trip: trip
        });
    }

    handleMassChange = (event) => {
        var value = event.target.value.replace(/,/g, '');
        if (isNaN(value)) {
            return;
        }
        var trip = this.state.trip;
        if (value !== "") trip.mass = numberWithCommas(parseInt(value, 10));
        else trip.mass = "";
        this.setState({
            trip: trip
        });
    }

    handleFromChange = (event) => {
        var trip = this.state.trip;
        if (trip.to === event.target.value) {
            trip.to = trip.from;
        }
        trip.from = event.target.value;
        this.setState({
            trip: trip
        });
    }

    handleToChange = (event) => {
        var trip = this.state.trip;
        if (trip.from === event.target.value) {
            trip.from = trip.to;
        }
        trip.to = event.target.value;
        this.setState({
            trip: trip
        });
    }

    calculateReward = () => {
        var trip = this.state.trip;
        if (trip.from === 1) {
            return (trip.mass.replace(/,/g, '') * 900) + (trip.collateral.replace(/,/g, '') * 0.05)
        } else if (trip.from === 2) {
            return (trip.mass.replace(/,/g, '') * 1000) + (trip.collateral.replace(/,/g, '') * 0.05)
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Paper>
                    <img src="https://imageserver.eveonline.com/Corporation/98580977_256.png" alt="Corp Logo" className={classes.img}></img>
                    <Typography variant="h2" align="center">Hole Puncher's Jump Freighting Service</Typography>
                    <Typography variant="h6" align="center" color="textSecondary" paragraph>Use our affordable and reliable services to move your goods to and from Jita. All contracts are delivered with in 48h or less, or its free!</Typography>
                    <Typography variant="h6" align="center" color="textPrimary" paragraph>Courier contract to Abyssal Freighting</Typography>
                    <Typography variant="p" align="center" color="textSecondary" paragraph>
                        <List>
                            <ListItemText>Rates are:</ListItemText>
                            <ListItemText>900 ISK per m3 from Jita to J5A</ListItemText>
                            <ListItemText>1,000 ISK per m3 from J5A to Jita</ListItemText>
                            <ListItemText>5% fee for collateral, max collateral is 5 Billion ISK</ListItemText>
                        </List>
                    </Typography>
                    <div className={classes.calc}>
                        <FormControl variant="outlined" className={classes.field}>
                        <InputLabel
                            ref={ref => {
                            this.InputLabelRef = ref;
                            }}
                            htmlFor="item-helper"
                        >
                            Pickup Location
                        </InputLabel>
                            <Select
                                value={this.state.trip.from}
                                onChange={this.handleFromChange}
                                input={<OutlinedInput
                                    labelWidth={this.state.labelWidth}
                                    name="item"
                                    id="item-helper"
                                  />}
                            >
                                <MenuItem value={1}>J5A-IX - Fuel Cartel HQ</MenuItem>
                                <MenuItem value={2}>Jita IV - Moon 4 - Caldari Navy Assembly Plant</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" className={classes.field}>
                        <InputLabel
                            ref={ref => {
                            this.InputLabelRef2 = ref;
                            }}
                            htmlFor="item-helper"
                        >
                            Destination
                        </InputLabel>
                            <Select
                                value={this.state.trip.to}
                                onChange={this.handleToChange}
                                input={<OutlinedInput
                                    labelWidth={this.state.label2Width}
                                    name="item"
                                    id="item-helper"
                                  />}
                            >
                                <MenuItem value={1}>J5A-IX - Fuel Cartel HQ</MenuItem>
                                <MenuItem value={2}>Jita IV - Moon 4 - Caldari Navy Assembly Plant</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            className={classes.field}
                            variant="outlined" 
                            value={this.state.trip.mass} 
                            label="Mass" 
                            onChange={this.handleMassChange}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">m3</InputAdornment>,
                            }}
                        />
                        <TextField
                            className={classes.field}
                            variant="outlined" 
                            value={this.state.trip.collateral} 
                            label="Collateral"
                            error={(this.state.trip.collateral.replace(/,/g, '') > 5000000000)}
                            onChange={this.handleCollateralChange}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">ISK</InputAdornment>,
                            }}
                        />
                    </div>
                    <Typography align="center" style={{'padding': 25}}>Reward Needed: {numberWithCommas(this.calculateReward())} ISK</Typography>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(JumpFreight);