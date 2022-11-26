/*
 * in this file you'll find, BELOW, the functions exported
 * as 'routes' of express, they take as argument the expressApp.
 * ON TOP, the actual functions that operated with DB/web.
 */

const _ = require('lodash');
const debug = require('debug')('submission:http');

const database = require('./database');
const validators = require('./validators');

const webutils = require('../../utils/webutils');

async function querySubmission(db, req, res) {
  /* This is the endpoint that manages a collection of 
   * objects into the database; It returns the list of 
   * targetURL that match the criterias specify by the 
   * agent, it can also return a default if not filtering is 
   * provided; it is worthy to list existing requested URL 
   * and identify their presence in the infrastructure. 
   * the id mentioned here is also referred as submissionId 
   * in other endpoints. */

  const filter = validators.querySubmission(req.params.filter);
  /* The validator parse JSON and validate it's fields,
     The database function pick these fields for the right DB driver */
  const retval = await database.querySubmission(db, filter);

  /* it should have the format [{
    "url": {
      "platform": "string",
      "nature": "string",
      "details": {},
      "supported": true,
      "id": "string"
    },
    "countryCodes": [
      "string"
    ]                          }] */
  return retval;
};

async function createSubmission(db, req, res) {
  /* The payload contains a `targetURL` and one or more country 
   * code, in the hopes some `agent` that runs in the right ISP,
   * would pull this submission and perform an `availabilityCheck` 
   * from their `vantagePoint`. The `target URL` is validated 
   * in the same way as in the /GAFAM/ endpoints. */

  /* body should have this format
   * { "url": "string", "countryCodes": [ "string" ], "marker": "string" } */
  const nature = validators.validateNature(req.body.url);

  const marker = validators.validateMarker(req.body.marker);

  /* This API has potentially three HTTP return values:
   * duplicated (handled below),
   * inserted (default),
   * error (default error handler; any validator can throw */
  const submission = validators.createSubmission(
    req.body?.countryCodes, nature, marker);

  debug('Ready to add %s %s [%s] [%s]', submission.platform, submission.nature,
    submission.marker, submission.id);

  const inserted = await database.createSubmission(db, submission);
  if(inserted === false) {
    debug("Not inserted (already present in DB)");
    /* it returns null only when is duplicated */
    res.status(202);
  }
  /* the return value is the same format as getSubmission in both non-error-case */
  return {
    submission
  };
}

/* BELOW, the routes as loaded by utils/express.js */
async function getSubmission(db, expressApp) {
  expressApp.get('/submission/:filter', async (req, res) => {
    try {
      const f = _.partial(querySubmission, db);
      const retval = await f(req, res);
      res.json(retval);
    } catch(error) {
      webutils.handleError(error, req, res, "querySubmission");
    }
  });
}

async function postSubmission(db, expressApp) {
  expressApp.post('/submission/', async (req, res) => {
    try {
      const f = _.partial(createSubmission, db);
      const retval = await f(req, res);
      res.json(retval);
    } catch(error) {
      webutils.handleError(error, req, res, "createSubmission");
    }
  });
}

module.exports = {
  routes: [ getSubmission, postSubmission ],
  querySubmission,
  createSubmission,
}

debug("Configured %d routes", module.exports.routes.length);
