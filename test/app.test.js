/**
 * Unit test for app.js entry function using chai-assert
 * Sinon Stub used to stub Storage, BigQuery
 *
 * @author CHPAT6
 * @version 1.0.0
 */

const { assert } = require('chai');
const { BigQuery } = require('@google-cloud/bigquery');
const sinon = require('sinon');

process.env = require('./fixtures/env-variables.json');
const { bigQueryJob } = require('../app');
const metadataStats = require('./fixtures/job-metadata-stats.json');
const metadataError = require('./fixtures/job-error-metadata.json');

describe('Functiom "bigQueryJob" Unit Tests:', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should throw error if function does not get input', async () => {
    const result = await bigQueryJob();
    assert.instanceOf(result, Error);
  });

  it('should execute steps successfully', async () => {
    const event = {
      name: 'filename.json',
      bucket: 'test-bucket',
    };
    const context = {
      eventId: '1234343',
    };

    sinon.stub(BigQuery.prototype, 'createQueryJob')
      .resolves([{
        on: sinon.stub().yields(metadataStats, 'complete').returnsThis(),
        get: sinon.stub().resolves([metadataError]),
      }]);

    const result = await bigQueryJob(event, context);
    assert.equal(result, undefined);
  });

  it('should cover unhandledRejection block', done => {
    process.on('unhandledRejection', () => {
      done();
    });

    async function main() {
      Promise.reject(new Error('test'));
    }
    main();
  });
});
