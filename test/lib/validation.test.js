/**
 * Unit test for validation.js
 *
 * @author CHPAT6
 * @version 1.0.0
 */

const { assert } = require('chai');
const envValues = require('../fixtures/env-variables.json');
const { validateInput } = require('../../lib/validation');
const errorCodes = require('../../config/error-codes.json');
const { envVars } = require('../../config/constants.json');

describe('Validation function tests:', () => {
  beforeEach(() => {
    process.env = JSON.parse(JSON.stringify(envValues));
  });

  it(`should throw "${errorCodes.MISSING_EVENT}" if event object is missing or null`, () => {
    const context = { eventId: '126348454' };

    assert.throws(() => validateInput(null, context), Error, errorCodes.MISSING_EVENT);
  });

  it(`should throw "${errorCodes.MISSING_EVENT}" if "bucket" name is missing in event`, () => {
    const event = { name: 'test-filename.json' };
    const context = { eventId: '126348454' };

    assert.throws(() => validateInput(event, context), Error, errorCodes.MISSING_EVENT);
  });

  it(`should throw "${errorCodes.MISSING_EVENT}" if filename name is missing in event`, () => {
    const event = { bucket: 'test-bucket' };
    const context = { eventId: '126348454' };

    assert.throws(() => validateInput(event, context), Error, errorCodes.MISSING_EVENT);
  });

  it(`should throw "${errorCodes.MISSING_CONTEXT}" if context is null`, () => {
    const event = { bucket: 'test-bucket', name: 'test-file.json' };

    assert.throws(() => validateInput(event, null), Error, errorCodes.MISSING_CONTEXT);
  });

  it(`should throw "${errorCodes.MISSING_CONTEXT}" if context eventId in it is missing`, () => {
    const event = { bucket: 'test-bucket', name: 'test-file.json' };
    const context = {};

    assert.throws(() => validateInput(event, context), Error, errorCodes.MISSING_CONTEXT);
  });

  envVars.forEach(ele => {
    it(`should throw error if env variable ${ele} is not set`, () => {
      const event = { bucket: 'test-bucket', name: 'test-file.json' };
      const context = { eventId: '126348454' };
      process.env[ele] = null;

      assert.throws(() => validateInput(event, context), Error, `${errorCodes.MISSING_ENV_VAR_PREFIX} ${ele}`);
    });
  });
});
