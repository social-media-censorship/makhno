const _ = require('lodash');
const { describe, expect, test } = require('@jest/globals');
const database = require('../../utils/database');

describe('Mongo Database', () => {

  test(`Initialize a random DB`, async () => {
	
    const filter = { platform: 'youtube' };
    const fstring = JSON.stringify(filter);
    const rv = validators.querySubmission(fstring);
    expect(rv)
      .toHaveProperty('platform', 'youtube');
  });

  test(`Ensure the presence of the indexes`, async () => {
    const filter = { platform: 'tiktok' };
    const fstring = JSON.stringify(filter);
    const rv = validators.querySubmission(fstring);
    expect(rv)
      .toHaveProperty('platform', 'tiktok');
  });

  test(`Do some I/O`, async () => {
    const filter = { countryCodes: ["DE", "it", "Fr"] };
    const fstring = JSON.stringify(filter);
    const rv = validators.querySubmission(fstring);
    expect(rv)
      .toHaveProperty('countryCodes', ["DE", "IT", "FR"]);
  });
});

