/*
 * in this file you'll find, BELOW, the functions exported
 * as 'routes' of express, they take as argument the expressApp.
 * ON TOP, the actual functions that operated with DB/web.
 */
const _ = require('lodash');
const debug = require('debug')('scheduled:http');

const webutils = require('../../utils/webutils');
const database = require('./database');
const validators = require('./validators');

async function queryScheduled(db, req, res) {
  const filter = validators.queryScheduled(req.params.filter);
  debug("Querying scheduled objects with filter %j", filter);
  return await database.queryScheduled(db, filter);
};

async function createScheduled(db, req, res) {

  const scheduled = validators.validateScheduled(req.body.scheduled);
  const results = await database.createScheduled(db, scheduled);
  debug(results);
  /* the return value is the same format as getScheduled in both non-error-case */
  return {
   results  
  };
}

function authenticationIsValid(body) {
  /* This is not exactly conform to the CISSP security standards: */
  return (body.auth === '³!A!STRING!³')
  /* but, look: TODO fix this thing with a proper mechanism¹

  ¹ after threat modeling and security assessment doc is produced */
}

/* BELOW, the routes as loaded by utils/express.js */
async function getScheduled(db, expressApp) {
  /* this API is invoked by the agent
   * This endpoint is queried by distributed agent
   * around the world, they look for target URLs
   * fitting their possibilities. normally a
   * default agent should query by using the
   * location as vantagePoint, but in future
   * versions, agents might for example query
   * because of specific platform (i.e. only
   * facebook and only check agent should run from
   * Italy). submissionId are duplicated in
   * this API because a submission is
   * requested to have a availabilityCheck more
   * than once and from more than one vantagePoint */
  expressApp.get('/scheduled/:filter', async (req, res) => {
    try {
      const f = _.partial(queryScheduled, db);
      const retval = await f(req, res);
      res.json(retval);
    } catch(error) {
      webutils.handleError(error, req, res, "queryScheduled");
    }
  });
}

async function postScheduled(db, expressApp) {
  /* The payload allow an admin (or someone with special
   * privileges) for force specific test, and controlling the
   * parameters such as timing, country requestes, targetURL,
   * timing (and implicitly also its the priority)
   * the `bin/orchestrator.mjs` is a tool that push information
   * here and basically orchestrate all the scheduled test */
  expressApp.post('/scheduled', async (req, res) => {
    try {
      if(!authenticationIsValid(req.body)) {
        debug("Authentication failed? (%s)", req.body.auth);
        res.status(401); // Unauthorized
        res.send("Authentication fail");
      } else {
        debug("Authentication is OK¹");
        const f = _.partial(createScheduled, db);
        const retval = await f(req, res);
        res.json(retval);
      }
    } catch(error) {
      webutils.handleError(error, req, res, "createScheduled");
    }
  });
}

module.exports = {
  routes: [ getScheduled, postScheduled ],
  queryScheduled,
  createScheduled,
}

debug("Configured %d routes", module.exports.routes.length);
