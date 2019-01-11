import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import { inject, observer } from 'mobx-react';

import UserGroupToggles from './UserGroupToggles/UserGroupToggles';

import Input from '../UI/Input/Input';
import Spinner from '../UI/Spinner/Spinner';

import classes from './UserTable.scss';

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