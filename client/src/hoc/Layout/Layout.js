import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import { inject, observer } from 'mobx-react';

import Aux from '../Aux/Aux';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

import classes from './Layout.module.scss';

@inject('stores')
@observer @autobind
class Layout extends Component {

	sideDrawerToggleHandler = () => {
		const { UI } = this.props.stores;
		UI.showSideDrawer = !UI.showSideDrawer;
	}

	sideDrawerClosedHandler = () => {
		const { UI } = this.props.stores;
		UI.showSideDrawer = false;
	}

	render () {
		const { App, Auth, UI } = this.props.stores;
		const { isAuthenticated } = Auth;
		const { showSideDrawer, messages } = UI; 

		let messageConnection = App.isConnecting ? <div className="alert alert-warning">Disconnected from server</div> : ''; 
		
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
					{messageConnection}
					{messageBar}
					{ this.props.children }
				</main>
			</Aux>
		);
	}
}

export default Layout;