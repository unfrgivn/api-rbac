import React from 'react';

import NavigationItem from './NavigationItem/NavigationItem';

import classes from './NavigationItems.scss';

const navigationItems = (props) => (
	<ul className={classes.NavigationItems}>
		<NavigationItem link="/" exact>Dashboard</NavigationItem>
		{props.isAuthenticated ? <NavigationItem link="/groups">Groups</NavigationItem> : null }
		{props.isAuthenticated ? <NavigationItem link="/users">Users</NavigationItem> : null }
		{!props.isAuthenticated 
			? <NavigationItem link="/auth">Login</NavigationItem>
			: <NavigationItem link="/logout">Logout</NavigationItem>
		}
	</ul>
);

export default navigationItems;