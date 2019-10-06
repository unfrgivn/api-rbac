import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';

import RequestLogItem from './RequestLogItem/RequestLogItem';

import classes from './RequestLogs.module.scss';
import { clear } from 'winston';

const logs = inject('stores')(observer((props) => {

    const { RequestLogs: RequestLogsStore } = props.stores;
    const { requestLogs } = RequestLogsStore || [];

    // Hooks
    useEffect(() => {
        // console.log('mounted');

        // TODO: Add state property and "pause" button

        const interval = setInterval(async () => {
            await RequestLogsStore.load(true);
        }, 1500);
        
        return () => {
            // console.log('will unmount');
            clearInterval(interval);   
        };
    }, [RequestLogsStore]);   
    
    const logRows = requestLogs.length
        ? requestLogs.map(log => <RequestLogItem key={log._id} requestLog={log} />)
        : <div>Listening for logs...</div>;
        
    return (
        <div className={classes.RequestLogs}>
            {logRows}
        </div>            
    );
}));

export default logs;