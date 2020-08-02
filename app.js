/**
 * Entry point of Cloud Function
 *
 * Steps executed:
 * - validate input and env variables
 * - selectRecords
 *
 * @author CHPAT6
 * @version 1.0.0
 */
const { validateInput } = require('./lib/validation');
const logger = require('./config/logger')(module);
const { selectRecords } = require('./lib/execute-bigquery');

const bigQueryJob = async (event, context) => {
  try {
    // validate input and env variables
    validateInput(event, context);
    logger.info(`File "${event.name}" uploaded to bucket "${event.bucket}" with event id: "${context.eventId}".`);

    // Select record from BigQuery Table
    return await selectRecords();
  } catch (err) {
    logger.error(err);
    return err;
  }
};

process
  .on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise} and reason: ${reason}`);
  })
  .on('uncaughtException', err => {
    logger.error(`Uncaught Exception: Message-[${err.message}] with stack - ${err.stack}`);
    process.exit(1);
  });

exports.bigQueryJob = bigQueryJob;
