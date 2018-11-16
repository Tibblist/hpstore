import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { AuthService } from '../../backend/client/auth';

const request = require('superagent');

const styles = theme => ({
  root: {
      'margin-left': '20%',
      'margin-right': '5%',
      'margin-top': '5px',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  expContent: {
    'margin-left': 'auto',
    'margin-right': 'auto',
  },
  submitButton: {
    'display': 'block',
    'margin-left': 'auto',
    'margin-right': 'auto',
    'margin-top': '30px'
  },
  formControl: {
        'display': 'block',
        'margin-left': 'auto',
        'margin-right': 'auto',
  }
});

class AccountSettings extends React.Component {
  state = {
    expanded: null,
    location: "1DQ1-A - 1-st Thetastar of Dickbutt",
    character: ''
  };

  componentDidMount() {
    this.fetchData();
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  handleLocationChange = (event) => {
    this.setState({
        location: event.target.value
    })
  }

  handleCharacterChange = (event) => {
    this.setState({
      character: event.target.value
    })
  }

  updateSettings = () => {
    request
        .post("/api/postSettings")
        .set('Authorization', AuthService.getToken())
        .send({character: this.state.character, location: this.state.location})
        .retry(2)
        .end((err, res) => {
            if (err) {
                console.log(err);
            }
        })
  }

  fetchData = () => {
    request
    .get("/api/getSettings")
    .set('Authorization', AuthService.getToken())
    .end((err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        this.setState({
            character: res.body.character,
            location: res.body.location
        });
    })
}

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;

    return (
      <div className={classes.root}>
        <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Default Character</Typography>
            <Typography className={classes.secondaryHeading}>Default character for delivery</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className={classes.expContent}>
                <TextField placeholder="Name" value={this.state.character} onChange={this.handleCharacterChange}>
                </TextField>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Delivery Location</Typography>
            <Typography className={classes.secondaryHeading}>
              Default location for build delivery
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <FormControl className={classes.formControl}>
              <Select
                value={this.state.location}
                onChange={this.handleLocationChange}
                inputProps={{
                  name: 'Delivery Location',
                  id: 'location',
                }}
                className={classes.menu}
              >
                <MenuItem className={classes.menuItem} value={"1DQ1-A - 1-st Thetastar of Dickbutt"}>
                  <em>1DQ1-A - 1-st Thetastar of Dickbutt</em>
                </MenuItem>
                <MenuItem className={classes.menuItem} value={"J5A-IX - The Player of Games"}>J5A-IX - The Player of Games</MenuItem>
                <MenuItem className={classes.menuItem} value={"D-W7F0 - #% Gaarastar %#"}>D-W7F0 - #% Gaarastar %#</MenuItem>
                <MenuItem className={classes.menuItem} value={"F-NXLQ - Babylon 5-Bil"}>F-NXLQ - Babylon 5-Bil</MenuItem>
                <MenuItem className={classes.menuItem} value={"B17O-R - Onii-chan League Headquarters"}>B17O-R - Onii-chan League Headquarters</MenuItem>
              </Select>
            </FormControl>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <Button variant="contained" className={classes.submitButton} onClick={this.updateSettings}>
          Save
        </Button>
      </div>
    );
  }
}

AccountSettings.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AccountSettings);
