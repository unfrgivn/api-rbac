import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import { inject, observer } from 'mobx-react';

import Input from '../../UI/Input/Input';
import Spinner from '../../UI/Spinner/Spinner';

import classes from './UserGroupToggles.scss';

@inject('stores')
@observer @autobind
class UserGroupToggles extends Component {

    inputChangedHandler = (event, userId, groupId) => {
        const { Users } = this.props.stores;

        if (event.target.checked) {
            Users.addGroup(userId, groupId);
        } else {
            Users.removeGroup(userId, groupId);
        }
    }

	render() {

        const { Groups, Users } = this.props.stores;
        
        // Get user groups
        const userGroupIds = Users.users
            .find(user => user.id === this.props.userId)
            .groups.map(group => group.id);
            
        // Build checkboxes for each available group with the current user-group state
        let form = Groups.groups.map(group => (
            <Input 
                key={group.id}
                elementType="checkbox"
                // elementConfig={formElement.config.elementConfig} 
                elementConfig={{
                    checked: userGroupIds.includes(group.id),
                }}
                label={group.name}
                value={this.props.userId}
                // invalid={!formElement.config.valid}
                // shouldValidate={formElement.config.validation}
                // touched={formElement.config.touched}
                changed={(event) => this.inputChangedHandler(event, this.props.userId, group.id)}
                inline={true}
                wrapperClasses={[classes.CheckItem, "form-check"].join(' ')}
                classes="form-check-input" />
        ));

		return (			
			<div className={classes.UserGroupToggles}>
			    {form}
			</div>
		);
	}
}

export default UserGroupToggles;