import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import { inject, observer } from 'mobx-react';

import Spinner from '../../UI/Spinner/Spinner';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import TextButton from '../../UI/TextButton/TextButton';

import classes from './UserKeys.scss';

@inject('stores')
@observer @autobind
class UserKeys extends Component {

    generateKey = async (userId) => {
        const { Keys } = this.props.stores;
        const response = Keys.create({
            user_id: userId
        });
    }

    revokeKey = async keyId => {
        const { Keys } = this.props.stores;
        Keys.delete(keyId);
    }

    render() {
        let content = <Spinner />;
        let generateButton = null;
        
        const { Users } = this.props.stores;
        const { currentUserId } = Users;

        if (currentUserId) {
            const currentUser = Users.getCurrentUser();
            
            if (currentUser.accessKeys && currentUser.accessKeys.length) {
                const keysHeader = (
                    <thead className={classes.UserKeyHeader}>
                        <tr>
                            <th>Key</th>
                            <th>Secret</th>
                            <th>Created</th>
                            <th></th>
                        </tr>
                    </thead>
                );

                const keysRows = currentUser.accessKeys.map((key, index) => {
                        const rowStyle = index % 2 ? classes.Even : classes.Odd;

                        return (
                            <tr key={key.id} className={[classes.UserKeyRow, rowStyle].join(' ')}>
                                <td><Input wrapperClasses={classes.Input} value={key.access_key} /></td>
                                <td><Input wrapperClasses={classes.Input} value={key.secret} /></td>
                                <td><div className={classes.Date}>{key.created_at}</div></td>
                                <td><TextButton clicked={() => this.revokeKey(key.id)}>Revoke</TextButton></td>
                            </tr>
                        );
                    });

                content = (
                    <table className={classes.UserKeyTable}>
                        {keysHeader}
                        <tbody>
                            {keysRows}
                        </tbody>                        
                    </table>
                );

            } else {
                content = <h3>No API keys found</h3>;
            }

            generateButton = <Button clicked={() => this.generateKey(currentUserId)}>Generate New Key</Button>;
        }

        return (
            <div>
                {content}
                {generateButton}
            </div>            
        );
    }
}

export default UserKeys;