import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import { inject, observer } from 'mobx-react';
// import {Redirect} from 'react-router-dom';

import Groups from '../../components/Groups/Groups'; 

import classes from './GroupsScreen.scss';

@inject('stores')
@observer @autobind
class GroupsScreen extends Component {

    render() {
        return (
            <div>
                <Groups /> 
            </div>            
        );
    }
}

export default GroupsScreen;