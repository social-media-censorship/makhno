const debug = require('debug')('utils:results');

function verifyConsistency(triplet) {
  /* it is a triplet as the kind of HTML judgment implemented
   * at the moment are three: not found page, blocked explicitly, 
   * and available. but are we sure all the parser return a
   * consistent assesment, and not, for example, all the test returns
   * true? this function look at it and print a debug line if unexpecred */
  debug("validating: %O", triplet);
}

module.exports = {
  verifyConsistency
}
