import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import { inject, observer } from 'mobx-react';

import { updateObject, validateInput } from '../../../shared/utility';

import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import Spinner from '../../UI/Spinner/Spinner';

import classes from './AddUser.scss';

@inject('stores')
@observer @autobind
class AddUser extends Component {
	state = {
		controls: {
			usertype: {
				elementType: 'select',
				elementConfig: {
					options: [
						{value: '', displayValue: '-- Select User Type --'},
						{value: 'user', displayValue: 'User'},
						{value: 'service_account', displayValue: 'Service Account'}
					]
				},
				value: '',
				validation: {
					required: true
				},
				valid: false
			},
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
					required: true
				},
				valid: false
			},
			userdata: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'User JSON Data'
				},
				value: '',
				validation: {
					required: false
				},
				valid: true
			},
		},
		formIsValid: false,
        error: {
            message: null,
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

		// Check form validity
		let formIsValid = true;
		for (let inputIdentifier in updatedControls) {
			formIsValid = formIsValid && updatedControls[inputIdentifier].valid;
		}
		
		this.setState({controls: updatedControls, formIsValid});
	}

	submitHandler = async (event) => {
		event.preventDefault();

		const isValid = this.state.controls		
		const username = this.state.controls.username.value;
		const password = this.state.controls.password.value;
		const usertype = this.state.controls.usertype.value;
		//TODO ensure that this is going in as valid JSON data and not an escaped string
		const userdata = this.state.controls.userdata.value;
		
		const { Users } = this.props.stores;

		const response = await Users.create({
			username,
			password,
			usertype,
			userdata,
        });
		
		if (response.error) {
			this.setState(updateObject(this.state.error, {message: response.error}));
        }

		// Reset form
		this.resetForm();
	}

	resetForm = () => {
		let updatedControls = [];
		for (let inputIdentifier in this.state.controls) {
			updatedControls[inputIdentifier] = updateObject(this.state.controls[inputIdentifier], {
				value: '',
				valid: true,
				touched: false,
			});
		}

		this.setState({controls: updatedControls, formIsValid: false});
	}

	render() {

		const { loading } = this.props.stores.Users;
		
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

		if (this.props.loading) {
			form = <Spinner />;
		}

		let errorMessage = null;

		if (this.state.error) {
			errorMessage = <p>{this.state.error.message}</p>;
		}

		return (			
			<div>
				{errorMessage}
				<form onSubmit={this.submitHandler}>
					{form}
					<Button className="btn btn-success btn-block btn-outline-success" loading={loading} disabled={!this.state.formIsValid}>Add User</Button>
				</form>
			</div>
		);
	}
}

export default AddUser;