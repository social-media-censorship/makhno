/*
 * in these files you'll find, BELOW, the functions exported 
 * as 'routes' of express, they take as argument the expressApp.
 * ON TOP, the actual functions that operated with DB/web.
 */

const debug = require('debug')('submission:http');
const webutils = require('../../utils/webutils');
const database = require('../../utils/database');
const validator = require('../../validator');
const _ = require('lodash');

async function querySubmission(db, req, res) {
  /* This is the endpoint that manages a collection of 
   * objects into the database; It returns the list of 
   * targetURL that match the criterias specify by the 
   * agent, it can also return a default if not filtering is 
   * provided; it is worthy to list existing requested URL 
   * and identify their presence in the infrastructure. 
   * the id mentioned here is also referred as submissionId 
   * in other endpoints. */
  console.log(db, req, res);

  debug("Queries submission with %s", req.params.filter);
  debug("and btw the db is", db);

  const filter = validator.querySubmission(req.params.filter);
  const retval = await database.querySubmission(db, filter);
  return retval;

  /* [{
    "url": {
      "platform": "string",
      "nature": "string",
      "details": {},
      "supported": true,
      "id": "string"
    },
    "countryCodes": [
      "string"
    ]
  }] */

};

async function createSubmission(db, req, res) {
  console.log(db, req, res);
  debug("create Submission with %s", req.body);
  debug("and btw the db is", db);
  return { xxx: true };
}

async function getSubmission(db, expressApp) {
  expressApp.get('/submission/:filter', async (req, res) => {
    try {
      const retval = await _.partial(querySubmission, db);
      res.json(retval);
    } catch(error) {
      webutils.handeError(error, req, res, "querySubmission");
    }
  });
}

async function postSubmission(db, expressApp) {
  expressApp.post('/submission/', async (req, res) => {
    try {
      const retval = await _.partial(createSubmission, db);
      res.json(retval);
    } catch(error) {
      webutils.handeError(error, req, res, "createSubmission");
    }
  });
}

module.exports = {
  routes: [ getSubmission, postSubmission ],
  querySubmission,
  createSubmission,
}

debug("Configured %d routes", module.exports.routes.length);
