import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import { inject, observer } from 'mobx-react';

import Aux from '../Aux/Aux';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

import classes from './Layout.scss';

@inject('stores')
@observer @autobind
class Layout extends Component {

	sideDrawerToggleHandler = () => {
		this.props.stores.UI.showSideDrawer = !this.props.stores.UI.showSideDrawer;
	}

	sideDrawerClosedHandler = () => {
		this.props.stores.UI.showSideDrawer = false;
	}

	render () {
		const isAuthenticated = this.props.stores;
		const { showSideDrawer, messages } = this.props.stores.UI; 
		let messageBar = messages.length ? messages.map((message, index) => {
			return <div key={index} className={["alert", `alert-${message.type}`].join(' ')}>{message.text}</div>;
		}) : null;

		return (
			<Aux>
				<Toolbar 
					isAuth={isAuthenticated}
					drawerToggleClicked={this.sideDrawerToggleHandler} />
				<SideDrawer 
					isAuth={isAuthenticated}
					open={showSideDrawer} closed={this.sideDrawerClosedHandler} />
				<main className={classes.Content}>
					{messageBar}
					{ this.props.children }
				</main>
			</Aux>
		);
	}
}

export default Layout;