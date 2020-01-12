import { observable } from 'mobx';
import { persist } from 'mobx-persist';

import dayjs from 'dayjs';
import JSONbig from 'json-bigint';

import Models from '.';

class RequestLog {
    _id = null;
    requestId = null;
    status = null;
    userId = null;
    requestMethod = null;
    endpoint = null;
    controller = null;
    method = null;
    params = null;
    requestBody = null;
    message = null;
    response = null;
    headers = null;
    ipAddress = null;
    duration = null;
    created = null;

    User = new Models.User();

    @persist @observable subRequests = [];

    constructor(obj = {}) {
        const {
            id,
            request_id: requestId,
            status,
            version,
            user_id: userId,
            request_method: requestMethod,
            endpoint,
            controller,
            method,
            params,
            request_body: requestBody,
            message,
            response,
            headers,
            ip_address: ipAddress,
            duration,
            created_at: createdAt,
        } = obj;

        // Add User Model to log if user is passed
        if (`user` in obj && obj.user) {
            const { user: { username }} = obj;
            this.User._id = userId;
            this.User.username = username;
        }  

        this._id = id;
        this.requestId = requestId;
        this.status = status;
        this.version = version;
        this.userId = userId;        
        this.requestMethod = requestMethod;
        this.endpoint = endpoint;
        this.controller = controller;
        this.method = method;
        this.params = params && JSONbig.parse(params);
        this.requestBody = requestBody && JSONbig.parse(requestBody);
        this.message = message;
        this.response = response && JSONbig.parse(response);
        this.headers = headers && JSONbig.parse(headers);
        this.ipAddress = ipAddress;
        this.duration = duration ? duration.toFixed(5) : null;
        this.created = createdAt ? dayjs(createdAt).format('MM/DD/YY hh:mm:ss a') : null;
    }
}

export default RequestLog;
