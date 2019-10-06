import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import { inject, observer } from 'mobx-react';

import UserTable from '../../components/Users/UserTable'; 
import AddUser from '../../components/Users/AddUser/AddUser';
import UserKeys from '../../components/Users/UserKeys/UserKeys';

import classes from './UsersScreen.module.scss';

@inject('stores')
@observer @autobind
class UsersScreen extends Component {

    render() {

        let content = null;

        const { Users } = this.props.stores;
        const { currentUserId } = Users;

        if (currentUserId) {
            content = (
                <div>
                    <UserKeys />
                    <hr />
                    <div className={classes.UserForm}>
                        <h4>Edit User</h4>
                        <AddUser userId={currentUserId} /> 
                    </div>
                </div>
            );

        } else {
            content = (
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

        return (
            <div className={classes.UsersScreen}>
                {content}
            </div>            
        );
    }
}

export default UsersScreen;