import React from 'react';

import Toggle from 'react-toggle';


import './ActionToggle.css'; // Include raw toggle CSS
import classes from './ActionToggle.module.scss';

const actionToggle = (props) => {
	// let inputElement = null;
	// const inputClasses = [classes.InputElement, props.classes];

	// const label = props.label ? (<label className={classes.Label}>{props.label}</label>) : null;

	// const wrapperClasses = [classes.InputWrapper, (props.inline ? classes.Inline : classes.Block), props.wrapperClasses].join(' ');

    const endpoint = props.endpoint;

    // const controllerMethod = `${controllerName} \\ ${methodName}`;

	return (
		<div className={classes.Wrapper}>
            <label>
                <Toggle
                    checked={props.checked}
                    icons={false}
                    onChange={props.changed}
                    id={`action_${props.id}`}
                    value={`${props.id}`} />
                <span className={classes.Label}>{endpoint}</span>
            </label>
		</div>
	);
};

export default actionToggle;