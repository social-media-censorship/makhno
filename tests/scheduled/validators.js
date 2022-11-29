const _ = require('lodash');
const { describe, expect, test } = require('@jest/globals');
const validators = require('../../src/scheduled/validators');

const mockScheduled = require('../_payloads/scheduled.json');

describe('Scheduled validator', () => {

  const SCHEDULE_LIST_LENGTH = 6;
  const mockScheduledList = _.times(SCHEDULE_LIST_LENGTH, (i) => {
    const r = _.clone(mockScheduled);
    r.iteration = i;
    r.testId += `${i}`;
    return r;
  });

  test(`Validate (correct) scheduled objects`, () => {
    const rv = validators.validateScheduled(mockScheduledList);
    expect(rv).toHaveLength(SCHEDULE_LIST_LENGTH);
    _.times(SCHEDULE_LIST_LENGTH, function(i) {
      expect(rv[i])
        .toHaveProperty('iteration', i);
    })
  });

  test(`Validate (reject) incomplete object`, () => {
    const x = _.clone(mockScheduled);
    _.unset(x, 'iteration');
    const rv = validators.validateScheduled([ x ]);
    expect(rv).toHaveLength(0);
  })

  test(`validate query (string patterns)`, () => {
    const filter = {
      platform: 'tiktok',
      marker: 'ciao123',
      countryCode: 'xX'
    };
    const fstring = JSON.stringify(filter);
    const rv = validators.queryScheduled(fstring);
    expect(rv)
      .toHaveProperty('platform', 'tiktok');
    expect(rv)
      .toHaveProperty('countryCode', 'XX'); // toUpper!
    expect(rv)
      .toHaveProperty('marker', 'ciao123');
  });

});
