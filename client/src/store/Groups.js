import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';

import App from './App';
import Actions from './Actions';

import Models from './models';

class Store {
    @observable group = new Models.Group();
    @observable groupId = null;
    @observable groups = [];
    @observable loading = false;
    @observable isLoaded = false;

    connect() {
        
        App.feathers.service('groups').on('created', response => {
            console.log('NEW GROUP CREATE EVENT', response);
    
            const createdGroup = {
                ...response,
                actions: [], // Init with empty array of actions
            };

            this.groups.push(createdGroup);
        });

        App.feathers.service('group-actions').on('created', response => {
            console.log('NEW ACTION-GROUP CREATE EVENT', response);

            const createdGroupAction = response;
            const actionId = +createdGroupAction.action_id;

            let action = Actions.actions.find(item => item.id === actionId);

            // Add action to group actions array if action item exists in store
            if (action) {
                this.group.actions.push(action);
            }
        });

        App.feathers.service('group-actions').on('removed', response => {
            console.log('NEW ACTION-GROUP DELETED EVENT', response);

            const deletedGroupAction = response;
            const actionId = +deletedGroupAction.action_id;

            // Remove action from group actions array if action item exists
            this.group.actions = this.group.actions.filter(item => item.id !== actionId);
        });
    }

    @action load = async () => {
        this.loading = true;

        try {
            const response = await App.feathers.service('groups').find();

            this.loading = false;

            this.groups = response.data;
            console.log('FOUND GROUPS', response);
            // True regardless of whether groups is populated or empty bc we may not have created groups yet
            this.isLoaded = true;
            
            return response;

        } catch (error) {
            this.loading = false;
            return {error};
        }
    }    

    @action setGroup = async groupId => {
        this.loading = true;

        // Set group Id for store
        this.groupId = groupId;

        // Load group data
        try {
            const response = await App.feathers.service('groups').get(groupId);

            this.loading = false;

            this.group._id = response.id;
            this.group.name = response.name;
            // this.group.users = [];
            this.group.actions = response.actions;
            
            return response;

        } catch (error) {
            this.group = new Models.Group();
            this.loading = false;
            return {error};
        }
    }

    @action create = async data => {
        this.loading = true;

        try {
            const response = await App.feathers.service('groups').create(data);

            this.loading = false;

            if (response.id) {

                // Set the current group Id to the new one 
                this.groupId = response.id;
            }
            
            return response;

        } catch (error) {
            this.loading = false;
            return {error};
        }
    }

    @action addAction = async actionId => {
        this.loading = true;

        try {
            const response = await App.feathers.service('group-actions').create({
                group_id: this.group._id,
                action_id: actionId,
            });

        } catch (error) {
            this.loading = false;
            return {error};
        }
    }

    @action removeAction = async actionId => {
        this.loading = true;

        try {
            // Delete using query for group and action Ids
            const response = await App.feathers.service('group-actions').remove(null, {
                query: { 
                    group_id: this.group._id,
                    action_id: actionId,
                }
            });

        } catch (error) {
            this.loading = false;
            return {error};
        }
    }
}

export default new Store();