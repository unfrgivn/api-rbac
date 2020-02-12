import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';

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
        
        try {
            const response = await App.feathers.reAuthenticate();
            console.log('REAUTH', response);

            // const accessToken = await App.feathers.authentication.getAccessToken();
            // console.log('Access Token', accessToken);
        
            this.doingAuth = false;

            App.isInitialized();

            return;

            // Try to authenticate using the JWT from localStorage
            // const response = App.feathers.reAuthenticate();
 
            // console.log('Reauth', accessToken, response);
            
            // NOTE: When upgrading to feathersjs v4 use reAuthenticate method
            // const feathersAuth = await App.feathers.get('authentication');
            // const { user: feathersUser, accessToken: feathersAccessToken } = feathersAuth || {};

            // console.log('EXISTING FEATHERS AUTH:', feathersAuth);

            // const feathersAuthResponse = (feathersUser && feathersAccessToken) && await App.feathers.reAuthenticate();
       
            // console.log(`${feathersAccessToken ? 'RE-' : ''}AUTHENTICATING WITH TRANSPORT API`, feathersAuthResponse);
            

            // const response = await App.feathers.authenticate();

            // if (response) {
            //     this.isAuthenticated = true;
            //     this.token = response.accessToken;                
            //     App.initStoreData();
            // } 

            // return response;

        } catch (error) {
            console.log('ERROR:', error);

            // Logout and delete the access token since it's no good
            await App.feathers.logout();

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

            console.log('AUTH RESPONSE:', response);
            
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

    @action logout = async () => {
        await App.feathers.logout();

        return this.clearStorage();        
    }
    
    @action clearStorage = async () => {
        this.isAuthenticated = false;
		this.token = null;
        this.user = new Models.User();

		return true;
	};
}

export default new Store();