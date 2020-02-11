import { observable, action, toJS } from 'mobx';

import App from './App';
import UI from './UI';

class Store {
    @observable applications = [];
    @observable loading = false;
    @observable isLoaded = false;
    @observable error = null;

    connect() {        
        App.feathers.service('applications').on('created', response => {
            console.log('NEW APPLICATION CREATE EVENT', response);
            this.applications.push(response);
        });
    }

    @action load = async () => {
        this.loading = true;

        try {
            const response = await App.feathers.service('applications').find();

            this.loading = false;

            this.applications = response.data;
            console.log('FOUND APPLICATIONS', response);
            
            this.isLoaded = true;
            
            return response;

        } catch (error) {
            this.loading = false;
            return {error};
        }
    } 
}

export default new Store();