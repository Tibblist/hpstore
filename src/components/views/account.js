import React from 'react';
import SideBar from '../utils/account-sidebar';
import AccountDash from './account-dashboard';
import AccountOrders from './account-orders';
import AccountUsers from './account-users';
import AccountReports from './account-reports';
import AccountSettings from './account-settings';
import AccountPrice from './account-price';
import TableCell from '@material-ui/core/TableCell';
import {Route} from 'react-router-dom';
import { AuthService } from '../../backend/client/auth';

const request = require('superagent');

const Status = Object.freeze({
    PAY:    <TableCell style={{backgroundColor: "yellow"}}><b style={{color: "black"}}>Confirming Payment</b></TableCell>,
    BUILD:  <TableCell style={{backgroundColor: "green"}}><b style={{color: "black"}}>In Build</b></TableCell>,
    DELAY:  <TableCell style={{backgroundColor: "yellow"}}><b style={{color: "black"}}>Build Delayed</b></TableCell>,
    REJECT: <TableCell style={{backgroundColor: "red"}}><b style={{color: "black"}}>Rejected</b></TableCell>,
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
    }

    fetchData = () => {
        request
        .get("/api/getOrders")
        .set('Authorization', AuthService.getToken())
        .end((err, res) => {
            console.log(res.body);
            if (err) {
                console.log(err);
            }
            if (res.body == null) {
                return;
            }
            for (var i = 0; i < res.body.data.length; i++) {
                if (res.body.isBuilder) {
                    res.body.data[i][8] = showStatus(parseInt(res.body.data[i][8], 10));
                } else {
                    res.body.data[i][7] = showStatus(parseInt(res.body.data[i][7], 10));
                }
            }
            this.setState({
                isBuilder: res.body.isBuilder,
                data: res.body.data
            })
        });
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
                <AccountOrders {...routeProps} data={this.state.data} isBuilder={this.state.isBuilder}/>
            )}/>
            <Route path="/account/users" component={AccountUsers}/>
            <Route path="/account/reports" component={AccountReports}/>
            <Route path="/account/price" component={AccountPrice}/>
            <Route path="/account/settings" component={AccountSettings}/>
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
        default:
            return "ERROR NO STATUS"
    }
}

export default AccountHome;