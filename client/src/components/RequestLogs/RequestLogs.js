import React, { useCallback, useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import dayjs from 'dayjs';

import RequestLogItem from './RequestLogItem/RequestLogItem';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';

import classes from './RequestLogs.module.scss';

let intervalFetchLogs = null;

const setLogPolling = (callback, args = []) => {
    // Clear old polling
    clearInterval(intervalFetchLogs);   

    intervalFetchLogs = setInterval(async () => {
        await callback(...args);
    }, 2000);
}


const logs = inject('stores')(observer((props) => {

    const { RequestLogs: RequestLogsStore } = props.stores;
    const { requestLogs } = RequestLogsStore || [];

    const logsLoadHandler = useCallback(RequestLogsStore.load, []) 
    const logsClearHandler = useCallback(RequestLogsStore.clear, []) 

    const [ pauseLogs, setPauseLogs ] = useState(null);
    const [ logQuery, setLogQuery ] = useState(null);

    const [filterForm, setFilterForm] = React.useState({
        loaded: false,
        controls: [
            {
                key: 'requesType',
                label: 'Status',
                elementType: 'select',
                value: "",
                defaultValue: "",  
                elementConfig: {
                    options: [
                        {
                            value: null,
                            displayValue: 'All',
                        },
                        {
                            value: 'GET',
                            displayValue: 'GET',
                        },
                        {
                            value: 'POST',
                            displayValue: 'POST',
                        },
                        {
                            value: 'PUT',
                            displayValue: 'PUT',
                        },
                        {
                            value: 'PATCH',
                            displayValue: 'PATCH',
                        },
                        {
                            value: 'DELETE',
                            displayValue: 'DELETE',
                        },
                    ]
                }
            },
            {
                key: 'responseStatus',
                label: 'Status',
                elementType: 'select',
                value: "",
                defaultValue: "",  
                elementConfig: {
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
                },                
            },
            {
                key: 'searchQuery',
                label: 'Search Request',
                elementType: 'input',
                value: "",
                defaultValue: "",  
            },
            {
                key: 'rewindMinutes',
                label: 'Rewind Mins',
                elementType: 'input',
                value: "",      
                defaultValue: "",            
            },
            {
                key: 'startDate',
                label: 'Start Date',
                elementType: 'input',
                value: "",       
                defaultValue: "",           
            },
            {
                key: 'endDate',
                label: 'End Date',
                elementType: 'input',
                value: "",   
                defaultValue: "",             
            }
        ]
    });

    const queryLogsHandler = useCallback(() => setLogPolling(logsLoadHandler, [true, logQuery]), [logsLoadHandler, logQuery]);

    // Extract form values
    const getFilterValues = useCallback((formItems) => formItems
        .filter(item => item.value.length)
        .reduce((obj, item) => {
            return {
                ...obj,
                [item.key]: item.value,
            };
        }, {}), []);

    // On mount
    useEffect(() => {
        setLogPolling(logsLoadHandler);
        
        return () => {
            // Remove all logs on unmount and reset startData
            logsClearHandler();
            clearInterval(intervalFetchLogs);   
        };
    }, [logsClearHandler, logsLoadHandler]);

    // When updating logQuery
    useEffect(() => {
        // Reset query and clear visible logs when performing a new search
        logsClearHandler();
        
        queryLogsHandler();
        
    }, [logQuery, logsClearHandler, queryLogsHandler]);
    
    // Pause logs
    useEffect(() => {
        if (pauseLogs) {
            if (intervalFetchLogs) {
                clearInterval(intervalFetchLogs);   
            }
            
        } else {
            queryLogsHandler();
        }

    }, [pauseLogs, queryLogsHandler]);

    
    const filterHandler = (e, controlName) => {
        const newFilterControls = filterForm.controls.map(item => (item.key === controlName)
                ? {
                    ...item,
                    value: e.target.value,
                }
                : item
            );
        
        setFilterForm({
            filterForm,
            controls: newFilterControls,
        });
    }

    const filterSubmitHandler = () => {
        
        const filterValues = getFilterValues(filterForm.controls);
        
        // Turn off pause
        setPauseLogs(false);
        
        // Re-run query
        setLogQuery(filterValues);
    }

    const filtersReset = async () => {

        // Clear existing logs
        logsClearHandler();

        // Reset all form filter values
        const newFilterControls = filterForm.controls.map(item => {
                return {
                    ...item,
                    value: item.defaultValue || "",
                }
            });
            
        // Reset form
        await setFilterForm({
            filterForm,
            controls: newFilterControls,
        });

        // Extract filter
        // const filterValues = getFilterValues(newFilterControls);
        
        // Resubmit the log query with blank values so it'll resume defualt listening state
        setLogQuery(null);
    }
    
    const logRows = requestLogs.length
        ? requestLogs.map(log => <RequestLogItem key={log._id} requestLog={log} />)
        : <div>Listening for logs...</div>;
        
    const logsPagerInfo = requestLogs.length
        ? `Showing ${requestLogs.length} requests starting ${dayjs(requestLogs[0].created).format('MM/DD/YYYY HH:mm a')}`
        : null;

    return (
        <div className={classes.RequestLogs}>
            <div className="alert alert-info">Caution when searching for data and not an endpoint (like a User Id). The results will no longer include the full API call + children, only the matching requests.</div>
                
            <div className={classes.filterContainer}>
                <div className={classes.filterInputsContainer}>
                {
                    filterForm.controls.map(item => <Input 
                            {...item}
                            changed={(e) => filterHandler(e, item.key)}
                            wrapperClasses="form-group"
                            classes="form-control"
                            />
                    )
                }
                </div>
                <div className={classes.filterButtonsContainer}>
                    <Button className={`btn ${logQuery && Object.keys(logQuery).length ? 'btn-info' : 'btn-outline btn-outline-info'}`} clicked={filterSubmitHandler}>Filter</Button>
                    <Button className={`btn ${pauseLogs ? 'btn-warning' : 'btn-outline btn-outline-warning'}`} clicked={() => setPauseLogs(!pauseLogs)}>{pauseLogs ? `Resume` : `Pause`}</Button>
                    <Button className="btn btn-outline-danger" clicked={() => logsClearHandler()}>Clear</Button>
                    <Button className="btn btn-outline-dark" clicked={filtersReset}>Reset</Button>
                </div>
            </div>
            <div className={classes.pagerContainer}>
                <div>{logsPagerInfo}</div>
            </div>
            {logRows}
        </div>            
    );
}));

export default logs;