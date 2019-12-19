// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const requestLogs = sequelizeClient.define('request_logs', {
		request_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		version: {
			type: DataTypes.STRING(10),
		},
		user_id: {
			type: DataTypes.INTEGER,
		},
		application_id: {
			type: DataTypes.INTEGER,
		},
		request_method: {
			type: DataTypes.STRING(10),
		},
		endpoint: {
			type: DataTypes.STRING(500),
		},	
		controller: {
			type: DataTypes.STRING(100),
		},	
		method: {
			type: DataTypes.STRING(255),
		},		
		params: {
			type: DataTypes.STRING(5000),
		},
		request_body: {
			type: DataTypes.STRING(10000),
		},
		message: {
			type: DataTypes.STRING(500),
		},
		response: {
			type: DataTypes.STRING(10000),
		},
		headers: {
			type: DataTypes.STRING(10000),
		},
		ip_address: {
			type: DataTypes.STRING(45),
		},
		duration: {
			type: DataTypes.FLOAT,
		},
	}, {
		// don't use camelcase for automatically added attributes but underscore style
		// so updatedAt will be updated_at
		underscored: true,
		updatedAt: false,
		hooks: {
			beforeCount(options) {
				options.raw = true;
			}
		},
		indexes: [
			{
				fields: ['request_id'],
			},
			{
				fields: ['status'],
			},
			{
				fields: ['version'],
			},
			{
				fields: ['user_id'],
			},
			{
				fields: ['request_method'],
			},
			{
				fields: ['endpoint'],
			},
			{
				fields: ['controller'],
			},
			{
				fields: ['method'],
			},
			{
				fields: ['message'],
			},
			{
				fields: ['created_at'],
			},
			{
				fields: ['ip_address'],
			},
			{
				fields: [{
					attribute: 'params',
					length: 1000, // Limit index prefix to first X chars
				}],
			},
			{
				fields: [{
					attribute: 'request_body',
					length: 1000, // Limit index prefix to first X chars
				}],
			},
			{
				fields: [{
					attribute: 'headers',
					length: 1000, // Limit index prefix to first X chars
				}],
			},
		]
	});

	// eslint-disable-next-line no-unused-vars
	requestLogs.associate = function (models) {
		// Define associations here
		// See http://docs.sequelizejs.com/en/latest/docs/associations/

		// Add user_id column to request logs model
		requestLogs.belongsTo(models.users, {
			foreignKey: 'user_id'
		});
	};

	return requestLogs;
};
