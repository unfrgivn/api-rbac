import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {autobind} from 'core-decorators';
import { inject, observer } from 'mobx-react';

@inject('stores')
@observer @autobind
class Logout extends Component {
	async componentWillMount() {
		const { Auth } = this.props.stores;

		const response = await Auth.logout();
	}
	
	render () {
		return <Redirect to="/" />;
	}
}

export default Logout;