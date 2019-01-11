// Initializes the `sync` service on path `/sync`
const createService = require('./sync.class.js');
const hooks = require('./sync.hooks');

module.exports = function (app) {

	const apiConfig = app.get('api');

	const options = {
		apiConfig,
	};

	// Initialize our service with any options it requires
	app.use('/sync', createService(options));

	// Get our initialized service so that we can register hooks
	const service = app.service('sync');

	service.hooks(hooks);
};