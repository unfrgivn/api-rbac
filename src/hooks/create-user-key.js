// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
	return async context => {
		// Get `app`, `method`, `params` and `result` from the hook context
		const { app, method, result, params } = context;

		const keyId = result.id;
		const userId = context.data.user_id;

		if (!keyId || !userId) {
			throw new Error('Unable to assign key');
		}

		// Create user-key record
		const userKey = await app.service('user-keys').create({
			key_id: keyId,
			user_id: userId,
		});

		// Best practice, hooks should always return the context
		return context;
	};
};