const debug = require('debug')('utils:webutils');

function handleError(error, req, res, name) {
    /* this is the function invoked if any API 
     * trigger an exception, it is responsible
     * of handling a safe return value via HTTP */
    debug("Unhandled error in %s: %s", name, error.message);
    res.status(500);
    res.send(error.message);
}

module.exports = {
    handleError
}