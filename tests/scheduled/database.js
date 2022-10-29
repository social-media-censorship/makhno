const _ = require('lodash');
const { describe, expect, test } = require('@jest/globals');

const database = require('../../src/scheduled/database');

const mockScheduled  = require('../_payloads/scheduled.json');

describe('Database (mongo/scheduled)', () => {

  const testcfg = { 
    mongodb: 'mongodb://localhost:27017/teskhno'
  };

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
    const l = await database
      .queryScheduled(testcfg, { testId: newobj.testId });
    expect(l).toHaveLength(1);
    const existing = l[0];
    expect(existing)
      .toHaveProperty('platform', newobj.platform);
    expect(existing)
      .toHaveProperty('testId', newobj.testId);
    expect(existing)
      .toHaveProperty('vantagePoint', newobj.vantagePoint);
  });

});

