import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';

import App from './App';
import UI from './UI';
class Store {
    @observable actions = [];
    @observable loading = false;
    @observable isLoaded = false;
    @observable isSyncing = false;

    constructor() {
        
        App.feathers.service('actions').on('created', response => {
            console.log('NEW ACTION CREATE EVENT', response);
    
            const createdAction = response;
            this.actions.push(createdAction);
        });
    }

    @action load = async () => {
        this.loading = true;

        try {
            const response = await App.feathers.service('actions').find({
                query: {
                    $sort: {
                      endpoint: 1,
                    }
                  }
            });

            this.loading = false;

            this.actions = response.data;

            console.log('ACTIONS LOADED', response);
            // True regardless of whether actions are populated or empty bc we may not have created actions yet
            this.isLoaded = true;
            
            return response;

        } catch (error) {
            this.loading = false;
            return {error};
        }
    }

    @action create = async data => {
        try {
            const response = await App.feathers.service('actions').create(data);

            this.loading = false;
            
            return response;

        } catch (error) {
            this.loading = false;
            return {error};
        }
    }

    @action sync = async () => {
        this.isSyncing = true;

        try {
            const response = await App.feathers.service('sync').find();

            this.isSyncing = false;
            
            console.log('SYNC RESPONSE', response);
            return response;

        } catch (error) {
            this.isSyncing = false;

            UI.setMessage(error.message, 'danger');

            return {error};
        }
    }
}

export default new Store();