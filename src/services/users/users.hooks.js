const { authenticate } = require('@feathersjs/authentication').hooks;
const commonHooks = require('feathers-hooks-common');
const { NotAuthenticated } = require('@feathersjs/errors');

const addAssociations = require('../../hooks/add-associations');

const {
	hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

// TODO: Move this to hooks folder
const setUserData = (context) => {
	// console.log('Creating user', context.data);
	
	// Set default usertype -- MOVED this to model definition)
	// if (!context.data.usertype) {
	// 	context.data.usertype = 'user';
	// }

	return context;
};

module.exports = {
	before: {
		all: [],
		find: [
			// If a token was included, authenticate it with the `jwt` strategy.
			commonHooks.iff(
				context => context.params.token,
				[
					authenticate('jwt'),
					addAssociations({
						models: [{
							model: 'groups',
							as: 'groups'
						}]
					})
				]			  
			// No auth token, only return the total number of users to see if app has been initialized
			).else(context => {
				Object.assign(context.params.query, { $limit: 0 }); 
			})
		],
		get: [ 
			authenticate('jwt'),
			addAssociations({
				models: [{
					model: 'groups',
					as: 'groups'
				}]
			})
		],
		create: [ hashPassword(), setUserData ],
		update: [ hashPassword(),  authenticate('jwt') ],
		patch: [ hashPassword(),  authenticate('jwt') ],
		remove: [ authenticate('jwt') ]
	},

	after: {
		all: [ 
			// Make sure the password field is never sent to the client
			// Always must be the last hook
			protect('password')
		],
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
