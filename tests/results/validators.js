const _ = require('lodash');
const { describe, expect, test } = require('@jest/globals');
const validators = require('../../src/results/validators');
const results = require('../../utils/results');


describe('Results validator (query parameters)', () => {

  test(`Validate query (correctly) date+country+day`, () => {
    const spayload = JSON.stringify({
      countryCode: 'be',
      day: "2022-10-31",
      platform: 'tiktok'
    });

    const rv = validators.queryResults(spayload);

    expect(rv).toHaveProperty('platform', 'tiktok');
    expect(rv).toHaveProperty('countryCode', 'BE');
    expect(rv).toHaveProperty('testTime.$gte');
    expect(rv).toHaveProperty('testTime.$lte');
  });

  test(`Validate query by ${results.determinationSupported.length} determinations`, () => {
    _.each(results.determinationSupported, function(determination) {
      const spayload = JSON.stringify({
        determination
      });
      const x = validators.queryResults(spayload);
      expect(x).toHaveProperty('determination', determination);
    });
  });

  test(`Fail to validate a query by an invalid platform`, () => {
    const spayload = JSON.stringify({
      determination: "whatever"
    });
    expect(() => validators.queryResults(spayload)).toThrow();
  })

});

/*
describe('Results validator (input filtering)', () => {

	  // all TODO
  const SCHEDULE_LIST_LENGTH = 6;
  const mockResultsList = _.times(SCHEDULE_LIST_LENGTH, (i) => {
    const r = _.clone(mockResults);
    r.iteration = i;
    r.testId += `${i}`;
    return r;
  });

  test(`Validate (correct) results objects`, () => {
    const rv = validators.validateResults(mockResultsList);
    expect(rv).toHaveLength(SCHEDULE_LIST_LENGTH);
    expect(rv[0])
      .toHaveProperty('platform', 'tiktok');
    expect(rv[0])
      .toHaveProperty('iteration', 0);
  });


  test(`Validate (reject) incomplete object`, () => {
    const x = _.clone(mockResults);
    _.unset(x, 'iteration');
    const rv = validators.validateResults([ x ]);
    expect(rv).toHaveLength(0);
  })

  test(`validate query (by platform)`, () => {
    const filter = { platform: 'tiktok' };
    const fstring = JSON.stringify(filter);
    const rv = validators.queryResults(fstring);
    expect(rv)
      .toHaveProperty('platform', 'tiktok');
  });

});
*/