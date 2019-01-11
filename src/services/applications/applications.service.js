// Initializes the `applications` service on path `/applications`
const createService = require('feathers-sequelize');
const createModel = require('../../models/applications.model');
const hooks = require('./applications.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/applications', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('applications');

  service.hooks(hooks);
};
