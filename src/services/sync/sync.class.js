//Use this to create a sync service route
const axios = require('axios');

class Service {
	constructor (options) {
		this.options = options || {};
		this.apiConfig = options.apiConfig || null;
	}

	async find() {
		// Make call to API or other to get list of endpoints
		const endpoint = this.apiConfig.endpointsRoute;
		
		const axiosClient = axios.create({
			baseURL: this.apiConfig.baseUrl,
			withCredentials: true
		});

		const axiosConfig = {
			headers: {
				...this.apiConfig.headers
			}
		};

		const response = await axiosClient.get(endpoint, axiosConfig)
			.then(async response => {
				console.log(response.data);
				// Expects an array of endpoints 
				const apiEndpoints = response.data;

				// Filter API endpoints into array (data entries are arrays with 0 => key, 1 => endpoint)
				// const apiEndpoints = Object.entries(data).map(item => item[1]);

				// Retrieves all non-deleted actions
				const actionSearch = await this.app.service('/actions').find({
					paginate: false
				});

				// Get deleted actions
				const deletedActionSearch = await this.app.service('/actions').find({
					paginate: false,
					query: {
						deleted_at: {
							$ne: null
						}
					},
					sequelize: {
						paranoid: false,
					}
				});

				// Convert sequelize objects to arrays of endpoints
				const actionsArray = actionSearch.map(item => item.endpoint);
				const deletedActionsArray = deletedActionSearch.map(item => item.endpoint);

				// Loop through returned endpoints 
				apiEndpoints.forEach(endpoint => {

					// If previously deleted then just update					
					if (deletedActionsArray.indexOf(endpoint) > -1) {
						const deleteActionItem = deletedActionSearch.find(item => item.endpoint === endpoint);
						const deletedActionId = +deleteActionItem.id; 

						// In order to "re-create" a deleted item, we have to use patch and turn paranoid off
						// Update method will not work as the Id is seen as not existing
						this.app.service('/actions').patch(deletedActionId, {
							deleted_at: null
						}, {
							sequelize: {
								paranoid: false,
							}
						});
					}

					// Add actions not in database
					else if (actionsArray.indexOf(endpoint) === -1) {
						this.app.service('/actions').create({
							endpoint,
						});
					}
				});

				// Find actions in local DB that are no longer in API
				const actionsToDelete = actionsArray.filter(item => apiEndpoints.indexOf(item) < 0);

				actionsToDelete.forEach(endpoint => {
					const actionItem = actionSearch.find(item => item.endpoint === endpoint);
					const actionId = actionItem.id;
					
					if (deletedActionsArray.indexOf(endpoint) === -1) {
						this.app.service('/actions').remove(actionId);
					}
				});
				
			})
			.catch(error => {
				console.log(error);
				return error
			});

		return true;
	}

	setup(app) {
		this.app = app;
	}
}
	
module.exports = function (options) {
	return new Service(options);
};

module.exports.Service = Service;
