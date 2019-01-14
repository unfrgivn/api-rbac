import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';
import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';
import localForage from 'localforage';

import Actions from './Actions';
import Groups from './Groups';
import UI from './UI';
import Users from './Users';

const FEATHERS_HOST = window.location.host; //process.env.FEATHERS_HOST;
class Store {
	@observable isConnecting = false; // for detecting connection to datasource API
	@persist @observable isSetup = false;
	@observable doingSetup = false;

	constructor () {
		//TODO: Remove this on prod
		// Option allows self-signed localhost requests to SSL feathers socket server in some browsers
		if (process.env.NODE_ENV !== 'development') {
			process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
		}

		const options = {
			transports: ['websocket'],
			pingTimeout: 3000,
			pingInterval: 5000,
			rejectUnauthorized: false
		};

		console.log(`CONNECTING TO ${FEATHERS_HOST}`);
		const socket = io(FEATHERS_HOST, options);

		this.feathers = feathers()
			.configure(socketio(socket, {
				timeout: 5000 // Increase timeout for going out to API
			}));

		this.feathers.configure(auth({
			storage: localForage
		  }));

		// Set up socket connections
		this.connect();
	}

	connect() {
		this.feathers.io.on('connect', () => {
			console.log('SOCKET CONNECTION MADE TO LOCALHOST');
			this.connectStores();
			this.isConnecting = false;
		});

		this.feathers.io.on('disconnect', () => {
			console.log('SOCKET DISCONNECTED FROM LOCALHOST');
			this.isConnecting = true;
		});
	}

	connectStores() {
		Actions.connect();
        Groups.connect();
		Users.connect();
	}

	isInitialized = async () => {
        try {
            const totalUsers = await this.feathers.service('users').find({
                query: {
                    $limit: 0
                }
            });

						console.log(`INITIALIZING.... FOUND ${totalUsers.total} USERS`);

            if (totalUsers.total < 1) {
                // App is not initialized, kick the setup screen
                this.isSetup = true;
            }

        } catch (error) {
            // console.log('ERROR', error);
        }
	}

	setup = async data => {

		this.doingSetup = true;

		const initData = {
			...data,
			init: true,
		}

		try {
            const response = await this.feathers.service('users').create(initData);

			console.log('SETUP RESPONSE', response);

            this.doingSetup = false;

            return response;

        } catch (error) {
            this.doingSetup = false;

            UI.setMessage(error.message, 'danger');

            return false;
        }
	}

	initStoreData = async () => {
		console.log('REFRESHING STORES');

        Actions.load();
        Groups.load();
		Users.load();
    }
}

export default new Store();
