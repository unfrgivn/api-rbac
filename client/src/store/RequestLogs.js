import { observable, action, toJS } from 'mobx';
import { persist } from 'mobx-persist';
import dayjs from 'dayjs';

import App from './App';
import UI from './UI';

import Models from './models';

class Store {
    @persist('object', Models.RequestLog) @observable requestLog = new Models.RequestLog();
	@observable requestLogId = null;
    @observable requestLogs = [];
    @observable loading = false;
    @observable isLoaded = false;
    @observable error = null;

    startDate = new Date(); // Date when application is loaded

    skip = 0;
    limit = 100;

    connect() {        
        App.feathers.service('request-logs').on('created', response => {
            console.log('NEW LOG CREATE EVENT', response);
    
            const createdLog = this.requestLog(response);

            this.groups.push(createdLog);
        });
    }

    @action load = async (loadNextPage = false, logQuery = {}) => {

        this.loading = true;

        try {
            // Set paging params
			const $skip = loadNextPage ? this.skip : 0;
            const $limit = this.limit;

            const {
                responseStatus,
                rewindMinutes,
                searchQuery,
            } = logQuery || {};

            let startDate = this.startDate;

            if (rewindMinutes) {
                startDate = dayjs(this.startDate).subtract(rewindMinutes, 'minute').toDate();
            }
            
            // TODO: Get all logs since last log Id in stack

            const response = await App.feathers.service('request-logs').find({
                query: {
                    created_at: {
                        $gt: startDate,
                    },
                    ...(responseStatus && {
                        status: responseStatus,
                    }),
                    ...(searchQuery && {
                        $or: [
                            { endpoint: { '$like': `%${searchQuery}%` }, },
                            { request_body: { '$like': `%${searchQuery}%` },}
                        ],
                    }),
                    $limit: $limit,
                    $skip: $skip,
                    $sort: {
                      created_at: 1
                    }
                },
                sequelize: {

                }
            });

            // Add formatted logs to stack
            const { data: responseData } = response || {};

            // console.log('FETCHED LOGS RESPONSE:', responseData);

            let fetchedLogs = [];

            let localRequestLogs = this.requestLogs;

			if (responseData && responseData.length) {

                // Skip is now the number of logs loaded locally??
                this.skip = this.skip + responseData.length;

				for (let itemLog of responseData) {
                    const newLog = new Models.RequestLog(itemLog);

                    if (newLog) {
                        fetchedLogs.unshift(newLog);
                    }

                    // Check for 
                    // const index = localRequestLogs.findIndex(t => t.request_id === itemLog.request_id);
                    // console
                    // if (index) {
                    //     localRequestLogs[index].subRequests.concat(newLog);
                    // } else {
                    //     // fetchedLogs.push(newLog);
                    //     localRequestLogs = localRequestLogs.concat(newLog);
                    // }

                    // // this.requestLogs = localRequestLogs.concat(newLog);

					// // if (newLog) {
					// // 	fetchedLogs.push(newLog);
					// // }
				}

                // Now group child requests under parent
                // let updatedRequestLogs = fetchedLogs.concat(localRequestLogs);
                
                // Keep track of request Ids
                // const uniqueRequestIds = [];

                const groupedRequestLogs = fetchedLogs.reduce((item, obj) => {
                    (item[obj.requestId] = item[obj.requestId] || []).push(obj);
                    return item;
                }, {});

                // Check if requestId exists from a previous fetch and append these requests logs to that parent
                // Otherwise remove the first item from the array as the parent and add remaining items as a sub requests
                const preparedRequests = Object.values(groupedRequestLogs).filter(item => {
                    const existingIndex = localRequestLogs.findIndex(t => t.requestId === item[0].requestId);
                    
                    if (existingIndex > -1) {
                        let existingSubRequests = localRequestLogs[existingIndex].subRequests;
                        const existingParent = localRequestLogs[existingIndex];
                        existingParent.subRequests = []; // Remove sub requests from old parent
                        
                        existingSubRequests.unshift(existingParent);

                        // Move parent to sub and add new items into request
                        
                        const newSubRequests = item.concat(existingSubRequests);
                        const newParent = newSubRequests.shift();
                        newParent.subRequests = newSubRequests;

                        // Replace parent with newly updated primary record
                        localRequestLogs[existingIndex] = newParent; 
                        // localRequestLogs[existingIndex].subRequests = item.concat(localRequestLogs[existingIndex].subRequests);
                        
                        // Return flase because we already mutated our existing array and don't want to add anything in the map()
                        return false;
                    }

                    return true;

                }).map(item => {
                    const initialRequest = item.shift();
                    initialRequest.subRequests = item;
                    return initialRequest;
                });

                // console.log(preparedRequests);

                // Append new logs to array
                this.requestLogs = preparedRequests.concat(localRequestLogs);

                // console.log('UPDATED ARRAY:', toJS(this.requestLogs));
            }

            this.loading = false;

            this.isLoaded = true;
            
            return response;

        } catch (err) {
            console.log(err);

            this.error = err;
            this.loading = false;
            UI.setMessage(err.message);
        }
    }

    @action clear = () => {
        this.requestLog = new Models.RequestLog();
        this.requestLogs = [];
        this.isLoaded = false;
        this.error = null;
    }
}

export default new Store();