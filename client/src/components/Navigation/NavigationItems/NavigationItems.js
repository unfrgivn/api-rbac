import React, { Component } from 'react';
import {autobind} from 'core-decorators';
import { inject, observer } from 'mobx-react';

import NavigationItem from './NavigationItem/NavigationItem';
import NavigationButton from './NavigationButton/NavigationButton';

import classes from './NavigationItems.scss';
@inject('stores')
@observer @autobind
class NavigationItems extends Component {

	syncActionsHandler = () => {
		this.props.stores.Actions.sync();
	}

	render () {
		return (
			<ul className={classes.NavigationItems}>
				<NavigationItem link="/" exact>Dashboard</NavigationItem>
				{this.props.isAuthenticated ? <NavigationItem link="/groups">Groups</NavigationItem> : null }
				{this.props.isAuthenticated ? <NavigationItem link="/users">Users</NavigationItem> : null }
				{this.props.isAuthenticated ? <NavigationButton clicked={() => this.syncActionsHandler()}>Sync Actions</NavigationButton> : null }
				{!this.props.isAuthenticated 
					? <NavigationItem link="/auth">Login</NavigationItem>
					: <NavigationItem link="/logout">Logout</NavigationItem>
				}
			</ul>
		);
	}
}

export default NavigationItems;