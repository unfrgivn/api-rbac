const { authenticate } = require('@feathersjs/authentication').hooks;
const addAssociations = require('../../hooks/add-associations');

module.exports = {
	before: {
		all: [ authenticate('jwt') ],
		find: [
			addAssociations({
				models: [{
					model: 'actions',
					as: 'actions'
				}]
			})
		],
		get: [
			addAssociations({
				models: [{
					model: 'actions',
					as: 'actions'
				}]
			})
		],
		create: [],
		update: [],
		patch: [],
		remove: []
	},

	after: {
		all: [],
		find: [],
		get: [],
		create: [],
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
