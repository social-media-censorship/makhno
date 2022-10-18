/*
 * in this file you'll find, BELOW, the functions exported
 * as 'routes' of express, they take as argument the expressApp.
 * ON TOP, the actual functions that operated with DB/web.
 */
const _ = require('lodash');
const debug = require('debug')('gafam:http');
const webutils = require('../../utils/webutils');
const gafam = require('../../utils/gafam');
const { validateNature } = require('../submission/validators');
const { validateCURLhtml, parse } = require('../../utils/parse-curl');

function querySupportedNatures(req, res) {

  const { natures } = gafam.guaranteeLoading();

  const trimmed = _.map(natures, function(nature) {
    /* we only need three fields to explain what is supported */
    return _.pick(nature,
      ['platform', 'nature', 'example']);
  });

  debug("Returning %d supported natures (%j)",
    trimmed.length, _.countBy(trimmed, 'platform'));

  return trimmed;
}

function processHTML(req, res) {

  const { targetURL, source, countryCode, html } = req.body;

  const nature = validateNature(targetURL);
  if(source !== 'curl')
    throw new Error("This version only supports curl cold HTML");

  const validHTML = validateCURLhtml(html);
  const determination = parse(nature, validHTML);

  debug("parseHTML of %s from %j is %O",
    targetURL, countryCode, determination);

  return { determination };
}


/* BELOW, the routes as loaded by utils/express.js
  trivia: normally the wrapped function are async, bug
  gafam interactions do not need to access to DB or network
  so they are natively sync */
async function getSupportedGAFAM(db, expressApp) {
  expressApp.get('/gafam/supported', (req, res) => {
    try {
      const retval = querySupportedNatures(req, res);
      res.json(retval);
    } catch(error) {
      webutils.handleError(error,
        req, res, "getSupportedGAFAM");
    }
  });
}

async function postSupportedGAFAM(db, expressApp) {
  expressApp.post('/gafam/supported', (req, res) => {
    try {
      const nature = validateNature(req.body.url);
      res.json(nature);
    } catch(error) {
      webutils.handleError(error, req, res, "postSupportedGAFAM");
    }
  });
}

async function postParseGAFAMHTML(db, expressApp) {
  expressApp.post('/gafam/parse', async (req, res) => {
    try {
      const retval = processHTML(req, res);
      res.json(retval);
    } catch(error) {
      webutils.handleError(error, req, res, "parseHTML");
    }
  });
}

module.exports = {
  routes: [
    getSupportedGAFAM,
    postSupportedGAFAM,
    postParseGAFAMHTML
  ],
  querySupportedNatures,
  processHTML,
}

debug("Configured %d routes", module.exports.routes.length);
