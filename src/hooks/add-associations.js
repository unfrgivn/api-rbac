// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
	return async context => {
		const sequelize = context.params.sequelize || {};
		const include = sequelize.include || [];

		//  Reasign in case we created these properties
		sequelize.include = include.concat(options.models.map(model => {
			const newModel = {...model};

			newModel.model = context.app.services[model.model].Model;
			return newModel;
		}));

		//  Nested output
		sequelize.raw = false;

		context.params.sequelize = sequelize;
		return context;
	};
};
