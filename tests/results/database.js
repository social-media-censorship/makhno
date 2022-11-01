const _ = require('lodash');
const { describe, expect, test } = require('@jest/globals');
const database = require('../../src/results/database');
const { ensureIndex } =  require('../../utils/build-index');

const mockResults  = require('../_payloads/results.json');

describe('Database (mongo/results)', () => {

  const testcfg = { 
    mongodb: 'mongodb://localhost:27017/teskhno'
  };

  test(`Ensure indexes are present`, async () => {
    const rv = await ensureIndex(testcfg, 'results');
    expect(rv).toHaveProperty('results', 6);
  });

  test(`Insert (successfully) a Results object`, async () => {
    /* ensure the DB is clean */
    for(const re of mockResults) {
      await database.removeResults(testcfg, re.testId);
    }

    const answer = await database
       .createResults(testcfg, mockResults);

    expect(answer).toBe(mockResults.length);
  });

  test(`Insert (of duplicated) Result objects`, async () => {
    // testId is not unique, so new copies are accepted, 
    // TODO we should identify the client offering the measurement
    const updatedR = _.map(mockResults, function(re) {
      _.unset(re, '_id');
      re.testTime = "2022-10-23";
      return re;
    });
    const answer = await database
      .createResults(testcfg, updatedR);
    expect(answer).toBe(updatedR.length);
  });

  test(`Retrieve the Results object`, async () => {
    const l = await database
      .queryResults(testcfg, { status: 'accessible' });
    /* the mockResults has only ONE accessible,
     * the test above duplicates it */
    expect(l).toHaveLength(2);
    const resfound = l[0];
    expect(resfound)
      .toHaveProperty('platform', mockResults[0].platform);
    const keyamount = _.keys(mockResults[0]).length;
    /* the same keys + _id */
    expect(_.keys(resfound).length).toBe(keyamount);
  });

});

