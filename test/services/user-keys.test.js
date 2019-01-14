const assert = require('assert');
const app = require('../../src/app');

describe('\'user-keys\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-keys');

    assert.ok(service, 'Registered the service');
  });
});
