import React from 'react';

import Logo from '../../Logo/Logo';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';

import classes from './Toolbar.scss';

const toolbar = (props) => (
	<nav className={[classes.Toolbar, "navbar navbar-expand-lg navbar-light"].join(' ')}>
		<DrawerToggle clicked={props.drawerToggleClicked} />
		<div className={classes.Logo}>
			<Logo />
		</div>
	</nav>	
);

export default toolbar;