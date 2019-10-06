import React from 'react';

import classes from './TextButton.module.scss';

const textButton = (props) => (
	<button 
		className={[classes.TextButton, props.classes, classes[props.btnType]].join(' ')}
		onClick={props.clicked}
		disabled = {props.disabled}>
		{props.children}		
	</button>
);

export default textButton;