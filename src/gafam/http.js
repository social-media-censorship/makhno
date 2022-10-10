const debug = require('debug')('gafam:http');

async function getSubmission(db, expressApp) {
  expressApp.get('/submission/:filter', async (req, res) => {
    debug("Queries submission with %s", req.params.filter);
    debug("and btw the db is", db);
    res.send({ xxx: true });
  });
}

async function postSubmission(db, expressApp) {
  expressApp.post('/submission/', async (req, res) => {
    debug("Received a new submission with %O", req.body);
    debug("and btw the db is", db);
    res.send({ xxx: false });
  });
}

module.exports = {
   routes: [ parseURL, ]
}

debug("Configured %d routes", module.exports.routes.length);
