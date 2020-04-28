import React from 'react';
import {HashRouter as Router, Switch} from 'react-router-dom';
import AppLayout from './AppLayout';
import HomeRouter from './routers/home'

const BasicRoute = () => (
    <Router>
        <Switch>
            <HomeRouter path="/" component={AppLayout}/>
        </Switch>
    </Router>
);

export default BasicRoute;