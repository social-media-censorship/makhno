/*
 * Parsing headquarters testing!
 * This load an arbitrary HTML that should contains the weird 
 * Pattern you want to test; Here we use JSOM and parse-curl, the
 * high level parsing file, is not loaded.
 */
const _ = require('lodash');
const { describe, expect, test } = require('@jest/globals');
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const JSDOM = require("jsdom").JSDOM;

const { apply } = require('../../utils/parsinghq');
const { simplify } = require('../../utils/parse-curl');

function produceYAMLparseInfo(platf, natur) {

  const fp = path.join('tests', 'gafam', 'curl', `${platf}-${natur}.yaml`);
  console.log(fp);
  const parsinfstr = fs.readFileSync(fp, 'utf-8');
  const parseinfos = yaml.parse(parsinfstr);
  /* because of YAML flexibilities better to simplify the 
   * list of object (logics) into a more accessible object */
  const logics = simplify(parseinfos.logics ?? []);
  delete parseinfos.logics;
  /* and this set the parser information */
  return {
    ...parseinfos,
    logics,
  };
}

describe('Simulate HTML parsing', () => {

  const mockhtml = path.join('tests', '_payloads', 'loremipsum.html');
  let dom = null;

  /* parse-curl.YAMLcache can be a complex structure if you
     just strted to work with this code */
  const mockYAMLcache = {
    'platformX': {
      'nature1': {
        ...produceYAMLparseInfo('platformX', 'nature1')
      },
      'nature2': {
        ...produceYAMLparseInfo('platformX', 'nature2')
      }
    },
    'platformY': {
      'nature1': {
        ...produceYAMLparseInfo('platformY', 'nature1')
      },
    }
  };

  test(`verify mockYAMLcache is complete`, () => {
    /* this function verify the mocked 
       parse-curl.loadParseYAML, 
       it uses a mocked version of Nature */
    expect(mockYAMLcache).toBe(true);
  });

  test(`verify loremipsum.html load as DOM`, () => {

    expect(dom).toBe(true);
  });

});
