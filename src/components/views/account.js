import React from 'react';
import SideBar from '../utils/account-sidebar';
import AccountDash from './account-dashboard';
import AccountOrders from './account-orders';
import AccountUsers from './account-users';
import AccountReports from './account-reports';
import AccountSettings from './account-settings';
import AccountPrice from './account-price';
import AccountOrder from './account-order';
import AccountSales from './account-sales';
import {Route, Link} from 'react-router-dom';
import { AuthService } from '../../backend/client/auth';
import { Button } from '@material-ui/core';

const request = require('superagent');

const Status = Object.freeze({
    PAY:    <p style={{backgroundColor: "yellow", textAlign: 'center'}}><b style={{color: "black", fontSize: 16}}>Confirming Payment</b></p>,
    BUILD:  <p style={{backgroundColor: "lightgreen", textAlign: 'center'}}><b style={{color: "black", fontSize: 16}}>In Build</b></p>,
    DELAY:  <p style={{backgroundColor: "yellow", textAlign: 'center'}}><b style={{color: "black", fontSize: 16}}>Build Delayed</b></p>,
    REJECT: <p style={{backgroundColor: "red", textAlign: 'center'}}><b style={{color: "black", fontSize: 16}}>Rejected</b></p>,
    DELIVERED: <p style={{backgroundColor: "lightgreen", textAlign: 'center'}}><b style={{color: "black", fontSize: 16, textAlign: 'center'}}>Delivered</b></p>,
});
class AccountHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBuilder: false,
            data: [] 
        };
        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        this.fetchData();
        document.title = "Account";
    }

    fetchData = () => {
        request
        .get("/api/getOrders")
        .set('Authorization', AuthService.getToken())
        .end((err, res) => {
            //console.log(res.body);
            if (err) {
                console.log(err);
            }
            if (res.body == null) {
                return;
            }
            for (var i = 0; i < res.body.data.length; i++) {
                if (res.body.isBuilder) {
                    res.body.data[i][11] = showStatus(parseInt(res.body.data[i][11], 10));
                    res.body.data[i][5] = createLink(res.body.data[i][0])
                    var builder = res.body.data[i][1];
                    var id = res.body.data[i][0];
                    if (builder === "Unclaimed") {
                        res.body.data[i][1] = <Button variant="outlined" value={id} onClick={this.submitClaim}>Claim</Button>
                    } else if (builder === AuthService.getName()) {
                        res.body.data[i][1] = <div><Link to={"/account/order/" + res.body.data[i][0]} style={{ textDecoration: 'none' }}> <Button variant="outlined" value={res.body.data[i][0]} onClick={this.completeOrder} style={{display: 'block', marginRight: 'auto', marginLeft: 'auto', marginBottom: 5}}>Complete Order</Button> <Button variant="outlined" style={{display: 'block', marginRight: 'auto', marginLeft: 'auto', marginBottom: 5}}>Edit Order</Button></Link> <Button variant="outlined" value={res.body.data[i][0]} onClick={this.unClaim} style={{display: 'block', marginRight: 'auto', marginLeft: 'auto', marginBottom: 5}}>Unclaim</Button></div>
                    }
                } else {
                    res.body.data[i][9] = showStatus(parseInt(res.body.data[i][9], 10));
                    res.body.data[i][3] = createLink(res.body.data[i][0]);
                }
                res.body.data[i][0] = <b>{res.body.data[i][0]}</b>
            }
            var data = res.body.data.reverse();
            this.setState({
                isBuilder: res.body.isBuilder,
                data: data
            })
        });
    }

    submitClaim = (event) => {
        event.preventDefault()
        var id = event.currentTarget.value;
        console.log("Submitting claim for order id: " + id);
        request
        .post("/api/claimOrder")
        .set('Authorization', AuthService.getToken())
        .send({id: id})
        .retry(2)
        .end((err, res) => {
            if (err) {
                console.log(err);
            }
            this.fetchData();
        })
    }

    unClaim = (event) => {
        event.preventDefault()
        var id = event.currentTarget.value;
        console.log("Submitting unclaim for order id: " + id);
        request
        .post("/api/unClaimOrder")
        .set('Authorization', AuthService.getToken())
        .send({id: id})
        .retry(2)
        .end((err, res) => {
            if (err) {
                console.log(err);
            }
            this.fetchData();
        })
    }

    completeOrder = (event) => {
        event.preventDefault()
        var id = event.currentTarget.value;
        console.log("Submitting complete for order id: " + id);
        request
        .post("/api/completeOrder")
        .set('Authorization', AuthService.getToken())
        .send({id: id})
        .retry(2)
        .end((err, res) => {
            if (err) {
                console.log(err);
            }
            this.fetchData();
        })
    }

    render() {
        return (
            <div>
            <SideBar/>
            <Route path="/account/dashboard" 
            render={(routeProps) => (
                <AccountDash {...routeProps} data={this.state.data} isBuilder={this.state.isBuilder}/>
            )}/>
            <Route path="/account/orders" 
            render={(routeProps) => (
                <AccountOrders {...routeProps} fetchOrders={this.fetchData} data={this.state.data} isBuilder={this.state.isBuilder} updateOrders={this.fetchData}/>
            )}/>
            <Route path="/account/users" component={AccountUsers}/>
            <Route path="/account/reports" component={AccountReports}/>
            <Route path="/account/price" component={AccountPrice}/>
            <Route path="/account/sales" component={AccountSales}/>
            <Route path="/account/settings" component={AccountSettings}/>
            <Route path="/account/order/:id" render={(routeProps) => (
                <AccountOrder {...routeProps} data={this.state.data} isBuilder={this.state.isBuilder}/>
            )}/>
            </div>
        );
    }
}


function showStatus(status) {
    switch (status) {
        case 1:
            return Status.PAY
        case 2:
            return Status.BUILD
        case 3:
            return Status.DELAY
        case 4:
            return Status.REJECT
        case 5:
            return Status.DELIVERED
        default:
            return "ERROR NO STATUS"
    }
}

function createLink(id) {
    return <Link to={{pathname: "/account/order/" + id, state: {viewOnly: true}}}>View Items</Link>
}

export default AccountHome;