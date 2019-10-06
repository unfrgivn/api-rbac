import React from 'react';

import classes from './Input.module.scss';


const input = (props) => {
	let inputElement = null;
	const inputClasses = [classes.InputElement, props.classes];

	if (props.invalid &&  props.shouldValidate && props.touched) {
		inputClasses.push(classes.Invalid);
	}

	switch (props.elementType) {
	case('hidden') :
		inputElement = <input
			{...props.elementConfig}
			type="hidden"
			value={props.value}
			readOnly
			className={inputClasses.join(' ')} />;
		break;

	case('input') :
		inputElement = <input 
			{...props.elementConfig} 
			value={props.value}
			onChange={props.changed}
			onKeyDown={props.keydown}
			readOnly={!props.changed}
			className={inputClasses.join(' ')} />;
		break;

	case('textarea') :
		inputElement = <textarea 
			{...props.elementConfig} 
			value={props.value}
			onChange={props.changed}			
			onKeyDown={props.keydown}
			readOnly={!props.changed}
			className={inputClasses.join(' ')} />;
		break;

	case('select') :
		inputElement = (
			<select 
				{
					...Object.keys(props.elementConfig)
						.filter(key => key !== 'options')
						.reduce((obj, key) => {
							obj[key] = props.elementConfig[key];
							return obj;
						}, {})
				}
				value={props.value}
				onChange={props.changed}
				readOnly={!props.changed}
				className={inputClasses.join(' ')}>
				{props.elementConfig.options.map(option => (
					<option key={option.value} value={option.value}>
						{option.displayValue}
					</option>
				))}
			</select>
		);
		break;

	case('checkbox') :
		inputElement = <input 
			type="checkbox"
			{...props.elementConfig} 
			value={props.value}
			onChange={props.changed}
			readOnly={!props.changed}
			className={inputClasses.join(' ')} />;
		break;

	default: 
		inputElement = <input 
			{...props.elementConfig} 
			value={props.value}
			onChange={props.changed}
			onKeyDown={props.keydown}
			readOnly={!props.changed}
			className={inputClasses.join(' ')} />;
	}

	const label = props.label ? (<label className={[classes.Label, (props.elementType === 'checkbox' ? 'form-check-label' : '')].join(' ')}>{props.label}</label>) : null;

	const wrapperClasses = [classes.InputWrapper, (props.inline ? classes.Inline : classes.Block), props.wrapperClasses].join(' ');

	// Checkbox has the label after the element
	const formElement = props.elementType === 'checkbox' ? (
			<div className={wrapperClasses}>
				{inputElement}
				{label}
			</div>
		)
		: (
			<div className={wrapperClasses}>
				{label}
				{inputElement}
			</div>
		)
	
	return formElement;
};

export default input;