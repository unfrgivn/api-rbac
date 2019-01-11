const users = require('./users/users.service.js');
const groups = require('./groups/groups.service.js');
const groupActions = require('./group-actions/group-actions.service.js');
const actions = require('./actions/actions.service.js');
const groupUsers = require('./group-users/group-users.service.js');
const tokens = require('./tokens/tokens.service.js');
const applications = require('./applications/applications.service.js');
const sync = require('./sync/sync.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
	app.configure(users);
	app.configure(groups);
	app.configure(groupActions);
	app.configure(actions);
	app.configure(groupUsers);
	app.configure(tokens);
	app.configure(applications);
	app.configure(sync);
};
