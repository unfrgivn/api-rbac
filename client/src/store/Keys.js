import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';

import App from './App';
import Users from './Users';
import UI from './UI';
class Store {
    @observable loading = false;

    connect() {        
        App.feathers.service('keys').on('created', response => {
            console.log('NEW KEY CREATE EVENT', response);
    
            const createdKey = response;
            const currentUser = Users.getCurrentUser();

            // Add key to current user
            currentUser.keys.push(createdKey);
        });

        App.feathers.service('keys').on('removed', response => {
            console.log('NEW KEY DELETE EVENT', response);
    
            const deletedKey = response;
            const currentUser = Users.getCurrentUser();

            // Remove key from current user
            currentUser.keys = currentUser.keys.filter(key => key.id !== deletedKey.id);
        });
    }

    @action create = async data => {
        try {
            const response = await App.feathers.service('keys').create(data);
            UI.setMessage('New key created', 'success');
            this.loading = false;
            
            return response;

        } catch (error) {
            this.loading = false;
            return {error};
        }
    }

    @action delete = async keyId => {
        try {
            const response = await App.feathers.service('keys').remove(keyId);
            UI.setMessage('Key deleted', 'success');
            this.loading = false;
            
            return response;

        } catch (error) {
            this.loading = false;
            return {error};
        }
    }

    @action getSecret = (keyId, userId, userCreatedAt) => {
        // sha2(concat(k.id, u.id, u.created_at), 256
    }
}

export default new Store();