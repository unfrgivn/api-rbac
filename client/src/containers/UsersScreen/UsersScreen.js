import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import { inject, observer } from 'mobx-react';

import UserTable from '../../components/Users/UserTable'; 
import AddUser from '../../components/Users/AddUser/AddUser';

import classes from './UsersScreen.scss';

@inject('stores')
@observer @autobind
class UsersScreen extends Component {

    render() {
        return (
            <div>
                <div className={classes.UserTable}>
                    <UserTable /> 
                </div>
                
                <div className={classes.UserForm}>
                    <h4>Add User</h4>
                    <AddUser /> 
                </div>
            </div>            
        );
    }
}

export default UsersScreen;