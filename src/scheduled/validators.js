/*
 * This file is supposed to implement all the validators for the
 * object specified in ../openapi.yaml
 * an API might call one or more validators, if they spot an error
 * they raise an exeption */

const _ = require('lodash');
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

function validateScheduled(scheduled) {
  debug("I should validate %d object", scheduled.length);
  return scheduled ?? [];

}

module.exports = {
  queryScheduled,
  validateScheduled,
}
