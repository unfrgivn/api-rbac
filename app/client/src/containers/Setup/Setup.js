import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {autobind} from 'core-decorators';
import { inject, observer } from 'mobx-react';

import { updateObject, validateInput } from '../../shared/utility';

import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner';

import classes from './Setup.scss';

@inject('stores')
@observer @autobind
class Setup extends Component {
	state = {
		controls: {
			username: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Admin Username'
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
					placeholder: 'Admin Password'
				},
				value: '',
				validation: {
					required: true,
					minLength: 6
				},
				valid: false
			}
		}
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
		
		const { App } = this.props.stores;

		const response = await App.setup({
			username,
			password,
			usertype: 'admin'
        });
		
		if (response) {
            // If successful creation, log user in
            await this.props.stores.Auth.login(username, password);

            // We are no longer in setup mode
            this.props.stores.App.isSetup = false;
		}
	}

	render() {

        const { isSetup, doingSetup } = this.props.stores.App;
		
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

		if (doingSetup) {
			form = <Spinner />;
		}

		let setupRedirect = null;
		if (!isSetup) {
			setupRedirect = <Redirect to='/' />;
		}

		return (			
			<div className={classes.Setup}>
				{setupRedirect}
                <h2>Initial Setup</h2>
                <p>Start by creating the admin user</p>
				<form onSubmit={this.submitHandler}>
					{form}
					<Button className="btn btn-success btn-outline-success btn-block" loading={doingSetup}>Get Started</Button>
				</form>
			</div>
		);
	}
}

export default Setup;