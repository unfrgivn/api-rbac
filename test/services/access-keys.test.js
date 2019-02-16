const assert = require('assert');
const app = require('../../src/app');

describe('\'access-keys\' service', () => {
  it('registered the service', () => {
    const service = app.service('access-keys');

    assert.ok(service, 'Registered the service');
  });
});
