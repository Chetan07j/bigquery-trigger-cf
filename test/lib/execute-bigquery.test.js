/**
 * Unit test for execute-bigquery.js functions.
 *
 * @author CHPAT6
 * @version 1.0.0
 */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { BigQuery } = require('@google-cloud/bigquery');
const sinon = require('sinon');
process.env = require('../fixtures/env-variables.json');

const { selectRecords } = require('../../lib/execute-bigquery');
const metadataStats = require('../fixtures/job-metadata-stats.json');
const metadataError = require('../fixtures/job-error-metadata.json');

chai.use(chaiAsPromised);
const { assert } = chai;

describe('Execute BigQuery:', () => {
  describe('Function: selectRecords', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should execute query successfully', () => {
      const createQueryJobStub = sinon.stub(BigQuery.prototype, 'createQueryJob')
        .resolves([{
          on: sinon.stub().yields(metadataStats, 'complete').returnsThis(),
          get: sinon.stub().resolves([metadataError]),
        }]);

      selectRecords();
      sinon.assert.calledOnce(createQueryJobStub);
    });

    it('should throw error', async () => {
      const createQueryJobStub = sinon.stub(BigQuery.prototype, 'createQueryJob')
        .returns(Promise.reject(new Error('Error occured')));

      assert.isRejected(selectRecords(), 'Error occured');
      sinon.assert.calledOnce(createQueryJobStub);
    });
  });
});
