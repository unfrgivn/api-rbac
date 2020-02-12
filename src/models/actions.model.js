// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const actions = sequelizeClient.define('actions', {
		endpoint: {
			type: DataTypes.STRING(500),
			allowNull: false,
			unique: true,
		},
		request_method: {
			type: DataTypes.STRING(10),
		},
		summary: {
			type: DataTypes.STRING(1000),
		},
		description: {
			type: DataTypes.TEXT,
		},
		params: {
			type: DataTypes.JSON,
		},
		loglevel: {
			type: DataTypes.STRING(50),
		},
		endpoint_data: {
			type: DataTypes.JSON
		},
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
	actions.associate = function (models) {
		// Define associations here
		// See http://docs.sequelizejs.com/en/latest/docs/associations/
		// actions.hasMany(models.group_actions, {
		// 	as: 'groupActions',
		// 	foreignKey: 'action_id'
		// });
		
		actions.belongsToMany(models.groups, {
			through: models.group_actions,
			as: 'groups',
			foreignKey: 'action_id'
		});

		// actions.belongsToMany(models.groups, {through: models.group_actions, foreignKey: 'action_id'});
	};

	return actions;
};
