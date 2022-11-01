/*
 * This file is supposed to implement all the validators for the
 * object specified in ../openapi.yaml
 * an API might call one or more validators, if they spot an error
 * they raise an exeption */

const _ = require('lodash');
const gafam = require('../../utils/gafam');
const debug = require('debug')('scheduled:validators');

function queryScheduled(input) {
  /* this code is quite similar to submission.validators.querySubmission
   * but there are different parameters and also it is possible to don't use 
   * any filter */
  const PARAMETERS = ['platform', 'countryCode', 'after'];
  try {
    const p = JSON.parse(input);
    /* the only acceptable patterns at the moment is by platform, nature and countryCode */
    const retval = _.reduce(PARAMETERS, function(memo, valid) {
      if(valid === 'countryCode' && p[valid]?.length) {
        const ccl = _.toUpper(p[valid]).split(',');
        _.set(memo, valid, ccl);
      }
      else if(valid === 'platform' && gafam.platformSupported(p[valid])) {
        _.set(memo, valid, p[valid]);
      }
      else if(valid === 'after' && p[valid]?.length) {
        /* in this validation process we rebuild the input and conver what is 
         * human-readalbe (like 'after') to the actual fields in mongodb */
        const check = new Date(p[valid]);
        if(check.valueOf() === NaN)
          throw new Error(`Invalid Date from: [${p[valid]}]`);
        memo['testTime'] = { "$gte" : check };
      }
      return memo;
    }, {});
    debug("Input %O validated as %O", p, retval);
    return retval;
  } catch(error) {
    throw new Error(`queryScheduled validation fail: ${error.message}`);
  }
}

function validateScheduled(scheduled) {

  /* this only perform a check of the fields, but in theory it
   * can also verify if the submissionId represent something valid */
  const fields = ['iteration', 'testTime', 'vantagePoint',
    'platform', 'submissionId', 'testId', 'targetURL' ];

  const accepted = _.reduce(scheduled, function(memo, input) {
    const n = _.pick(input, fields);
    if(_.keys(n).length !== fields.length) {
      debug("Invalid scheduled object! missing fields in: %j", input);
    } else {
      memo.push(n);
    }
    return memo;
  }, []);
  debug("Validation of %d objects returns in %d accepted",
    scheduled.length, accepted.length);

  return accepted;
}

module.exports = {
  queryScheduled,
  validateScheduled,
}
