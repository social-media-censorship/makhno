/*
 * This file is supposed to implement all the validators for the
 * object specified in ../openapi.yaml
 * an API might call one or more validators, if they spot an error
 * they raise an exeption */

const _ = require('lodash');
const gafam = require('../../utils/gafam');
const debug = require('debug')('utils:validators');

function querySubmission(input) {
  /* it is a string of encoded JSON */
  try {
    const p = JSON.parse(input);
    /* the only acceptable patterns at the moment is by platform, nature and countryCode */
    const retval = _.reduce(['platform', 'nature', 'countryCodes'], function(memo, valid) {
      if(valid === 'countryCodes' && p[valid]?.length) {
        const ccl = _.toUpper(p[valid]).split(',');
        _.set(memo, valid, ccl);
      }
      else if(valid === 'nature' && gafam.natureSupported(p[valid])) {
        _.set(memo, valid, p[valid]);
      }
      else if(valid === 'platform' && gafam.platformSupported(p[valid])) {
        _.set(memo, valid, p[valid]);
      }
      /* else, simply the plausible filter mechanism wasn't present in this request */
      return memo;
    }, {});
    debug("Input %O validated as %O", p, retval);
    return retval;
  } catch(error) {
    throw new Error(`querySubmission validation fail: ${error.message}`);
  }
}

function createSubmission(countryCodes, nature) {
  /* this function merge the nature (returned from processURL)
   * and the submission input, to actually create a submission */
  nature.creationTime = new Date();

  if(!countryCodes || countryCodes.length === 0) {
    debug("A submission without country codes to %s", nature.href);
    nature.countryCodes = [];
  } else {
    nature.countryCodes = countryCodes;
  }
  return nature;
}

function validateNature(input) {
  /* this function uses gafam library to validate the URL and 
   * attribute a nature out of it. It returns two properties
   * because the input URL might have been changed in this process */
  if(!_.startsWith(input, 'http'))
    input = `https://${input}`;

  try {
    const urlo = new URL(input);
    const nature = gafam.findNature(urlo);

    if(!nature)
      throw new Error(`Makhno do not currently support this url [${input}]`);

    debug('Nature of [%s] foundas %s (%s)',
      nature.href, nature.platform, nature.nature);

    return nature
  } catch(error) {
    throw new Error(`validateNature fail: ${error.message}`);
  }
}

module.exports = {
  querySubmission,
  validateNature,
  createSubmission,
}
