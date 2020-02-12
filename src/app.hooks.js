// Application hooks that run for every service
const log = require('./hooks/log');

module.exports = {
	before: {
		all: [ 
			log(), 
			// context => {
			// 	// console.log(context);
			// 	const authentication = context.app.get('authentication');
			// 	console.log('AUTH', authentication);
			// },
		],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	},

	after: {
		all: [ log() ],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	},

	error: {
		all: [ log() ],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	}
};
