import React from 'react';

import Toggle from 'react-toggle';


import './ActionToggle.css'; // Include raw toggle CSS
import classes from './ActionToggle.scss';

const actionToggle = (props) => {
	// let inputElement = null;
	// const inputClasses = [classes.InputElement, props.classes];

	// const label = props.label ? (<label className={classes.Label}>{props.label}</label>) : null;

	// const wrapperClasses = [classes.InputWrapper, (props.inline ? classes.Inline : classes.Block), props.wrapperClasses].join(' ');

    const controllerName = props.controller;
    const methodName = props.name;

    const controllerMethod = `${controllerName} \\ ${methodName}`;

	return (
		<div className={classes.Wrapper}>
            <label>
                <Toggle
                    checked={props.checked}
                    icons={false}
                    onChange={props.changed}
                    id={`action_${props.id}`}
                    value={`${props.id}`} />
                <span className={classes.Label}>{controllerMethod}</span>
            </label>
		</div>
	);
};

export default actionToggle;