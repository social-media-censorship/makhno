const crypto = require('crypto');

function computeId(inputstr) {
    const sha1sum = crypto.createHash('sha1');
    sha1sum.update(inputstr);
    const id = sha1sum.digest('hex');
    return id;
}

module.exports = {
    computeId
}
