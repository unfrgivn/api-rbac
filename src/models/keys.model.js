// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const keys = sequelizeClient.define('keys', {
		key: {
			type: DataTypes.STRING(500),
			allowNull: false
		}
	}, {
		// don't delete database entries but set the newly added attribute deletedAt
		// to the current date (when deletion was done). paranoid will only work if
		// timestamps are enabled
		paranoid: true,
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
	keys.associate = function (models) {
		// Define associations here
		// See http://docs.sequelizejs.com/en/latest/docs/associations/
		keys.belongsToMany(models.users, {
			through: models.user_keys,
			as: 'users',
			foreignKey: 'key_id'
		});
	};

	return keys;
};
