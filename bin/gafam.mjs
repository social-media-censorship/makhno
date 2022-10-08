#!node_modules/.bin/zx

import logger from 'debug';
const debug = logger('bin:gafam');

const httpSettings = require('../config/http.json').gafam;
debug("Loaded HTTP settings %O", httpSettings);

const dbSettings = require('../config/database.json').gafam;
debug("Loaded database settings %O", dbSettings);

import { bindHTTPServer } from '../utils/express.js';
await bindHTTPServer(
    require('../src/gafam/http.js'),
    httpSettings,
    dbSettings);

debug("HTTP server for GAFAM API ready");
