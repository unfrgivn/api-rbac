const { authenticate } = require('@feathersjs/authentication').hooks;

const generateKeys = require('../../hooks/generate-keys');
const addUserKey = require('../../hooks/create-user-key');

module.exports = {
	before: {
		all: [ authenticate('jwt') ],
		find: [],
		get: [],
		create: [ generateKeys() ],
		update: [],
		patch: [],
		remove: []
	},

	after: {
		all: [],
		find: [],
		get: [],
		create: [ addUserKey() ],
		update: [],
		patch: [],
		remove: []
	},

	error: {
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	}
};
