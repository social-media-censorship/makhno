const _ = require('lodash');
const { describe, expect, test } = require('@jest/globals');
const fs = require('fs');

const parseCURL = require('../../utils/parse-curl');

describe('CURL parsing and related functions', () => {

  test(`Load existing parsing details`, () => {
    const parsedet = parseCURL.loadParseYAML('youtube', 'channel');
    console.log(parsedet);
  });

  test(`Parse a youtube channel (blocked)`, () => {
  });

  test(`Parse a youtube channel (accessible)`, () => {
  });

});

