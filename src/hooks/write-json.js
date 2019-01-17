// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (JSONFields = []) {
	return async context => {
		for (const key of JSONFields) {
			if (context.data.hasOwnProperty(key)) {
				context.data[key] = JSON.parse(context.data[key]);
			}
		}

		// Hooks should always return the context
		return context;
	};
};
