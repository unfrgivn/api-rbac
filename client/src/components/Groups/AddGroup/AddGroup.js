import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import { inject, observer } from 'mobx-react';

import { updateObject, validateInput } from '../../../shared/utility';

import Button from '../..//UI/Button/Button';
import Input from '../../UI/Input/Input';
import Spinner from '../../UI/Spinner/Spinner';

import classes from './AddGroup.module.scss';

@inject('stores')
@observer @autobind
class AddGroup extends Component {
	state = {
		controls: {
			name: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Group Name'
				},
				value: '',
				validation: {
					required: true
				},
				valid: false
			},
        },
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

		this.setState({controls: updatedControls});
	}

	submitHandler = async (event) => {
		event.preventDefault();

		const groupName = this.state.controls.name.value;
		
		const { Groups } = this.props.stores;

		const response = await Groups.create({
            name: groupName
        });
		
		if (response.error) {
			this.setState(updateObject(this.state.error, {message: response.error}));
        }


		this.setState({controls: updateObject(this.state.controls, {
			name: updateObject(this.state.controls.name, {
				value: '',
				valid: true,
				touched: false
            })
        })});
	}

	render() {

		const { loading } = this.props.stores.Groups;
		
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
                inline={true}
				wrapperClasses="form-group mr-3"
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
					<Button className="btn btn-outline-success" loading={loading}>Add Group</Button>
				</form>
			</div>
		);
	}
}

export default AddGroup;