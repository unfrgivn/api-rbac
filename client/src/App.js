import React, { Component } from 'react';
import {Route, Switch, withRouter, Redirect } from 'react-router-dom';
import {autobind} from 'core-decorators';
import { inject, observer } from 'mobx-react';

import asyncComponent from './hoc/asyncComponent/asyncComponent';

import Layout from './hoc/Layout/Layout';
import SetupScreen from './containers/Setup/Setup';
import Dashboard from './containers/Dashboard/Dashboard';
import UsersScreen from './containers/UsersScreen/UsersScreen';
import GroupsScreen from './containers/GroupsScreen/GroupsScreen';
import Logout from './containers/Auth/Logout/Logout';

/**
 * Load Auth component lazily
 */
const asyncAuth = asyncComponent(() => {
	return import('./containers/Auth/Auth');
});

@inject('stores')
@observer @autobind
class App extends Component {

	async componentDidMount() {
		// Attempt auto-login
		const response = await this.props.stores.Auth.authenticate();
	}

	componentDidUpdate(prevProps) {
		// If the location changes, run the onRouteChanged method
		if (this.props.location !== prevProps.location) {
		  this.onRouteChanged();
		}
	  }
	
	/**
	 * Run when the route changes
	 */
	onRouteChanged() {
		// Clear all message bars when switching routes/screens
		const { UI } = this.props.stores;
		UI.clearMessages();
	}

	render() {
		const { isSetup } = this.props.stores.App;
		const { isAuthenticated } = this.props.stores.Auth;

		let routes = (
			<Switch> {/* Switch forces only one route to load then stops */}
				<Route path="/login" component={asyncAuth} />
				<Redirect to="/login" />{/*Redirect unknown routes to home*/}
				{/* <Route render={() => <h1>Not Found</h1>} />				 */}
			</Switch>
		);

		if (isAuthenticated) {
			routes = (
				<Switch> {/* Switch forces only one route to load then stops */}
					{/* <Route path="/login" component={asyncAuth} /> */}
					<Route path="/logout" component={Logout} />
					<Route path="/" exact component={Dashboard} />
					<Route path="/groups" exact component={GroupsScreen} />
					<Route path="/users" exact component={UsersScreen} />
					<Redirect to="/" />{/*Redirect unknown routes to home*/}
					{/* <Route render={() => <h1>Not Found</h1>} />				 */} */}
				</Switch>
			);
		}

		if (isSetup) {
			// console.log('setting route setup');
			routes = (
				<Switch>
					<Route path="/setup" component={SetupScreen} />
					<Redirect to="/setup" />
				</Switch>
			);
		}

		return (
			<div>
				<Layout>
					{routes}
				</Layout>
			</div>
		);
	}
}

export default withRouter(App);
// export default App;
