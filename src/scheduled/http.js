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

  debug("queryScheuled db %j", db)
  const filter = validators.queryScheduled(req.params.filter);
  debug("queryScheduled filter %j", filter)
  const retval = await database.queryScheduled(db, filter);
  debug("querySchedule %j", retval);

  return retval;
};

async function createScheduled(db, req, res) {

  /* 1) validate date
     2) insert data */

  const scheduled = validators.validateScheduled(req.body);
  debug('Ready to add %s %s (%s)', scheduled.platform, scheduled.nature, scheduled.id);
  const inserted = await database.createScheduled(db, scheduled);
  if(inserted === false) {
    debug("Not inserted (already present in DB)");
    /* it returns null only when is duplicated */
    res.status(202);
  }
  /* the return value is the same format as getScheduled in both non-error-case */
  return {
    scheduled
  };
}

function authenticationIsValid(body) {
  console.log("TODO implement authenticationIsValid :P");
  console.log(_.keys(body));
  return true;
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
  expressApp.post('/scheduled/', async (req, res) => {
    try {
      if(!authenticationIsValid(req.body)) {
        res.status(401) // Unauthorized
      } else {
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
