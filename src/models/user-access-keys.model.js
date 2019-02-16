// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const userAccessKeys = sequelizeClient.define('user_access_keys', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		}
	}, {
		// don't use camelcase for automatically added attributes but underscore style
		// so updatedAt will be updated_at
		underscored: true,
		hooks: {
			beforeCount(options) {
				options.raw = true;
			}
		}
	});

	// eslint-disable-next-line no-unused-vars
	userAccessKeys.associate = function (models) {
		// Define associations here
		// See http://docs.sequelizejs.com/en/latest/docs/associations/
	};

	return userAccessKeys;
};
