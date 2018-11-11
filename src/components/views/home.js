import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        'margin-right': '7.5%',
    },
    card: {
        'display': 'inline-block',
        'width': '25%',
    },
    cardMedia: {
        height: 256,
    },
    cardContent: {
        flexGrow: 1,
    },
    grid: {
        'margin-left': '5%',
        'margin-top': '5%',
        'margin-right': '5%'
    }
});
class Home extends React.Component {

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                        <Card className={classes.card}>
                            <CardMedia
                                className={classes.cardMedia}
                                image="https://image.eveonline.com/Render/11567_512.png"
                                title="Buy all capitals and beyond"
                            />
                            <CardContent className={classes.cardContent}>
                            <Typography gutterBottom variant="h5" component="h2">
                                Browse our store
                            </Typography>
                            <Typography>
                                You can buy anything you can imagine in our store from frigates all the way to titans!
                            </Typography>
                            </CardContent>
                        </Card>
                        <Card className={classes.card}>
                            <CardMedia
                                className={classes.cardMedia}
                                image="https://image.eveonline.com/Render/11567_512.png"
                                title="Buy all capitals and beyond"
                            />
                            <CardContent className={classes.cardContent}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Custom Fits
                            </Typography>
                                <Typography>
                                    Using our fit parser you can get quotes on the build price for nearly any fit, and buy them en masse.
                            </Typography>
                            </CardContent>
                        </Card>
            </div>
        );
    }
}

export default withStyles(styles)(Home);