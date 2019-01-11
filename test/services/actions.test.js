const assert = require('assert');
const app = require('../../src/app');

describe('\'actions\' service', () => {
  it('registered the service', () => {
    const service = app.service('actions');

    assert.ok(service, 'Registered the service');
  });
});
