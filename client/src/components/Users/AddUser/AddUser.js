import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import { inject, observer } from 'mobx-react';

import { updateObject, validateInput } from '../../../shared/utility';

import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import Spinner from '../../UI/Spinner/Spinner';

import classes from './AddUser.module.scss';

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
		isEditing: false,
		formIsValid: false,
        error: {
            message: null,
        }
	};

	componentDidMount() {
		if (this.props.userId) {
			const { Users } = this.props.stores;
			const editingUser = Users.users.find(user => user.id === this.props.userId);
			
			const controls = this.state.controls;
			const updatedControls = updateObject(controls, {
				usertype: updateObject(controls.usertype, {
					...controls.usertype,
					value: editingUser.usertype,
					elementConfig: updateObject(controls.usertype.elementConfig, {
						...controls.usertype.elementConfig,
						disabled: 'disabled',
					}),
				}),
				username: updateObject(controls.username, {
					...controls.username,
					value: editingUser.username,
					elementConfig: updateObject(controls.usertype.elementConfig, {
						...controls.username.elementConfig,
						disabled: 'disabled',
					}),
				}),
				password: updateObject(controls.username, {
					...controls.password,
					valid: true,
				}),
				userdata: updateObject(controls.userdata, {
					...controls.userdata,
					value: editingUser.userdata ? JSON.stringify(editingUser.userdata) : '',
				})
			});

			this.setState({controls: updatedControls, isEditing: true});
		}
	}

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
			formIsValid = formIsValid && (updatedControls[inputIdentifier].valid || updatedControls[inputIdentifier].elementConfig.disabled);
		}
		
		this.setState({controls: updatedControls, formIsValid});
	}

	submitHandler = async (event) => {
		event.preventDefault();

		const isValid = this.state.controls		
		const username = this.state.controls.username.value;
		const password = this.state.controls.password.value;
		const usertype = this.state.controls.usertype.value;
		const userdata = this.state.controls.userdata.value;

		//TODO: Handle password updates
		
		const { Users } = this.props.stores;

		let response = null;

		if (this.state.isEditing) {
			response = await Users.edit(this.props.userId, {
				userdata,
			});

		} else {
			response = await Users.create({
				username,
				password,
				usertype,
				userdata,
			});
		}		
		
		if (response.error) {
			this.setState(updateObject(this.state.error, {message: response.error}));
        }

		// Reset form
		if (!this.state.isEditing) {
			this.resetForm();
		}
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
					<Button className="btn btn-block btn-outline-success" loading={loading} disabled={!this.state.formIsValid}>{this.props.userId ? 'Edit' : 'Add'} User</Button>
				</form>
			</div>
		);
	}
}

export default AddUser;