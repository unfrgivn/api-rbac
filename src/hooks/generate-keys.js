// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const crypto = require('crypto');

const generateToken = ({ stringBase = 'base64', byteLength = 48 } = {}) => {
	return new Promise((resolve, reject) => {
		crypto.randomBytes(byteLength, (err, buffer) => {
			if (err) {
				reject(err);
			} else {
				resolve(buffer.toString(stringBase));
			}
		});
	});
};

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
	return async context => {		

		if (!context.data.user_id) {
			throw new Error('User Id required to generate key');
		}
		
		// Generate unique API key
		const key = await generateToken({byteLength: 20});
		// console.log("access_key:", key);
		context.data.access_key = key;

		// Generate unique API secret
		const secret = await generateToken();
		// console.log("secret:", secret);
		context.data.secret = secret;

		// Hooks should always return the context
		return context;
	};
};
