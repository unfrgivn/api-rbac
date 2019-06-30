// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const tokens = sequelizeClient.define('tokens', {
		refresh_token: {
			type: DataTypes.STRING(500),
			allowNull: false
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		application_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		// don't use camelcase for automatically added attributes but underscore style
		// so updatedAt will be updated_at
		underscored: true,
		hooks: {
			beforeCount(options) {
				options.raw = true;
			}
		},
		indexes: [
			{
				unique: true,
				fields: ['user_id', 'application_id']
			}
		]
	});

	// eslint-disable-next-line no-unused-vars
	tokens.associate = function (models) {
		// Define associations here
		// See http://docs.sequelizejs.com/en/latest/docs/associations/

		// Add user_id column to token model
		tokens.belongsTo(models.users, {
			foreignKey: 'user_id'
		});

		// Add application_id column to token model
		tokens.belongsTo(models.applications, {
			foreignKey: 'application_id'
		});
	};

	return tokens;
};
