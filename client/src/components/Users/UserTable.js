import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import { inject, observer } from 'mobx-react';

import {NavLink} from 'react-router-dom';

import TextButton from '../UI/TextButton/TextButton';
import UserGroupToggles from './UserGroupToggles/UserGroupToggles';

import Input from '../UI/Input/Input';
import Spinner from '../UI/Spinner/Spinner';

import classes from './UserTable.module.scss';

@inject('stores')
@observer @autobind
class UserTable extends Component {

    async componentDidMount() {
        await this.load();
    }

    load = async () => {
        const { Users } = this.props.stores;
        
        if (!Users.isLoaded) {
            Users.load();
        }
    }

    setUser = (userId) => {
        const { Users } = this.props.stores;
        Users.setCurrentUser(userId);
    }

    render() {
        let content = <Spinner />;
        
        const { Users } = this.props.stores;

        content = Users.users.map((user, index) => {
            const userGroupToggles = <UserGroupToggles 
                key={user.id}
                userId={user.id} />;

            const rowStyle = index % 2 ? classes.Even : classes.Odd;

            return (
                <div key={user.id} className={[classes.UserRow, rowStyle].join(' ')}>
                    <div className={classes.Username}>{user.username}</div>
                    {userGroupToggles}
                    
                    <TextButton clicked={() => this.setUser(user.id)}>Keys</TextButton>
                </div>
            );
        });

        return (
            <div>
                {content}
            </div>            
        );
    }

}

export default UserTable;