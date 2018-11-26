import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import { List, ListItemText } from '@material-ui/core';

const styles = theme => ({
    root: {
        //'margin-right': '7.5%',
    },
    container: {
        display: 'flex',
        'justify-content': 'space-around',
        'padding-bottom': 20,
    },
    card: {
        //'display': 'inline-block',
        'flex': '1 1 0',
        'margin-left': 25,
        'margin-right': 25
    },
    cardMedia: {
        height: 256,
        'display': 'block',
        'margin-left': 'auto',
        'margin-right': 'auto',
    },
    cardContent: {
        flexGrow: 1,
        'text-align': 'center'
    },
    grid: {
        'margin-left': '5%',
        'margin-top': '5%',
        'margin-right': '5%'
    },
    button: {
        'display': 'block',
        'margin-left': 'auto',
        'margin-right': 'auto',
        'margin-top': '20px',
    },
    header: {
        'text-align': 'center',
        'padding-bottom': 20,
    },
    list: {

    },
    img: {
        'display': 'block',
        'margin-left': 'auto',
        'margin-right': 'auto',
    }
});
class Home extends React.Component {

    componentDidMount() {
        document.title = "Hole Punchers Webstore";
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <img className={classes.img} src="https://imageserver.eveonline.com/Corporation/98523546_256.png" alt="Hello"></img>
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    Hole Puncher's Store
                    </Typography>
                <Typography variant="h6" align="center" color="textSecondary" paragraph>
                    Welcome to our webstore.
                    </Typography>
                <Typography variant="h6" align="center" color="textSecondary" paragraph>
                    Here you will find the best prices on almost any item in EVE, as well as an amazingly simple shopping process that will allow you to buy exactly what you want and easily track your orders from start to finish.
                    </Typography>
                <Typography variant="h6" align="center" color="textSecondary" paragraph>
                    Why use us?
                        <List className={classes.list}>
                        <ListItemText>Reliability - Our order management system is one of a kind and will allow you to track your order every step of the way.</ListItemText>
                        <ListItemText>Pricing - While our pricing may not be the best on every single item, we are confident that the overall price of complex orders will be lower, and easier to keep track of, than any other builders.</ListItemText>
                        <ListItemText>Deals - Have you ever used an EVE Online store that actually offered promotional deals and discounts on a regular basis? We didn't think so.</ListItemText>
                        <ListItemText>Experience - Our builders know this game and have been both PVPing and building ships for years. They are well equipped to fulfill and anticipate your every need.</ListItemText>
                    </List>
                </Typography>
                <div className={classes.container}>
                    <Card className={classes.card}>
                        <CardMedia
                            className={classes.cardMedia}
                            image="https://image.eveonline.com/Render/11567_256.png"
                            title="Buy all capitals and beyond"
                        />
                        <CardContent className={classes.cardContent}>
                            <Typography gutterBottom variant="h5" component="h2">
                                Browse our store
                            </Typography>
                            <Typography>
                                You can buy anything you can imagine in our store from frigates all the way to titans! You won't ever need to shop anywhere else.
                            </Typography>
                            <CardActions>
                                <Button variant='outlined' className={classes.button} component={Link} to="/store">
                                    Shop Now!
                                </Button>
                            </CardActions>
                        </CardContent>
                    </Card>
                    <Card className={classes.card}>
                        <CardMedia
                            className={classes.cardMedia}
                            image="https://i.imgur.com/mmPeq0i.png"
                            title="Buy all capitals and beyond"
                        />
                        <CardContent className={classes.cardContent}>
                            <Typography gutterBottom variant="h5" component="h2">
                                Custom Fits
                            </Typography>
                            <Typography>
                                Using our fit parser you can get quotes on the build price for nearly any fit, and buy them en masse.
                            </Typography>
                            <CardActions>
                                <Button disabled variant='outlined' className={classes.button}>
                                    Coming Soon
                                    </Button>
                            </CardActions>
                        </CardContent>
                    </Card>
                    <Card className={classes.card}>
                        <CardMedia
                            className={classes.cardMedia}
                            image="https://image.eveonline.com/Render/22852_256.png"
                            title="Buy all capitals and beyond"
                        />
                        <CardContent className={classes.cardContent}>
                            <Typography gutterBottom variant="h5" component="h2">
                                Discounts and Sales
                            </Typography>
                            <Typography>
                                Be sure to check our sales page regularly to see if we have overstock to sell and/or special deals going on.
                            </Typography>
                            <CardActions>
                                <Button disabled variant='outlined' className={classes.button}>
                                    Coming Soon
                                    </Button>
                            </CardActions>
                        </CardContent>
                    </Card>
                </div>
                <Typography variant="h5" align="center" color="textPrimary" paragraph>Want to get rid of excess ore and/or raw mats? We buyback most materials, come inquire about how we can help you get cold hard cash faster on our discord <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/Q2z6WFD">Click Here!</a></Typography>
                <Typography variant="h5" align="center" color="textPrimary" paragraph>Are you a builder that wants to move product faster and more efficiently? <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/Q2z6WFD">Click Here!</a> and let us know you are a builder</Typography>
            </div>
        );
    }
}

export default withStyles(styles)(Home);