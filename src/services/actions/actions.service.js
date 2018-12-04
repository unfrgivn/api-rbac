// Initializes the `actions` service on path `/actions`
const createService = require('feathers-sequelize');
const createModel = require('../../models/actions.model');
const hooks = require('./actions.hooks');

module.exports = function (app) {
	const Model = createModel(app);
	const paginate = app.get('paginate');

	const options = {
		Model,
		paginate
	};

	// Initialize our service with any options it requires
	app.use('/actions', createService(options));

	// Get our initialized service so that we can register hooks
	const service = app.service('actions');

	service.hooks(hooks);
};
