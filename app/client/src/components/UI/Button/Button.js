import React from 'react';

import classes from './Button.scss';

const button = (props) => {
	// Show loading indicator if loading is set
	let loading = props.loading ? <i className="fa fa-refresh fa-spin"></i> : null;

	// Disable button on either explicit disabled or loading true
	let disabled = props.disabled || props.loading;

	return (
		<button 
			className={[classes.Button, props.className, classes[props.btnType]].join(' ')}
			onClick={props.clicked}
			disabled = {disabled}>
			{props.children} {loading}	
		</button>
	);
};

export default button;