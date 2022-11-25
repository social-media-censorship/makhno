/* this file contains function useful for a few
 * of the bin/*.mjs scripts */

const debug = require('debug')('utils:cli');
const _ = require('lodash');

async function report(retval, msg) {

  if(retval.status > 300) {
    /* in this case we are in a 4XX 5XX error */
    const errorMessage = await retval.text();
    debug("Error (%d): %s: %s", retval.status, msg, errorMessage);
    return { error: true, message: errorMessage };
  }

  const r = await retval.json();
  if(JSON.stringify(r).length > 2) {
    debug("(%d) %s: %d bytes (keys: %d, %s)", retval.status, msg,
      JSON.stringify(r).length, _.keys(r).length, typeof r);
    return r;
  } else
    debug("Empty answer, HTTP status code: %d", retval.status);
    return null;
}

module.exports = {
  report
}
