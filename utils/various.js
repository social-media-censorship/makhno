const crypto = require('crypto');
const debug = require('debug')('utils:computeId');

function computeId(inputstr) {
    debug("%s", inputstr);
    const sha1sum = crypto.createHash('sha1');
    sha1sum.update(inputstr);
    const id = sha1sum.digest('hex');
    return id;
}

module.exports = {
    computeId
}
