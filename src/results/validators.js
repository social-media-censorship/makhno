/*
 * This file is supposed to implement all the validators for the
 * object specified in ../openapi.yaml
 * an API might call one or more validators, if they spot an error
 * they raise an exeption */

const _ = require('lodash');
const moment = require('moment');
const debug = require('debug')('results:validators');
const gafam = require('../../utils/gafam');
const results = require('../../utils/results');

function queryResults(input) {
  /* this code is quite similar to submission.validators.querySubmission
   * but: 
   * 1) there are different parameters
   * 2) the day produces a start and end date 
   * 3) any error here is fatat, we don't want an error becoming a "read all"
   */
  const PARAMETERS = ['platform', 'countryCode', 'day', 'determination'];
  try {
    const p = JSON.parse(input);
    /* the only acceptable patterns at the moment is by platform, nature and countryCode */
    const retval = _.reduce(PARAMETERS, function(memo, valid) {
      if(valid === 'countryCode' && p[valid]?.length) {
        const ccl = _.toUpper(p[valid]);
        if(ccl.length !== 2)
          throw new Error(`Only two letter country code is acceptable (${ccl})`);

        _.set(memo, valid, ccl);
      }
      else if(valid === 'platform' && gafam.platformSupported(p[valid])) {
        _.set(memo, valid, p[valid]);
      }
      else if(valid === 'determination' && _.includes(results.determinationSupported, p[valid])) {
        _.set(memo, valid, p[valid]);
      }
      else if(valid === 'day' && p[valid]?.length) {
        /* in this validation process we rebuild the input and conver what is 
         * human-readalbe (like 'after') to the actual fields in mongodb */
        const day = p[valid];
        const check = moment(day).startOf('day');
        const end = moment(day).endOf('day');
        if(check.isValid === false)
          throw new Error(`Invalid Date from: [${day}]`);

        memo['testTime'] = { "$gte" : check.toISOString(), "$lte": end.toISOString() };
      }
      return memo;
    }, {});

    if(_.keys(p).length !== _.keys(retval).length)
      throw new Error(`Strict validation policy`);

    debug("Input %O validated as %O", p, retval);
    return retval;

  } catch(error) {
    throw new Error(`queryScheduled validation fail: ${error.message}`);
  }
}

function validateResults(results) {

  /* this only perform a check of the fields, but in theory it
   * can also verify if the submissionId represent something valid */
  const fields = [ 'iteration', 'testTime', 'countryCode',
    'platform', 'submissionId', 'testId', 'targetURL', 'status'];

  const accepted = _.reduce(results, function(memo, input) {
    const n = _.pick(input, fields);
    if(_.keys(n).length !== fields.length) {
      debug("Invalid result object! [%j] %d !== %d",
        _.keys(n), _.keys(n).length, fields.length);
    } else {
      memo.push(n);
    }
    return memo;
  }, []);
  debug("Validation of %d objects returns in %d accepted",
    results.length, accepted.length);

  return accepted;
}

module.exports = {
  queryResults,
  validateResults,
}
