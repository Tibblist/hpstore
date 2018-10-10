import React from 'react';
import '../../css/store-header.css';

export default class StoreHeader extends React.Component {
    render () {
        return (
            <div className="search-bar">
                <input type="text" placeholder="Search.."></input>
            </div>
        );
    }
}