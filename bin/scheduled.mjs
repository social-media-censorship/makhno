#!node_modules/.bin/zx

import logger from 'debug';
const debug = logger('bin:scheduled');

const httpSettings = require('../config/http.json').scheduled;
debug("Loaded HTTP settings %O", httpSettings);

const dbSettings = require('../config/database.json').scheduled;
debug("Loaded database settings %O", dbSettings);

import { ensureIndex } from '../utils/build-index.js';

debug("Verifying and configuring database");
if(!await ensureIndex(dbSettings, 'scheduled')) {
    console.log("Database fatal error");
    process.exit(1);
}

import { bindHTTPServer } from '../utils/express.js';
await bindHTTPServer(
    require('../src/scheduled/http.js'),
    httpSettings,
    dbSettings);

debug("HTTP server for Submission API ready");
