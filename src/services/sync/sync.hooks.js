module.exports = {
	before: {
		all: [],
		find: [],
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
		all: [
			error => {
				console.log('ERRRRRRRRROR', error);
				throw new Error('Simulated error');
			}
		],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	}
};
