const { describe, expect, test } = require('@jest/globals');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const http = require('../../src/gafam/http');
const { verifyConsistency } = require('../../utils/results');
const { validateNature } = require('../../src/submission/validators');

const urls = {
   // makhno/platforms$ grep example */*.yaml
  "tiktok/channel": "https://www.tiktok.com/@battlebots",
  "tiktok/video": "https://www.tiktok.com/@rtl.sport/video/7154111468428856582",
  "youtube/channel1": "https://www.youtube.com/c/%E4%BA%AC%E9%83%BD%E3%81%AF%E3%82%93%E3%81%AA%E3%82%8A%E3%83%81%E3%83%A3%E3%83%B3%E3%83%8D%E3%83%AB",
  "youtube/channel2": "https://www.youtube.com/user/dish",
  "youtube/channel3": "https://www.youtube.com/channel/UCBR8-60-B28hp2BmDPdntcQ",
  "youtube/shorts": "https://www.youtube.com/shorts/IX3nMJaUS-Q",
  "youtube/video-standard": "https://www.youtube.com/watch?v=n61ULEU7CO0",
  "youtube/video-urlshort": "https://youtu.be/n61ULEU7CO0",
};

describe('GAFAM querySupportedNatures', () => {
 
  test(`get API to load supported Natures`, () => {
    const supported = http.querySupportedNatures();
    const counts = _.countBy(supported, 'platform');
    expect(counts).toHaveProperty('youtube', 6);
    expect(counts).toHaveProperty('tiktok', 2);
  });

});

function mockRequestBody(urlKey, fName) {
  /* 
   - targetURL: string
   - source: string
   - countryCode: string
   - html: string
   */

  const htmlSource = path.join('tests', '_payloads', fName);
  const loadedHTML = fs.readFileSync(htmlSource, 'utf-8');
  return {
    body: {
      targetURL: urls[urlKey],
      source: 'curl',
      countryCode: 'IT',
      html: loadedHTML
    }
  } 
}

describe('GAFAM processHTML for "explicit"ly blocked content', () => {

  test(`submit "explicit"ly blocked youtube channel`, () => {
    const req = mockRequestBody("youtube/channel2", 'blockedYTChannel.html');
    const { determination } = http.processHTML(req, null);
    expect(determination).toBe('explicit');
  });
});

describe('GAFAM processHTML for "accessible" content', () => {

  test(`submit "accessible" youtube channel`, () => {
    const req = mockRequestBody("youtube/channel2", 'validYTChannel.html');
    const { determination } = http.processHTML(req, null);
    expect(determination).toBe('accessible');
  });
});

describe('GAFAM processHTML for "notfound" content', () => {

  test(`submit "notfound" youtube channel`, () => {
    const req = mockRequestBody("youtube/channel2", 'invalidYTChannel.html');
    const { determination } = http.processHTML(req, null);
    expect(determination).toBe('notfound');
  });
});

describe('GAFAM processHTML with errors', () => {

  test(`Submit an unsupported Nature`, () => {
    const req = {
      body: {
        targetURL: 'https://www.piripacchio.net/',
        source: null,
        countryCode: null,
        html: null
    } };
    expect(() => http.processHTML(req, null)).toThrow();
  });

  test(`Submit an unsupported Source`, () => {
    const req = {
      body: {
        targetURL: urls["tiktok/video"],
        source: 'wrong-one',
        countryCode: null,
        html: null
    } };
    expect(() => http.processHTML(req, null)).toThrow();
  });

  test(`Submit an invalid HTML`, () => {
    const req = {
      body: {
        targetURL: urls["tiktok/video"],
        source: 'curl',
        countryCode: null,
        html: "lorem ipsum salaminchia sarcazzo"
    } };
    expect(() => http.processHTML(req, null)).toThrow();
  });

});

describe('Off-limits cases', () => {
  test(`The 'ambiguous' determination`, () => {
    const judgment = verifyConsistency({
      explicit: true,
      accessible: true,
      notfound: true
    });
    expect(judgment).toBe('ambiguos');
  });
});