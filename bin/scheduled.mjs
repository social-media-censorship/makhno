#!node_modules/.bin/zx

import logger from 'debug';
const debug = logger('bin:scheduled');

const httpSettings = require('../config/http.json').scheduled;
debug("Loaded HTTP settings %O", httpSettings);

import { ensureIndex } from '../utils/build-index.js';

const dbSettings = require('../config/database.json').scheduled;
debug("Loaded scheduled-db settings %O", dbSettings);

debug("Verifying and configuring databases (scheduled)");
if(!await ensureIndex(dbSettings, 'scheduled')) {
    console.log("Database fatal error (scheduled)");
    process.exit(1);
}

/* this application requires to access scheduled and submission
 * because performs Joint queries equivalent */
const extraDbSettings = require('../config/database.json').submission;
debug("Loaded submission-db settings %O", extraDbSettings);

if(!await ensureIndex(extraDbSettings, 'submission')) {
    console.log("Database fatal error (submission)");
    process.exit(1);
}

if(extraDbSettings.mongodb !== dbSettings.mongodb) {
    console.log("Setup error: submission and scheduled can't work in different mongodb");
    process.exit(1);
}

import { bindHTTPServer } from '../utils/express.js';
await bindHTTPServer(
    require('../src/scheduled/http.js'),
    httpSettings,
    dbSettings);

debug("HTTP server for Submission API ready");
