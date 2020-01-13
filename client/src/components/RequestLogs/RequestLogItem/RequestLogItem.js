import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';

import { 
    FaAngleDown,
    FaAngleUp,
    FaLock,
    FaRegTimesCircle,
    FaRegCheckCircle,
    FaRegUser,
    FaUserSlash,
    FaUnlink
} from "react-icons/fa";

import RequestLogDetails from '../RequestLogDetails/RequestLogDetails';

import classes from './RequestLogItem.module.scss';

const requestLogItem = inject('stores')(observer((props) => {

    const { requestLog } = props;

    const [logDetailsOpen, setLogDetailsOpen] = useState(false);
    const [subRequestDetailsOpen, setSubRequestDetailsOpen] = useState({});

    const expandLogHandler = () => {
        setLogDetailsOpen(!logDetailsOpen);
    }

    const expandSubLogHandler = (event, requestLogId) => {
        // Prevent parent click event
        event.stopPropagation();

        setSubRequestDetailsOpen({
            ...subRequestDetailsOpen,
            [requestLogId]: (requestLogId in subRequestDetailsOpen ? !subRequestDetailsOpen[requestLogId] : true),
        });
    }

    const queryString = requestLog.params && Object.keys(requestLog.params).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(requestLog.params[key])
        }).join('&');

    // Request icon
    let icon = null;
    let statusLabel = null;
    const iconSize = 20;
    switch (requestLog.status) {
        case 200:
            icon = <FaRegCheckCircle className="success" size={iconSize} />;
            statusLabel = "Success";
            break;

        case 401:
            icon = <FaUserSlash className="error" size={iconSize} />;
            statusLabel = "Access Denied";
            break;

        case 403:
            icon = <FaLock className="error" size={iconSize} />;
            statusLabel = "Forbidden";
            break;

        case 404:
            icon = <FaUnlink className="error" size={iconSize} />;
            statusLabel = "Not Found";
            break;

        case 500:
            icon = <FaRegTimesCircle className="error" size={iconSize} />;
            statusLabel = "Error";
            break;

        default:
            icon = null;
    }

    const responseMessageClass = requestLog.status === 200 ? null : "error";

    // For showing how many internal requests are made off this call
    const subRequestBadge = requestLog.subRequests.length ? <label className={classes.subRequestBadge}>+{requestLog.subRequests.length}</label> : null;

    const subRequests = (
        <div className={classes.subRequests}>
        {
            requestLog.subRequests.map(subRequestLog => {
            
                // Leave blank for default/success  
                const subRequestStatusClass = subRequestLog.status === 500 
                    ? "error" 
                    : (
                        subRequestLog.status === 401
                        ? "warning"
                        : null
                    );

                const isSubRequestDetailsOpen = (subRequestLog._id in subRequestDetailsOpen) && subRequestDetailsOpen[subRequestLog._id];

                return (
                    <div key={subRequestLog._id} className={classes.subRequest}>
                        <div className={classes.subContainer}>
                            <div className={[classes.subRequestStatusCode, subRequestStatusClass].join(' ')}>
                                {subRequestLog.status} 
                            </div>

                            <div className={classes.subRequestName}>
                                {subRequestLog.controller}::{subRequestLog.method}
                            </div>

                            <div className={classes.subRequestCreatedAt}>
                                {subRequestLog.created}
                            </div>

                            <div className={classes.subRequestExpandIconContainer} onClick={(e) => expandSubLogHandler(e, subRequestLog._id)}>
                                {
                                    isSubRequestDetailsOpen 
                                    ? <FaAngleUp />
                                    : <FaAngleDown />
                                }
                            </div>   
                        </div>
                        {
                            isSubRequestDetailsOpen
                            ? <RequestLogDetails requestLog={subRequestLog} />
                            : null
                        }
                    </div>
                );
            })
        }
        </div>
    );

    return requestLog 
        ? (
            <div key={requestLog._id} className={classes.RequestLog}>
                <div className={classes.primaryContainer}>
                    <div className={classes.statusContainer}>
                        <div className={classes.statusIcon}>{icon}</div>
                        <div className={classes.statusLabel}>{statusLabel}</div>
                        <div className={classes.statusCode}>{requestLog.status}</div>
                    </div>

                    <div className={classes.mainRequestContainer}>
                        <div className={classes.left}>
                            <div className={classes.endpoint}>
                                <label 
                                    className={[
                                        classes.requestMethod, 
                                        (requestLog.requestMethod ? classes[requestLog.requestMethod.toLowerCase()] : '')
                                    ].join(' ')}>
                                    {requestLog.requestMethod}
                                </label>
                                <span className={classes.endpointUrl}>{`/${requestLog.endpoint}/`}{queryString ? `?${queryString}` : null}</span>
                            </div>
                        
                            <div className={classes.classMethod}>{requestLog.controller}::{requestLog.method} {subRequestBadge}</div>
                        
                            <div className={[classes.responseMessage, responseMessageClass].join(' ')}>
                                {requestLog.message}
                            </div>
                        </div>
                        
                        <div className={classes.right}>
                            <div className={classes.userContainer}>
                                <FaRegUser size={10} /> {requestLog.User ? requestLog.User.username : null}
                            </div>
                            <div className={classes.createdAt}>{requestLog.created}</div>
                            <div className={classes.duration}>{requestLog.duration}<label>seconds</label></div>
                        </div>
                            
                            
                    </div>
                    
                    <div className={classes.expandIconContainer} onClick={expandLogHandler}>
                        {
                            logDetailsOpen 
                            ? <FaAngleUp />
                            : <FaAngleDown />
                        }
                    </div>   
                </div>
                {
                    logDetailsOpen 
                    ? (
                        <div className={classes.expandedContainer}>
                            {subRequests}

                            <RequestLogDetails requestLog={requestLog} />
                        </div>
                    )
                    : null
                }     
            </div>
        )
        : null;

}));

export default requestLogItem;
