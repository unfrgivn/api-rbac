import React, { useState, useEffect } from 'react';

import PrettyPrintJson from '../../UI/PrettyPrintJson/PrettyPrintJson';

import classes from './RequestLogDetails.module.scss';

const requestLogDetails = (props) => {

    const { requestLog } = props;

    return (
        <div className={classes.requestDetails} onClick={(e) => e.stopPropagation()}>
            <div className={classes.request}>
                <label>Request</label>
                <PrettyPrintJson>{requestLog.requestBody}</PrettyPrintJson>
            </div>
            
            <div className={classes.response}>
                <label>Response</label>
                <PrettyPrintJson>{requestLog.response}</PrettyPrintJson>
            </div>
        </div> 
    )

};

export default requestLogDetails;
