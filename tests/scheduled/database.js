const _ = require('lodash');
const { describe, expect, test } = require('@jest/globals');
const database = require('../../src/scheduled/database');
const { ensureIndex } =  require('../../utils/build-index');

const mockScheduled = require('../_payloads/scheduled.json');
const mockSubmission = require('../_payloads/submission.json');

describe('Database (mongo/scheduled)', () => {

  const testcfg = { 
    mongodb: 'mongodb://localhost:27017/teskhno'
  };

  test(`Ensure indexes are present`, async () => {
    const rv1 = await ensureIndex(testcfg, 'scheduled');
    expect(rv1).toHaveProperty('scheduled', 4);
    const rv2 = await ensureIndex(testcfg, 'submission');
    expect(rv2).toHaveProperty('submission', 2);
  });

  const newobj = _.clone(mockScheduled);
  newobj.iteration = 0;
  newobj.testId = _.times(40, () => { return "A"} ).join('');

  test(`Insert (successfully) a Scheduled object`, async () => {
    /* ensure it is deleted if exist */
    await database.removeScheduled(testcfg, newobj.testId);

    const results  = await database
       .createScheduled(testcfg, [ newobj ]);
    expect(results).toHaveProperty('inserted', 1);
    expect(results).toHaveProperty('duplicated', 0);
  });

  test(`Insert (fail beause of duplication) a Scheduled object`, async () => {
    const results  = await database
       .createScheduled(testcfg, [ newobj ]);
    expect(results).toHaveProperty('inserted', 0);
    expect(results).toHaveProperty('duplicated', 1);
  });

  test(`Retrieve the Scheduled object`, async () => {
    // remind self the lookup isn't picking the right
    // submission. this test isn't complete, should
    // include a test of 'http.js'
    const l = await database
      .queryScheduled(testcfg, 
        {
          firstMatch: { testId: newobj.testId },
          lastMatch: { }
        });
    // console.log(l);
    expect(l).toHaveLength(1);
    const existing = l[0];
    expect(existing)
      .toHaveProperty('iteration', newobj.iteration);
    expect(existing)
      .toHaveProperty('testId', newobj.testId);
    expect(existing)
      .toHaveProperty('vantagePoint', newobj.vantagePoint);
  });

});

