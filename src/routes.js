import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './app';
import Home from './index';
import Store from './store';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Home} />
    <Route path='contact' component={Store} />
    <Route path='*' component={Home} />
  </Route>
);