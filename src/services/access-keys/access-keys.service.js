// Initializes the `access-keys` service on path `/access-keys`
const createService = require('feathers-sequelize');
const createModel = require('../../models/access-keys.model');
const hooks = require('./access-keys.hooks');

module.exports = function (app) {
	const Model = createModel(app);
	const paginate = app.get('paginate');

	const options = {
		Model,
		paginate
	};

	// Initialize our service with any options it requires
	app.use('/access-keys', createService(options));

	// Get our initialized service so that we can register hooks
	const service = app.service('access-keys');

	service.hooks(hooks);
};
