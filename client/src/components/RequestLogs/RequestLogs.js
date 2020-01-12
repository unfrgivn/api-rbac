import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';

import RequestLogItem from './RequestLogItem/RequestLogItem';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';

import classes from './RequestLogs.module.scss';

let intervalFetchLogs = null;

const logs = inject('stores')(observer((props) => {

    const { RequestLogs: RequestLogsStore } = props.stores;
    const { requestLogs } = RequestLogsStore || [];

    const [ pauseLogs, setPauseLogs ] = useState(null);
    const [ logQuery, setLogQuery ] = useState(null);
    const [ filterValues, setFilterValues ] = useState(null);

    // On mount
    useEffect(() => {
        setLogPolling(true, logQuery);
        
        return () => {
            // Remove all logs on unmount and reset startData
            RequestLogsStore.clear();
            clearInterval(intervalFetchLogs);   
        };
    }, []);

    // When updating logQuery
    useEffect(() => {
        // Reset query to beginning when updating query
        RequestLogsStore.skip = 0;
        RequestLogsStore.startDate = new Date();
        
        setLogPolling(true, logQuery);
        
    }, [logQuery]);
    
    useEffect(() => {
        if (pauseLogs) {
            clearInterval(intervalFetchLogs);   
        } else {
            setLogPolling(true, logQuery);
        }

    }, [pauseLogs]);   

    const setLogPolling = (loadNextPage, query) => {
        // Clear old polling
        clearInterval(intervalFetchLogs);   

        intervalFetchLogs = setInterval(async () => {
            await RequestLogsStore.load(loadNextPage, query);
        }, 2000);
    }

    const filterHandler = (e, controlName) => {

        const localFilterValues = filterValues || {};

        const newFilterValues = e.target.value 
            ? {
                ...localFilterValues,
                [controlName]: e.target.value,
            }
            : Object.keys(localFilterValues).filter(key => key !== controlName);

        setFilterValues(newFilterValues);
    }

    const filterSubmitHandler = (e) => {
        
        // Remove empty values
        const nonEmptyFilterValues = filterValues && Object.keys(filterValues)
            .filter(key => filterValues[key].length)
            .reduce((obj, key) => {
                return {
                    ...obj,
                    [key]: filterValues[key],
                };
            }, {});
            
        setLogQuery(nonEmptyFilterValues);

        RequestLogsStore.clear();
    }
    
    const logRows = requestLogs.length
        ? requestLogs.map(log => <RequestLogItem key={log._id} requestLog={log} />)
        : <div>Listening for logs...</div>;
        
    return (
        <div className={classes.RequestLogs}>
            <div className="alert alert-info">Caution when searching for data and not an endpoint (like a User Id). The results will no longer include the full API call + children, only the matching requests.</div>
                
            <div className={classes.filterContainer}>
                <div className={classes.filterInputsContainer}>
                    <Input 
                        elementType="select" 
                        label="Status"
                        elementConfig={{
                            options: [
                                {
                                    value: null,
                                    displayValue: 'All',
                                },
                                {
                                    value: 200,
                                    displayValue: '200 - Success',
                                },
                                {
                                    value: 400,
                                    displayValue: '400 - Bad Request',
                                },
                                {
                                    value: 401,
                                    displayValue: '401 - Access Denied',
                                },
                                {
                                    value: 403,
                                    displayValue: '403 - Forbidden',
                                },
                                {
                                    value: 404,
                                    displayValue: '404 - Not Found',
                                },
                                {
                                    value: 500,
                                    displayValue: '500 - API Error',
                                },
                            ]
                        }}
                        changed={e => filterHandler(e, "responseStatus")}
                        wrapperClasses="form-group"
				        classes="form-control" />

                    <Input 
                        elementType="input" 
                        label="Search Request"
                        changed={e => filterHandler(e, "searchQuery")}
                        wrapperClasses="form-group"
				        classes="form-control" />

                    <Input 
                        elementType="input" 
                        label="Rewind Mins"
                        changed={e => filterHandler(e, "rewindMinutes")}
                        wrapperClasses="form-group"
				        classes="form-control" />
                </div>
                <div className={classes.filterButtonsContainer}>
                    <Button className={`btn ${filterValues && Object.keys(filterValues).length ? 'btn-info' : 'btn-outline btn-outline-info'}`} clicked={e => filterSubmitHandler(e)}>Filter</Button>
                    <Button className={`btn ${pauseLogs ? 'btn-warning' : 'btn-outline btn-outline-warning'}`} clicked={() => setPauseLogs(!pauseLogs)}>Pause</Button>
                    <Button className="btn btn-error" clicked={() => RequestLogsStore.clear()}>Clear</Button>
                </div>
            </div>
            {logRows}
        </div>            
    );
}));

export default logs;