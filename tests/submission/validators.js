const _ = require('lodash');
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
    const filter = { countryCodes: ["DE", "it", "Fr"] };
    const fstring = JSON.stringify(filter);
    const rv = validators.querySubmission(fstring);
    expect(rv)
      .toHaveProperty('countryCodes', ["DE", "IT", "FR"]);
  });

});


describe('validateNature format and return Nature', () => {

  test(`validateNature should fail on invalid URL`, () => {
    const invaURL = 'a random string that is not an URL';
    expect(() => validators.validateNature(invaURL)).toThrow();
  });

  test(`validateNature should not find a Nature for random.com`, () => {
    const randURL = 'https://www.random.com/stuff?with=params';
    expect(() => validators.validateNature(randURL)).toThrow();
  });
  
  test(`validateNature should return a Nature of a yt video`, () => {
    const ytvid = 'https://www.youtube.com/watch?v=theYTvideoID';
    const rv = validators.validateNature(ytvid);
    expect(rv).toHaveProperty('platform', 'youtube');
    expect(rv).toHaveProperty('nature', 'video');
  });

  test(`validateNature should return a Nature for three kinds of yt profile`, () => {
    const channels = [ 'https://www.youtube.com/c/something',
                       'https://www.youtube.com/user/something',
                       'https://www.youtube.com/channel/something' ];
    _.each(channels, function(churl) {
        const rv = validators.validateNature(churl);
        expect(rv).toHaveProperty('platform', 'youtube');
        expect(rv).toHaveProperty('nature', 'profile');
        expect(rv).toHaveProperty('details.channel', 'something');
    })
  });

  test(`validateNature should return a Nature of tiktok video`, () => {

  });

  test(`validateNature should return a Nature of tiktok profile`, () => {

  });

})