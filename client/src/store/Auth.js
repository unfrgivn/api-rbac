import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';
import localForage from 'localforage';

import App from './App';

import Models from './models';
import UI from './UI';

class Store {
    @observable user = new Models.User();
    @persist @observable isAuthenticated = false;
	@persist @observable token = null;
    @observable doingAuth = false;

    @action authenticate = async () => {
        this.doingAuth = true;
        this.isAuthenticated = false;
        
        const localJwt = await localForage.getItem('feathers-jwt');
        if (!localJwt) {
            this.doingAuth = false;

            App.isInitialized();

            return;
        }

        try {
            // Try to authenticate using the JWT from localStorage
            const response = await App.feathers.authenticate();

            if (response) {
                this.isAuthenticated = true;
                this.token = response.accessToken;                
                App.initStoreData();
            } 

            return response;

        } catch (error) {
            // Delete the stored key since it's no good
            await localForage.removeItem('feathers-jwt');

            this.doingAuth = false;
            this.isAuthenticated = false;

            return {error};
        }
    };

    @action login = async (username, password) => {
        this.doingAuth = true;

		const credentials = {
            username,
            password
        };

        const payload = Object.assign({ strategy: 'local' }, credentials);

        try {
            
            const response = await App.feathers.authenticate(payload);

            if (response) {
                this.isAuthenticated = true;
                this.token = response.accessToken;

                App.initStoreData();
            }

            this.doingAuth = false;

            return response;

        } catch (error) {
            this.doingAuth = false;

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

            UI.setMessage(error, 'danger');

            return {error};
        }
    }
}

export default new Store();