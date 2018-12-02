import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import { inject, observer } from 'mobx-react';
// import {Redirect} from 'react-router-dom';

import classes from './Dashboard.scss';

@inject('stores')
@observer @autobind
class Dashboard extends Component {

    render() {
        return (
            <div>
                <div>Dashboard goes here</div>
            </div>            
        );
    }
}

export default Dashboard;