/*
 * This file is supposed to implement all the validators for the
 * object specified in ../openapi.yaml
 * an API might call one or more validators, if they spot an error
 * they raise an exeption */

const _ = require('lodash');
const moment = require('moment');
const gafam = require('../../utils/gafam');
const debug = require('debug')('scheduled:validators');

function queryScheduled(input) {
  /* this code is quite similar to submission.validators.querySubmission
   * but there are different parameters and also it is possible to don't use 
   * any filter -- also, it produce a JSON but the database access 
   * uses an aggregation query, so there are intermediary steps */
  const PARAMETERS = ['platform', 'countryCode', 'day', 'marker'];
  try {
    const p = JSON.parse(input);
    /* the only acceptable patterns at the moment is by platform, nature and countryCode */
    const retval = _.reduce(PARAMETERS, function(memo, valid) {
      if(valid === 'countryCode' && p[valid]?.length) {
        const ccl = _.toUpper(p[valid]);
        // TODO it miss the actual validation
        _.set(memo, valid, ccl);
      }
      else if(valid === 'platform' && gafam.platformSupported(p[valid])) {
        _.set(memo, valid, p[valid]);
      }
      else if(valid === 'day' && p[valid]?.length) {
        /* in this validation process we rebuild the input and conver what is 
         * human-readalbe (like 'day') to the actual fields in mongodb,
         * but it is not a standard need and currently isn't tested */
        const check = new Date(p[valid]);
        if(check.valueOf() === NaN)
          throw new Error(`Invalid Date from: [${p[valid]}]`);
        memo['testTime'] = { "$gte" : check };
      }
      else if(valid === 'marker' && p[valid]?.length >= 5) {
        _.set(memo, valid, p[valid]);
      }
      return memo;
    }, {});

    debug("Input %O validated as %O", p, retval);

    if(!retval.testTime) {
      /* this should happen nearly everytime, 'day' is unusual option */
      retval.testTime = {
        "$gte": new Date(moment().startOf('day').toISOString()),
        "$lte": new Date(moment().endOf('day').toISOString())
      }
    } else {
      // remind self this is not tested/connected to curl.mjs
      debug("Unusual time request for a scheduled object! (%O)", retval.testTime);
    }

    return retval;
  } catch(error) {
    throw new Error(`queryScheduled validation fail: ${error.message}`);
  }
}

function validateScheduled(scheduled) {

  /* this only perform check on the fields presence,
   * the validity of the submissionId (should be|is) checked
   * with a dedicated async function */
  const fields = ['iteration', 'testTime', 'vantagePoint',
    'submissionId', 'testId' ];

  const accepted = _.reduce(scheduled, function(memo, input) {
    const n = _.pick(input, fields);
    if(_.keys(n).length !== fields.length) {
      debug("Invalid scheduled object! missing fields in: %s EXPECTED %s",
        JSON.stringify(input, null, 2), fields);
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
