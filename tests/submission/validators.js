const _ = require('lodash');
const { describe, expect, test } = require('@jest/globals');
const validators = require('../../src/submission/validators');

describe('querySubmission input validator', () => {

  test(`validate by platform (youtube)`, () => {
    const filter = { platform: 'youtube' };
    const fstring = JSON.stringify(filter);
    const rv = validators.querySubmission(fstring);
    expect(rv)
      .toHaveProperty('platform', 'youtube');
  });

  test(`validate by platform (tiktok)`, () => {
    const filter = { platform: 'tiktok' };
    const fstring = JSON.stringify(filter);
    const rv = validators.querySubmission(fstring);
    expect(rv)
      .toHaveProperty('platform', 'tiktok');
  });

  test(`validate by country code (DE,it,Fr)`, () => {
    const filter = { countryCodes: ["DE", "it", "Fr"] };
    const fstring = JSON.stringify(filter);
    const rv = validators.querySubmission(fstring);
    expect(rv)
      .toHaveProperty('countryCodes', ["DE", "IT", "FR"]);
  });
});

describe('createSubmission validator', () => {

  test(`all the fields should be in place`, () => {
    const ytvid = 'https://www.youtube.com/watch?v=theYTvideoID';
    const nature = validators.validateNature(ytvid);

    const x = validators
      .createSubmission(["AB"], nature, "the marker");

    expect(x).toHaveProperty('creationTime');
    expect(x).toHaveProperty('countryCodes');
    expect(x.countryCodes).toHaveLength(1);
    expect(x).toHaveProperty('marker', "the marker");

    const y = validators
      .createSubmission([], nature, "the marker");
    expect(y.countryCodes.length).toBe(0);

  });

});

describe('Marker validation', () => {

  test(`marker can't work if smaller than 5 chars`, () => {
    expect(() => validators.validateMarker("smol")).toThrow();
  });

  test(`marker should become lowercase`, () => {
    const x = validators.validateMarker("MarkerX");
    expect(x).toBe("markerx");
  });

});

describe('validateNature format and return Nature', () => {

  test(`should fail on invalid URL`, () => {
    const invaURL = 'a random string that is not an URL';
    expect(() => validators.validateNature(invaURL)).toThrow();
  });

  test(`should not find a Nature for random.com`, () => {
    const randURL = 'https://www.random.com/stuff?with=params';
    expect(() => validators.validateNature(randURL)).toThrow();
  });
  
  test(`should return Nature of a standard yt video`, () => {
    const ytvid = 'https://www.youtube.com/watch?v=theYTvideoID';
    const rv = validators.validateNature(ytvid);
    expect(rv).toHaveProperty('platform', 'youtube');
    expect(rv).toHaveProperty('nature', 'video');
    expect(rv).toHaveProperty('details.videoId', 'theYTvideoID');
  });

  test(`should return Nature of a yt video URL-shortened`, () => {
    const ytvid = 'https://youtu.be/n61ULEU7CO0';
    const rv = validators.validateNature(ytvid);
    expect(rv).toHaveProperty('platform', 'youtube');
    expect(rv).toHaveProperty('nature', 'video');
    expect(rv).toHaveProperty('details.videoId', 'n61ULEU7CO0');
  });

  test(`should return Nature of a shorts yt video`, () => {
    const ytvid = 'https://www.youtube.com/shorts/IX3nMJaUS-Q';
    const rv = validators.validateNature(ytvid);
    expect(rv).toHaveProperty('platform', 'youtube');
    expect(rv).toHaveProperty('nature', 'video');
    expect(rv).toHaveProperty('details.videoId', 'IX3nMJaUS-Q');
  });

  test(`should return a Nature for three kinds of yt profile`, () => {
    const channels = [ 'https://www.youtube.com/c/something',
                       'https://www.youtube.com/user/something',
                       'https://www.youtube.com/channel/something' ];
    _.each(channels, function(churl) {
        const rv = validators.validateNature(churl);
        expect(rv).toHaveProperty('platform', 'youtube');
        expect(rv).toHaveProperty('nature', 'channel');
        expect(rv).toHaveProperty('details.channel', 'something');
    });

  });

  test(`validateNature should return a Nature of tiktok video`, () => {
    const tkvid = 'https://www.tiktok.com/@rtl.sport/video/7154111468428856582';
    const rv = validators.validateNature(tkvid);
    expect(rv).toHaveProperty('platform', 'tiktok');
    expect(rv).toHaveProperty('nature', 'video');
    expect(rv).toHaveProperty('details.videoId', '7154111468428856582');
    expect(rv).toHaveProperty('details.channel', '@rtl.sport');
  });

  test(`validateNature should return a Nature of tiktok profile`, () => {
    const tkprof = 'https://www.tiktok.com/@battlebots';
    const rv = validators.validateNature(tkprof);
    expect(rv).toHaveProperty('platform', 'tiktok');
    expect(rv).toHaveProperty('nature', 'channel');
    expect(rv).toHaveProperty('details.channel', '@battlebots');
  });

})