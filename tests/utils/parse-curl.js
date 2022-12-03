const _ = require('lodash');
const { describe, expect, test } = require('@jest/globals');
const fs = require('fs');
const path = require('path');

const parseCURL = require('../../utils/parse-curl');
const { apply } = require('../../utils/parsinghq');

describe('CURL HTML parsing (youtube)', () => {

  let parsedet = null;
  /* this would be used also in the tests below */

  test(`Load existing parsing details for youtube+channel`, () => {
    parsedet = parseCURL.loadParseYAML('youtube', 'channel');
    /* test the basic features */
    expect(parsedet).toHaveProperty('platform', 'youtube');
    expect(parsedet).toHaveProperty('nature', 'channel');

    /* this conversion from Array to Object is made by utils/parse-curl.simplify */
    expect(parsedet.logics).toBeInstanceOf(Object);

    /* this because every YAML file need to have these three */
    expect(parsedet.logics).toHaveProperty('notfound');
    expect(parsedet.logics).toHaveProperty('accessible');
    expect(parsedet.logics).toHaveProperty('explicit');
  });

  /* note explicit means "explicitly taken down by Youtube", nothing
   * to do with explicit content because you need to be 18+ */
  const files = {
    notfound: 'invalidYTChannel.html',
    accessible: 'validYTChannel.html',
    explicit: 'blockedYTChannel.html',
  };
  /* as well as payloads, used in the test below */
  const payloads = {};

  test(`We can load youtube channel fixtures ${files.length}`, () => {
    const payloadsDir = path.join('tests', '_payloads');
    _.each(files, function(file, meaning) {
      const filepath = path.join(payloadsDir, file);
      const html = fs.readFileSync(filepath, 'utf-8');
      expect(html?.length).toBeGreaterThan(1);
      const htmlo = parseCURL.validateCURLhtml(html);
      expect(htmlo).toHaveProperty('document');
      expect(htmlo).toHaveProperty('raw');
      payloads[meaning] = htmlo;
    })
  });

  test(`Parse a youtube channel (explicit)`, () => {
    const expected = apply(parsedet.logics.explicit, payloads.explicit);
    expect(expected).toBe(true);
    const notok1 = apply(parsedet.logics.accessible, payloads.explicit);
    expect(notok1).toBe(false);
    const notok2 = apply(parsedet.logics.notfound, payloads.explicit);
    expect(notok2).toBe(false);
  });

  test(`Parse a youtube channel (notfound)`, () => {
    const expected = apply(parsedet.logics.notfound, payloads.notfound);
    expect(expected).toBe(true);
    const overlap = apply(parsedet.logics.explicit, payloads.notfound);
    expect(overlap).toBe(true);
    const notok1 = apply(parsedet.logics.accessible, payloads.notfound);
    expect(notok1).toBe(false);
  });

  test(`Parse a youtube channel (accessible)`, () => {
    const expected = apply(parsedet.logics.accessible, payloads.accessible);
    expect(expected).toBe(true);
    const notok1 = apply(parsedet.logics.explicit, payloads.accessible);
    expect(notok1).toBe(false);
    const notok2 = apply(parsedet.logics.notfound, payloads.accessible);
    expect(notok2).toBe(false);
  });

});

describe('CURL HTML parsing (tiktok)', () => {

  let parsedet = null;
  /* this would be used also in the tests below */

  test(`Load existing parsing details for tiktok+video`, () => {
    parsedet = parseCURL.loadParseYAML('tiktok', 'video');
    /* test the basic features */
    expect(parsedet).toHaveProperty('platform', 'tiktok');
    expect(parsedet).toHaveProperty('nature', 'video');

    /* this conversion from Array to Object is made by utils/parse-curl.simplify */
    expect(parsedet.logics).toBeInstanceOf(Object);

    /* this because every YAML file need to have these three */
    expect(parsedet.logics).toHaveProperty('notfound');
    expect(parsedet.logics).toHaveProperty('accessible');
    expect(parsedet.logics).toHaveProperty('explicit');
  });

  /* in tiktok case we don't have an "explicitly taken down by TikTok",
   * so we have only notfound and accessible */
  const files = {
    notfound: 'invalidTKvideo.html',
    accessible: 'validTKvideo.html',
  };
  /* as well as payloads, used in the test below */
  const payloads = {};

  test(`We can load tiktok video fixtures ${files.length}`, () => {
    const payloadsDir = path.join('tests', '_payloads');
    _.each(files, function(file, meaning) {
      const filepath = path.join(payloadsDir, file);
      const html = fs.readFileSync(filepath, 'utf-8');
      expect(html?.length).toBeGreaterThan(1);
      const htmlo = parseCURL.validateCURLhtml(html);
      expect(htmlo).toHaveProperty('document');
      expect(htmlo).toHaveProperty('raw');
      payloads[meaning] = htmlo;
    })
  });

  test(`Parse a tiktok video (notfound)`, () => {
    const expected = apply(parsedet.logics.notfound, payloads.notfound);
    expect(expected).toBe(true);
    const overlap = apply(parsedet.logics.explicit, payloads.notfound);
    expect(overlap).toBe(true);
    const notok1 = apply(parsedet.logics.accessible, payloads.notfound);
    expect(notok1).toBe(false);
  });

  test(`Parse a tiktok video (accessible)`, () => {
    const expected = apply(parsedet.logics.accessible, payloads.accessible);
    expect(expected).toBe(true);
    const notok1 = apply(parsedet.logics.explicit, payloads.accessible);
    expect(notok1).toBe(false);
    const notok2 = apply(parsedet.logics.notfound, payloads.accessible);
    expect(notok2).toBe(false);
  });

});