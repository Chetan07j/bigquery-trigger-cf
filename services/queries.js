/**
 * The file contains functions which holds queries
 * required in {@link ../lib/execute-bigquery.js}
 *
 * @author CHPAT6
 * @version 1.0.0
 */
const { DATASET, TABLE } = process.env;

module.exports = {
  selectRecordQuery: () => `SELECT DISTINCT(employeeId) FROM ${DATASET}.${TABLE} WHERE createdAt = @createdAt;`,
};
