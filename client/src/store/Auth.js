import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';

import App from './App';
import Actions from './Actions';
import Groups from './Groups';
import Users from './Users';

import Models from './models';

class Store {
    @observable user = new Models.User();
    @persist @observable isAuthenticated = false;
	@persist @observable token = null;
    @observable doingAuth = false;

    @action authenticate = async () => {
        this.doingAuth = true;
        this.isAuthenticated = false;
        
        try {
            // Try to authenticate using the JWT from localStorage
            const response = await App.feathers.authenticate();

            if (response) {
                this.isAuthenticated = true;
                this.token = response.accessToken;

                this.initStoreData();
            }

            return response;

        } catch (error) {
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

            this.doingAuth = false;

            if (response) {
                this.isAuthenticated = true;
                this.token = response.accessToken;

                this.initStoreData();
            }

            return response;

        } catch (error) {
            this.doingAuth = false;

            return {error};
        }
    }

    initStoreData = async () => {
        Actions.load();
        Groups.load();
        Users.load();
    }
}

export default new Store();