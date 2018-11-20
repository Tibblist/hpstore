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
import TableCell from '@material-ui/core/TableCell';
import {Route, Link} from 'react-router-dom';
import { AuthService } from '../../backend/client/auth';

const request = require('superagent');

const Status = Object.freeze({
    PAY:    <TableCell style={{backgroundColor: "yellow"}}><b style={{color: "black"}}>Confirming Payment</b></TableCell>,
    BUILD:  <TableCell style={{backgroundColor: "green"}}><b style={{color: "black"}}>In Build</b></TableCell>,
    DELAY:  <TableCell style={{backgroundColor: "yellow"}}><b style={{color: "black"}}>Build Delayed</b></TableCell>,
    REJECT: <TableCell style={{backgroundColor: "red"}}><b style={{color: "black"}}>Rejected</b></TableCell>,
    DELIVERED: <TableCell style={{backgroundColor: "green"}}><b style={{color: "black"}}>Delivered</b></TableCell>,
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
                    res.body.data[i][10] = showStatus(parseInt(res.body.data[i][10], 10));
                    res.body.data[i][4] = createLink(res.body.data[i][0])
                } else {
                    res.body.data[i][9] = showStatus(parseInt(res.body.data[i][9], 10));
                    res.body.data[i][3] = createLink(res.body.data[i][0]);
                }
            }
            var data = res.body.data.reverse();
            this.setState({
                isBuilder: res.body.isBuilder,
                data: data
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
    return <Link to={"/account/order/" + id}>View Items</Link>
}

export default AccountHome;