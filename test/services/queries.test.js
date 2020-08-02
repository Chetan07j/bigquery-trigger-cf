/**
 * Unit test for queries.js
 *
 * @author CHPAT6
 * @version 1.0.0
 */

const { assert } = require('chai');
const { selectRecordQuery } = require('../../services/queries');
process.env = require('../fixtures/env-variables.json');

describe('Queries function tests:', () => {
  it('should return valid string query', () => {
    const result = selectRecordQuery();
    assert.isString(result);
  });

  it('should not contain "undefined" in query', () => {
    const result = selectRecordQuery();
    assert.notInclude(result, 'undefined');
  });
});
