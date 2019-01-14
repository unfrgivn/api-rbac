// Initializes the `user-keys` service on path `/user-keys`
const createService = require('feathers-sequelize');
const createModel = require('../../models/user-keys.model');
const hooks = require('./user-keys.hooks');

module.exports = function (app) {
	const Model = createModel(app);
	const paginate = app.get('paginate');

	const options = {
		Model,
		paginate
	};

	// Initialize our service with any options it requires
	app.use('/user-keys', createService(options));

	// Get our initialized service so that we can register hooks
	const service = app.service('user-keys');

	service.hooks(hooks);
};
