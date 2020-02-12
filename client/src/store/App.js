import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';
import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';

import Actions from './Actions';
import Applications from './Applications';
import Groups from './Groups';
import Keys from './Keys';
import RequestLogs from './RequestLogs';
import UI from './UI';
import Users from './Users';

// When in development use the ENV-specificed host if exists, otherwsie socket server is same host/port as client 
const FEATHERS_HOST = process.env.NODE_ENV === 'development' ? process.env.FEATHERS_HOST : window.location.host;
class Store {
	@observable socketListenersConnected = false;
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

		this.feathers = feathers();

		this.feathers.configure(socketio(socket, {
			timeout: 5000 // Increase timeout for going out to API
		}));

		this.feathers.configure(auth({
			storageKey: 'auth'
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
		// Don't reconnect store listeners or they will stack
		if (!this.socketListenersConnected) {
			Actions.connect();
			Applications.connect();
			Groups.connect();
			Keys.connect();
			RequestLogs.connect();
			Users.connect();

			this.socketListenersConnected = true;
		}
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
		Applications.load();
        Groups.load();
		Users.load();
    }
}

export default new Store();
