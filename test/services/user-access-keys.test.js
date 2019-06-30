const assert = require('assert');
const app = require('../../src/app');

describe('\'user-access-keys\' service', () => {
	it('registered the service', () => {
		const service = app.service('user-access-keys');

		assert.ok(service, 'Registered the service');
	});
});
