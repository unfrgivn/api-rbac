// Initializes the `keys` service on path `/keys`
const createService = require('feathers-sequelize');
const createModel = require('../../models/keys.model');
const hooks = require('./keys.hooks');

module.exports = function (app) {
	const Model = createModel(app);
	const paginate = app.get('paginate');

	const options = {
		Model,
		paginate
	};

	// Initialize our service with any options it requires
	app.use('/keys', createService(options));

	// Get our initialized service so that we can register hooks
	const service = app.service('keys');

	service.hooks(hooks);
};
