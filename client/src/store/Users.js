import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';

import App from './App';
import Groups from './Groups';
import UI from './UI';

class Store {
    @observable users = [];
    @observable loading = false;
    @observable isLoaded = false;

    connect() {
        
        App.feathers.service('users').on('created', response => {
            console.log('NEW USER CREATE EVENT', response);

            const createdUser = response;
            this.users.push(createdUser);

            UI.setMessage(`New user ${createdUser.username} created`, 'success');
        });

        App.feathers.service('group-users').on('created', response => {
            console.log('NEW USER-GROUP CREATE EVENT', response);

            const createdGroupUser = response;
            const groupId = +createdGroupUser.group_id;
            const userId = +createdGroupUser.user_id;

            let group = Groups.groups.find(group => group.id === groupId);

            let userIndex = this.users.findIndex(user => user.id === userId);

            // Add group to user groups array if group item exists in store
            if (group && userIndex > -1) {
                this.users[userIndex].groups.push(group);
            }
        });

        App.feathers.service('group-users').on('removed', response => {
            console.log('NEW USER-GROUP DELETED EVENT', response);

            const deletedGroupUser = response;
            const groupId = +deletedGroupUser.group_id;
            const userId = +deletedGroupUser.user_id;

            let userIndex = this.users.findIndex(user => user.id === userId);

            // Search found user and filter out removed group Id
            if (userIndex > -1) {
                this.users[userIndex].groups = this.users[userIndex].groups.filter(group => group.id !== groupId);
            }
        });
    }

    @action load = async () => {
        this.loading = true;

        try {
            const response = await App.feathers.service('users').find({
                query: {
                    $sort: {
                      username: 1,
                    }
                  }
            });

            this.loading = false;

            this.users = response.data;

            console.log('USERS LOADED', response);

            // True regardless of whether actions are populated or empty bc we may not have created actions yet
            this.isLoaded = true;
            
            return response;

        } catch (error) {
            this.loading = false;
            
            UI.setMessage(error.message, 'danger');

            return {error};
        }
    }

    @action create = async data => {
        try {
            const response = await App.feathers.service('users').create(data);

            this.loading = false;
            
            return response;

        } catch (error) {
            this.loading = false;

            UI.setMessage(error.message, 'danger');

            return {error};
        }
    }

    @action addGroup = async (userId, groupId = null) => {
        groupId = groupId || this.group._id;

        this.loading = true;

        try {
            const response = await App.feathers.service('group-users').create({
                group_id: groupId,
                user_id: userId,
            });

        } catch (error) {
            this.loading = false;
            return {error};
        }
    }

    @action removeGroup = async (userId, groupId = null) => {
        groupId = groupId || this.group._id;

        this.loading = true;

        try {
            // Delete using query for group and users Ids
            const response = await App.feathers.service('group-users').remove(null, {
                query: { 
                    group_id: groupId,
                    user_id: userId,
                }
            });

        } catch (error) {
            this.loading = false;
            return {error};
        }
    }
}

export default new Store();