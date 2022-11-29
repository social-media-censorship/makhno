#!node_modules/.bin/zx
import { argv, fs, path } from 'zx';
import logger from 'debug';
import _ from 'lodash';

const debug = logger('bin:process-output');
const { report } = require('../utils/cli');


if(!argv.logfile) {
  console.log(`--logfile is mandatory`);
  process.exit(1);
}

const payload = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: null
};

if(!fs.existsSync(argv.logfile)) {
  console.log(`file ${argv.logfile} not found`);
  process.exit(1);
}

if(!argv.url) {
  console.log(`Mandatory is also --url`);
  process.exit(1);
}

const server = argv.remote ?
  "https://makhno.net" : "http://localhost:2001";

const curlo = fs.readFileSync(argv.logfile, 'utf-8');
const html = curlo.split('\n\r')[1];
if(html.length < 1000) {
  console.log(`check the file please ${html.length}`);
  process.exit(1);
}
console.log(`HTML size ${html.length}`);

payload.body = JSON.stringify({
  html,
  source: 'curl',
  targetURL: argv.url,
  countryCode: "IO",
});

debug("Sending HTML to the GAFAM parse API");
await report(
  await fetch(`${server}/gafam/parse`, payload),
  `POST ${argv.logfile} to API /gafam/parse`
);
