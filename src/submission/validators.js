/*
 * This file is supposed to implement all the validators for the
 * object specified in ../openapi.yaml
 * an API might call one or more validators, if they spot an error
 * they raise an exeption */

const _ = require('lodash');
const gafam = require('../../utils/gafam');
const debug = require('debug')('submission:validators');

function querySubmission(input) {
  /* it is a string of encoded JSON */
  const PARAMETERS = ['platform', 'nature', 'countryCodes', 'after'];
  try {
    const p = JSON.parse(input);
    /* the only acceptable patterns at the moment is by platform, nature and countryCode */
    const retval = _.reduce(PARAMETERS, function(memo, valid) {
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
      else if(valid === 'after' && p[valid]?.length) {
        /* in this validation process we rebuild the input and conver what is 
         * human-readalbe (like 'after') to the actual fields in mongodb */
        const check = new Date(p[valid]);
        if(check.valueOf() === NaN)
          throw new Error(`Invalid Date from: [${p[valid]}]`);
        memo['creationTime'] = { "$gte" : check };
      }
      /* else, simply the plausible filter mechanism wasn't present in this request */
      return memo;
    }, {});
    if(JSON.stringify(retval).length < 3) {
      debug("The input has not any meaningful filtering meachnism so it should be invalid");
      throw new Error(`Missing a valid filter ${PARAMETERS}`);
    }
    debug("Input %O validated as %O", p, retval);
    return retval;
  } catch(error) {
    throw new Error(`querySubmission validation fail: ${error.message}`);
  }
}

function createSubmission(countryCodes, nature, marker) {
  /* this function merge the nature (returned from processURL)
   * and the submission input, to actually create a submission */
  nature.creationTime = new Date();
  nature.marker = marker;

  if(!countryCodes || countryCodes.length === 0) {
    debug("A submission without country codes to %s", nature.href);
    nature.countryCodes = [];
  } else {
    nature.countryCodes = countryCodes;
  }
  return nature;
}

const MARKER_MINIMUM_SIZE = 5;
function validateMarker(marker) {

  if(!(marker?.length >= MARKER_MINIMUM_SIZE)) {
    debug("submission marker needs to be > than 2 bytes (%s)", marker);
    throw new Error(`validateMarker fail: it should ${MARKER_MINIMUM_SIZE} chars or longer`);
  }

  return _.toLower(marker);
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

    debug('Nature of [%s] found as %s (%s)',
      nature.href, nature.platform, nature.nature);

    return nature
  } catch(error) {
    throw new Error(`validateNature fail: ${error.message}`);
  }
}

module.exports = {
  querySubmission,
  validateMarker,
  validateNature,
  createSubmission,
}
