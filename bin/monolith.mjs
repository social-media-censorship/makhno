#!node_modules/.bin/zx

import _ from 'lodash';
import { bindHTTPServer } from '../utils/express.js';
import { ensureIndex } from '../utils/build-index.js';

const debug = require('debug')('monolith');
const dbSettings = require('../config/database.json');

// execute ensureIndex for 'submission', 'scheduled', and 'results'
debug("Verifying and configuring database");
if(!await ensureIndex(dbSettings.submission, 'submission')) {
    console.log(`Database fatal error (submission)¹`);
    process.exit(1);
}
if(!await ensureIndex(dbSettings.scheduled, 'scheduled')) {
    console.log(`Database fatal error (scheduled)²`);
    process.exit(1);
}
if(!await ensureIndex(dbSettings.results, 'results')) {
    console.log(`Database fatal error (results)³`);
    process.exit(1);
}

// bind the HTTP server in port 3000 and export API
// for submission, scheduled, and results

const routes = _.concat(
    require('../src/submission/http2.js').routes,
    require('../src/scheduled/http.js').routes,
    require('../src/results/http.js').routes,
);

// we know all the dbSettings[$key].mongodb are the same
// so we can use dbSettings.submission
await bindHTTPServer(
    { routes },
    { port: 3000 },
    dbSettings.submission
);
