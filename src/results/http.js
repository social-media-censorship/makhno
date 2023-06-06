/*
 * in this file you'll find, BELOW, the functions exported
 * as 'routes' of express, they take as argument the expressApp.
 * ON TOP, the actual functions that operated with DB/web.
 */

const _ = require('lodash');
const debug = require('debug')('results:http');

const database = require('./database');
const validators = require('./validators');

const webutils = require('../../utils/webutils');

async function queryResults(db, req, res) {

  const filter = validators.queryResults(req.params.filter);
  const retval = await database.queryResults(db, filter);
  return retval;
};

async function createResults(db, req, res) {
  const results = validators.validateResults(req.body);

  const inserted = await database.createResults(db, results);
  return {
    inserted
  };
}

/* BELOW, the routes as loaded by utils/express.js */
async function getResults(db, expressApp) {
  expressApp.get('/results/:filter', async (req, res) => {
    try {
      const f = _.partial(queryResults, db);
      const retval = await f(req, res);
      res.json(retval);
    } catch(error) {
      webutils.handleError(error, req, res, "queryResults");
    }
  });
}

async function postResults(db, expressApp) {
  expressApp.post('/results/', async (req, res) => {
    try {
      const f = _.partial(createResults, db);
      const retval = await f(req, res);
      res.json(retval);
    } catch(error) {
      webutils.handleError(error, req, res, "createResults");
    }
  });
}

module.exports = {
  routes: [ getResults, postResults ],
  queryResults,
  createResults,
}

debug("Configured %d routes", module.exports.routes.length);
