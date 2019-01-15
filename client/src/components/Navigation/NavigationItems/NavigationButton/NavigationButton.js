import React from 'react';

import Button from '../../../UI/Button/Button';

import classes from './NavigationButton.scss';

const navigationButton = (props) => (
	<li className={classes.NavigationButton}>
		<Button 
			className={classes.active}
			clicked={props.clicked}>
			{props.children}	
		</Button>
	</li>
);

export default navigationButton;