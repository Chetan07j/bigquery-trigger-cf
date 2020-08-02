/**
 * Logger: Based on STACKDRIVER_LOGGER winston logger is set and exported
 * If STACKDRIVER_LOGGER is set to true then logs will be on stackdriver
 * otherwise it will print logs in console only
 *
 * @author CHPAT6
 * @version 1.0.0
 */
const { transports, createLogger, format } = require('winston');
const { LoggingWinston } = require('@google-cloud/logging-winston');

const {
  combine, timestamp, printf, errors,
} = format;
const loggingWinston = new LoggingWinston({
  serviceContext: {
    service: 'bigquery-trigger-cf',
  },
});

const { STACKDRIVER_LOGGER = 'false', NODE_ENV, JSON_LOG = 'false' } = process.env;

const setTrasnsport = () => {
  if (JSON.parse(STACKDRIVER_LOGGER.toLowerCase())) {
    return [loggingWinston, new transports.Console()];
  }

  return [new transports.Console()];
};

const getFilename = input => {
  const parts = input.split(/[\\/]/);
  return `${parts[parts.length - 2]}/${parts.pop()}`;
};

/**
 * In this function custom log format is created
 * Here we have defined two formats one is JSON & other SingleLine
 *
 * If "JSON_LOG" from env is set to true then  JSON log is returned
 * else single line
 *
 * @param {string} filename - filename in which log is added
 */

const loggerFormat = filename => printf(({
  // eslint-disable-next-line no-shadow
  timestamp, level, message, stack,
}) => {
  let fName = filename;
  let output = {
    app: 'APP',
    module: 'BQT_CF',
    processPID: process.pid,
    level: level.toUpperCase(),
    file: fName,
    msg: message,
    ts: timestamp,
  };

  if (stack) {
    const frame = (stack.split('\n')[1]).trim().split(' ');
    const stackTrace = {
      function: frame[1],
      line: frame[2].split(':')[2],
      stack,
    };

    const stackFileName = getFilename(frame[2]).split(':')[0];
    output.file = stackFileName;

    // eslint-disable-next-line prefer-destructuring
    fName = `${stackFileName}-[Line: ${stackTrace.line}]`;
    output = { ...output, ...stackTrace };
  }

  const lChar = level.charAt(0).toUpperCase();
  let singleLineLog = `${timestamp}-[${process.pid}]-APP-BQT_CF-${lChar}-${fName}- ${message}`;
  singleLineLog = stack ? `${singleLineLog}- {stack: ${stack}}` : singleLineLog;
  return JSON.parse(JSON_LOG.toLowerCase()) ? JSON.stringify(output) : singleLineLog;
});

/**
 * This function sets optional lable for each log
 * Extracts and adds relative path of file to logger
 *
 * @param {string} callingModule - complete path of file
 */
const getLabel = callingModule => getFilename(callingModule.filename);

module.exports = callingModule => createLogger({
  format: combine(
    timestamp(),
    errors({ stack: true }),
    loggerFormat(getLabel(callingModule)),
  ),
  silent: (NODE_ENV === 'test'),
  transports: setTrasnsport(),
});
