const assert = require('assert');
const app = require('../../src/app');

describe('\'groupActions\' service', () => {
  it('registered the service', () => {
    const service = app.service('group-actions');

    assert.ok(service, 'Registered the service');
  });
});
