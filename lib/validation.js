/**
 * Here we validate all input parameters as well environment variables
 *
 * @author CHPAT6
 * @version 1.0.0
 */

const errorCodes = require('../config/error-codes.json');
const { envVars } = require('../config/constants.json');

const validateInput = (event, context) => {
  // input params validation
  if (!event) {
    throw new Error(errorCodes.MISSING_EVENT);
  }

  if (!event.bucket || !event.name) {
    throw new Error(errorCodes.MISSING_EVENT);
  }

  if (!context) {
    throw new Error(errorCodes.MISSING_CONTEXT);
  }

  if (!context.eventId) {
    throw new Error(errorCodes.MISSING_CONTEXT);
  }

  // environment variables validation
  envVars.forEach(ele => {
    if (!process.env[ele]) {
      throw new Error(`${errorCodes.MISSING_ENV_VAR_PREFIX} ${ele}`);
    }
  });
};

module.exports = { validateInput };
