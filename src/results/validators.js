/*
 * This file is supposed to implement all the validators for the
 * object specified in ../openapi.yaml
 * an API might call one or more validators, if they spot an error
 * they raise an exeption */

const _ = require('lodash');
const debug = require('debug')('results:validators');

function queryResults(input) {
  /* this code is quite similar to submission.validators.querySubmission
   * but there are different parameters and also it is possible to don't use 
   * any filter */
  try {
    const p = JSON.parse(input);
    /* the only acceptable patterns at the moment is by platform, nature and countryCode */
    debug("Input not really validated yet as %O", p);
    return retval;
  } catch(error) {
    throw new Error(`queryResults validation fail: ${error.message}`);
  }
}

function validateResults(results) {

  /* this only perform a check of the fields, but in theory it
   * can also verify if the submissionId represent something valid */
  const fields = [ 'iteration', 'testTime', 'vantagePoint',
    'platform', 'submissionId', 'testId', 'targetURL' ];

  const accepted = _.reduce(results, function(memo, input) {
    const n = _.pick(input, fields);
    if(_.keys(n).length !== fields.length) {
      debug("Invalid scheduled object! missing fields in: %j", input);
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
