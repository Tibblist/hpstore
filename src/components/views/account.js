import React from 'react';
import SideBar from '../utils/account-sidebar';
import AccountDash from './account-dashboard';
import AccountOrders from './account-orders';
import AccountUsers from './account-users';
import AccountReports from './account-reports';
import AccountSettings from './account-settings';
import {Route} from 'react-router-dom';

class AccountHome extends React.Component {

    render() {
        return (
            <div>
            <SideBar/>
            <Route path="/account/dashboard" component={AccountDash}/>
            <Route path="/account/orders" component={AccountOrders}/>
            <Route path="/account/users" component={AccountUsers}/>
            <Route path="/account/reports" component={AccountReports}/>
            <Route path="/account/settings" component={AccountSettings}/>
            </div>
        );
    }
}

export default AccountHome;