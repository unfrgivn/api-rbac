import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {autobind} from 'core-decorators';
import { inject, observer } from 'mobx-react';

import { updateObject, validateInput } from '../../shared/utility';

import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner';

import classes from './Auth.scss';

@inject('stores')
@observer @autobind
class Auth extends Component {
	state = {
		controls: {
			username: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Username'
				},
				value: '',
				validation: {
					required: true
				},
				valid: false
			},
			password: {
				elementType: 'input',
				elementConfig: {
					type: 'password',
					placeholder: 'Password'
				},
				value: '',
				validation: {
					required: true,
					minLength: 6
				},
				valid: false
			}
		},
		isSignup: false
	};

	inputChangedHandler = (event, controlName) => {
		//Only copies the controls state object, but all children are pointers (not copied deeply)
		const updatedControls = updateObject(this.state.controls, {
			[controlName]: updateObject(this.state.controls[controlName], {
				value: event.target.value,
				valid: validateInput(event.target.value, this.state.controls[controlName].validation),
				touched: true
			})
		});

		this.setState({controls: updatedControls});
	}

	submitHandler = async (event) => {
		event.preventDefault();

		const username = this.state.controls.username.value;
		const password = this.state.controls.password.value;
		
		const { Auth } = this.props.stores;

		const response = await Auth.login(username, password);
		
		if (response.error) {

			console.log('AUTH ERROR', response.error);

		} else {

			console.log('AUTH RESPONSE', response);

		}
		
		// try {
		// 	if(!credentials) {
		// 		// Try to authenticate using the JWT from localStorage
		// 		await this.client.authenticate();
		// 	} else {
		// 		// If we get login information, add the strategy we want to use for login
		// 		const payload = Object.assign({ strategy: 'local' }, credentials);
	
		// 		await this.client.authenticate(payload);
		// 	}
		// } catch(error) {
		// 	// If we got an error, show the login page
		// 	// showLogin(error);
		// }

		// this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
	}

	render() {

		const { isAuthenticated, doingAuth } = this.props.stores.Auth;
		
		const formElementsArray = [];
		for (let key in this.state.controls) {
			formElementsArray.push({
				id: key,
				config: this.state.controls[key]
			});
		}

		let form = formElementsArray.map(formElement => (
			<Input 
				key={formElement.id}
				elementType={formElement.config.elementType} 
				elementConfig={formElement.config.elementConfig} 
				value={formElement.config.value}
				invalid={!formElement.config.valid}
				shouldValidate={formElement.config.validation}
				touched={formElement.config.touched}
				changed={(event) => this.inputChangedHandler(event, formElement.id)}
				wrapperClasses="form-group"
				classes="form-control" />
		));

		if (doingAuth) {
			form = <Spinner />;
		}

		let authRedirect = null;
		if (isAuthenticated) {
			authRedirect = <Redirect to='/' />;
		}

		return (			
			<div className={classes.Auth}>
				{authRedirect}
				<form onSubmit={this.submitHandler}>
					{form}
					<Button className="btn btn-outline-success btn-block" loading={doingAuth}>Login</Button>
				</form>
			</div>
		);
	}
}

export default Auth;