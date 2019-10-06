import React, { Component } from 'react';
import {autobind} from 'core-decorators';
import { inject, observer } from 'mobx-react';

import NavigationItem from './NavigationItem/NavigationItem';
import NavigationButton from './NavigationButton/NavigationButton';

import classes from './NavigationItems.module.scss';
@inject('stores')
@observer @autobind
class NavigationItems extends Component { 

	resetCurrentUser = async () => {
		const { Users } = this.props.stores;
		await Users.resetCurrentUser();
	}

	sync = async () => {
		const { Actions } = this.props.stores;
		await Actions.sync();
	}

	render() {
		return (
			<ul className={classes.NavigationItems}>
				<NavigationItem link="/" exact>Dashboard</NavigationItem>
				{this.props.isAuthenticated ? <NavigationItem link="/groups">Groups</NavigationItem> : null }
				{this.props.isAuthenticated ? <NavigationItem link="/users" clicked={() => this.resetCurrentUser()}>Users</NavigationItem> : null }
				{this.props.isAuthenticated ? <NavigationItem link="/logs">Logs</NavigationItem> : null }
				<NavigationButton clicked={() => this.sync()}>Sync</NavigationButton>
				{!this.props.isAuthenticated 
					? <NavigationItem link="/auth">Login</NavigationItem>
					: <NavigationItem link="/logout">Logout</NavigationItem>
				}
			</ul>
		);
	}
}

export default NavigationItems;