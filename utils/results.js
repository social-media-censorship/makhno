const debug = require('debug')('utils:results');

function verifyConsistency(triplet) {
  /* it is a triplet as the kind of HTML judgment implemented
   * at the moment are three: not found page, blocked explicitly, 
   * and available. but are we sure all the parser return a
   * consistent assesment, and not, for example, all the test returns
   * true? this function look at it and print a debug line if unexpecred */

  if(triplet.accessible && !triplet.notfound && !triplet.explicit) {
    return "accessible";
  } else if(!triplet.accessible && triplet.notfound && triplet.explicit) {
    return "notfound";
  } else if(!triplet.accessible && !triplet.notfound && triplet.explicit) {
    return "explicit";
  } else {
    debug("Ambiguos result from: %O", triplet);
    return "ambiguos";
  }
}

const determinationSupported = [
  'accessible', // content has been found
  'notfound',   // content was not found
  'explicit',   // content was explicitly taken down
  'ambiguous',  // something not clear that needs further analysis
];

module.exports = {
  verifyConsistency,
  determinationSupported,
}
