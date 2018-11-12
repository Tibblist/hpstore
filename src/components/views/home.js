import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';

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
        'width': '15%',
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

    }
});
class Home extends React.Component {

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Paper className={classes.header}>
                    <img src="https://imageserver.eveonline.com/Corporation/98523546_256.png" alt="Hello"></img>
                    <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                        Hole Puncher's Store
                    </Typography>
                    <Typography variant="h6" align="center" color="textSecondary" paragraph>
                        Welcome to our webstore.
                    </Typography>
                    <Typography variant="h6" align="center" color="textSecondary" paragraph>
                        Here you will find the best prices on almost any item in EVE, as well as an amazingly simple shopping process that will allow you to buy exactly what you want and easily track your orders from start to finish.
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
                                image="https://image.eveonline.com/Render/11567_256.png"
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
                                image="https://image.eveonline.com/Render/11567_256.png"
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

                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(Home);