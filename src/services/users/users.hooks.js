const { authenticate } = require('@feathersjs/authentication').hooks;
const commonHooks = require('feathers-hooks-common');
const { NotAuthenticated } = require('@feathersjs/errors');

const addAssociations = require('../../hooks/add-associations');
// const writeJSONFields = require('../../hooks/write-json');

const {
	hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

// TODO: Move this to hooks folder
const setUserData = (context) => {
	console.log('Creating user', context.data);
	
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
			// No provider passed means the call came from inside such as the initial lookup after auth
			// and in this case we would not yet have an accessToken passed in the query
			commonHooks.iff(
				context => !("provider" in context.params) || context.params.authenticated,
				authenticate('jwt'),
				addAssociations({
					models: [{
						model: 'groups',
						as: 'groups'
					},
					{
						model: 'keys',
						as: 'keys'
					}]
				})
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
				},
				{
					model: 'keys',
					as: 'keys'
				}]
			})
		],
		create: [ 
			// If calling from setup method with no users, then allow unauthenticated call
			commonHooks.iff(
				context => {
					if (context.params.authenticated === undefined) {
						return false;
					} else {
						return true;
					}
				},
				hashPassword(), 
				authenticate('jwt'), 
				setUserData	  
			// No auth token, only return the total number of users to see if app has been initialized
			).else(async context => {
				// Check to see if application has been setup (has users in DB)
				const foundUsers = await context.app.services['users'].find({
					query: {
						$limit: 0
					}
				});
				
				if (foundUsers && foundUsers.total === 0) {
					return context;
				} else {
					return Promise.reject(new NotAuthenticated(`Only authenticated users and setup can create users`));
				}
			},
			// writeJSONFields(['userdata']),
			hashPassword())
		],
		update: [ 
			hashPassword(), 
			// writeJSONFields(['userdata']), 
			authenticate('jwt') 
		],
		patch: [ 
			hashPassword(), 
			// writeJSONFields(['userdata']), 
			authenticate('jwt') 
		],
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
