import { observable, action } from 'mobx';
import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';
import localForage from 'localforage';

const FEATHERS_HOST = process.env.FEATHERS_HOST;

class Store {
	@observable isConnecting = false; // for detecting connection to datasource API

	constructor () {
		//TODO: Remove this on prod
		// Option allows self-signed localhost requests to SSL feathers socket server in some browsers
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

		const options = {
			transports: ['websocket'],
			pingTimeout: 3000,
			pingInterval: 5000,
			// ca: fs.readFileSync('server-cert.pem'),
			rejectUnauthorized: false
		};

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
			this.isConnecting = false;
		});

		this.feathers.io.on('disconnect', () => {
			console.log('SOCKET DISCONNECTED FROM LOCALHOST');
			this.isConnecting = true;
		});
	}
}

export default new Store();
