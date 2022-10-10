const { describe, expect, test } = require('@jest/globals');
const validators = require('../../utils/validators');

describe('querySubmission input validator', () => {

  test(`validate by platform (youtube)`, () => {
    const filter = { platform: 'youtube' };
    const fstring = JSON.stringify(filter);
    const rv = validators.querySubmission(fstring);
    expect(rv)
      .toHaveProperty('platform', 'youtube');
  });

  test(`validate by country code (DE,it,Fr)`, () => {
    const filter = { countryCode: ["DE", "it", "Fr"] };
    const fstring = JSON.stringify(filter);
    const rv = validators.querySubmission(fstring);
    expect(rv)
      .toHaveProperty('countryCode', ["DE", "IT", "FR"]);
  });

});