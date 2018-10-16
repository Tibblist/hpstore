import React from 'react';
import SearchBar from '../utils/search-bar';

export default class StoreHeader extends React.Component {
    render () {
        const { classes } = this.props;
        return (
            <SearchBar></SearchBar>
        );
    }
}
