import React from 'react';
import SideBar from '../utils/account-sidebar';
import {Route} from 'react-router-dom';

class AccountHome extends React.Component {

    render() {
        return (
            <div>
            <SideBar/>
            <Route path="/account/dashboard" component={}/>
            <Route path="/account/orders" component={}/>
            <Route path="/account/customer" component={}/>
            <Route path="/account/reports" component={}/>
            <Route path="/account/settings" component={}/>
            </div>
        );
    }
}

export default AccountHome;