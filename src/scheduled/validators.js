/*
 * This file is supposed to implement all the validators for the
 * object specified in ../openapi.yaml
 * an API might call one or more validators, if they spot an error
 * they raise an exeption */

const _ = require('lodash');
const gafam = require('../../utils/gafam');
const debug = require('debug')('scheduled:validators');

function queryScheduled(input) {
  try {
    const p = JSON.parse(input);
    debug("Input %O validated with no judgment", p);
    return p;
  } catch(error) {
    throw new Error(`queryScheduled validation fail: ${error.message}`);
  }
}

function createScheduled(countryCodes, nature) {
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

module.exports = {
  queryScheduled,
  createScheduled,
}
