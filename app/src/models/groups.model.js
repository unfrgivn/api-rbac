// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const groups = sequelizeClient.define('groups', {
		name: {
			type: DataTypes.STRING,
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
	groups.associate = function (models) {
		// Define associations here
		// See http://docs.sequelizejs.com/en/latest/docs/associations/
		// groups.hasMany(models.group_actions, {
		// 	as: 'groupActions',
		// 	foreignKey: 'group_id'
		// });
		
		groups.belongsToMany(models.actions, {
			through: models.group_actions,
			as: 'actions',
			foreignKey: 'group_id'
		});

		groups.belongsToMany(models.users, {
			through: models.group_users,
			as: 'users',
			foreignKey: 'group_id'
		});

		// groups.belongsToMany(models.actions, {through: models.group_actions, foreignKey: 'group_id'});
	};

	return groups;
};
