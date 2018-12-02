// Initializes the `groupActions` service on path `/group-actions`
const createService = require('feathers-sequelize');
const createModel = require('../../models/group-actions.model');
const hooks = require('./group-actions.hooks');

module.exports = function (app) {
	const Model = createModel(app);
	const paginate = app.get('paginate');

	const options = {
		Model,
		paginate
	};

	// Initialize our service with any options it requires
	app.use('/group-actions', createService(options));

	// Get our initialized service so that we can register hooks
	const service = app.service('group-actions');

	service.hooks(hooks);
};
