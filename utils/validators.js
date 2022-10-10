/*
 * This file is supposed to implement all the validators for the
 * object specified in ../openapi.yaml
 * an API might call one or more validators, if they spot an error
 * they raise an exeption */

const _ = require('lodash');
const { platformSupported, natureSupported } = require('./gafam');
const debug = require('debug')('utils:validators');

function querySubmission(input) {
  /* it is a string of encoded JSON */
  try {
    const p = JSON.parse(input);
    /* the only acceptable patterns at the moment is by platform, nature and countryCode */
    const retval = _.reduce(['platform', 'nature', 'countryCode'], function(memo, valid) {
      if(valid === 'countryCode') {
        const ccl = _.toUpper(p[valid]).split(',');
        _.set(memo, valid, ccl);
      }
      else if(valid === 'nature' && natureSupported(p[valid])) {
        _.set(memo, valid, p[valid]);
      }
      else if(valid === 'platform' && platformSupported(p[valid])) {
        _.set(memo, valid, p[valid]);
      }
      /* else, simply the plausible filter mechanism wasn't present in this request */
      return memo;
    }, {});
    debug("input %O validated as %O", p, retval);
    return retval;
  } catch(error) {
    throw new Error(`querySubmission validation fail: ${error.message}`);
  }
}

function createSubmission(input, nature) {
  /* this function merge the nature (returned from processURL)
   * and the submission input, to actually create a submission */
}

function processURL(input) {
  /* this function uses gafam library to validate the URL and 
   * attribute a nature out of it */
}

module.exports = {
  querySubmission,
  processURL,
  createSubmission,
}
