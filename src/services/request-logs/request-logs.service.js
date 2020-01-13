// Initializes the `tokens` service on path `/request-logs`
const createService = require('feathers-sequelize');
const createModel = require('../../models/request-logs.model');
const hooks = require('./request-logs.hooks');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

module.exports = function (app) {
	const Model = createModel(app);
	const paginate = app.get('paginate');

	const options = {
		Model,
		paginate,
		operators: {
			// $like and $notLike are already included by default in featherjs service
			$between: Op.between,
		},
		whitelist: [
			'$between',
			'$like',
			'$notLike',
		],
	};

	// Initialize our service with any options it requires
	app.use('/request-logs', createService(options));

	// Get our initialized service so that we can register hooks
	const service = app.service('request-logs');

	service.hooks(hooks);
};
