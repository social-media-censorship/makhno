#!node_modules/.bin/zx

import logger from 'debug';
const debug = logger('bin:submission');

const httpSettings = require('../config/http.json').submission;
debug("Loaded HTTP settings %O", httpSettings);

const dbSettings = require('../config/database.json').submission;
debug("Loaded database settings %O", dbSettings);

import { ensureIndex } from '../utils/build-index.js';

debug("Verifying and configuring database");
if(!await ensureIndex(dbSettings, 'submission')) {
    console.log("Database fatal error");
    process.exit(1);
}

import { bindHTTPServer } from '../utils/express.js';
await bindHTTPServer(
    require('../src/submission/http.js'),
    httpSettings,
    dbSettings);

debug("HTTP server for Submission API ready");
